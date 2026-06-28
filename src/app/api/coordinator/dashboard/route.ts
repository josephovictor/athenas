import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if ((session.user as any)?.role !== "coordinator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      seminarGroups,
      projectGroups,
      lecturers,
      students,
      supervisors,
      seminarPanelists,
      projectPanelists,
      externalPanelists,
    ] = await Promise.all([
      // Seminar groups with member count
      prisma.seminarGroup.findMany({
        include: {
          members: { select: { student_mat_number: true } },
        },
        orderBy: { name: "asc" },
      }),

      // Project groups with supervisor and member count
      prisma.projectGroup.findMany({
        include: {
          members: { select: { student_mat_number: true } },
          supervisors: {
            include: {
              lecturer: { select: { name: true } },
            },
          },
        },
        orderBy: { name: "asc" },
      }),

      // Lecturers with their role assignments
      prisma.lecturer.findMany({
        include: {
          user: { select: { is_activated: true, email: true } },
          supervisors: { select: { id: true } },
          seminar_panels: { select: { id: true } },
          project_panels: { select: { id: true } },
        },
        orderBy: { name: "asc" },
      }),

      // Students with activation status
      prisma.student.findMany({
        include: {
          user: { select: { is_activated: true } },
        },
        orderBy: [{ surname: "asc" }, { firstname: "asc" }],
      }),

      // Supervisors with their assigned group
      prisma.supervisor.findMany({
        include: {
          lecturer: { select: { name: true, area_of_specialization: true } },
          project_group: { select: { name: true } },
        },
        orderBy: { lecturer: { name: "asc" } },
      }),

      // Internal seminar panelists
      prisma.seminarPanelist.findMany({
        where: { type: "internal", lecturer_id: { not: null } },
        include: {
          lecturer: { select: { name: true, area_of_specialization: true } },
          panel: { select: { group_id: true } },
        },
      }),

      // Internal project panelists
      prisma.projectPanelist.findMany({
        where: { type: "internal", lecturer_id: { not: null } },
        include: {
          lecturer: { select: { name: true, area_of_specialization: true } },
          panel: { select: { group_id: true } },
        },
      }),

      // External panelists with activation status
      prisma.externalPanelist.findMany({
        include: {
          user: { select: { is_activated: true } },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    // Determine role labels for each lecturer
    const lecturerItems = lecturers.map((l) => {
      const roles: string[] = [];
      if (l.supervisors.length > 0) roles.push("Supervisor");
      if (l.seminar_panels.length > 0) roles.push("Seminar Panelist");
      if (l.project_panels.length > 0) roles.push("Project Panelist");

      return {
        id: l.id,
        name: l.name,
        specialization: l.area_of_specialization,
        roles: roles.length > 0 ? roles.join(", ") : "No role assigned",
        activated: l.user?.is_activated ?? false,
        email: l.user?.email ?? l.email ?? "",
      };
    });

    // Compliance data
    const activatedStudents = students.filter((s) => s.user?.is_activated);
    const notActivatedStudents = students.filter((s) => !s.user?.is_activated);

    const activatedLecturers = lecturers.filter((l) => l.user?.is_activated);
    const notActivatedLecturers = lecturers.filter((l) => !l.user?.is_activated);

    const activatedPanelists = externalPanelists.filter((p) => p.user?.is_activated);
    const notActivatedPanelists = externalPanelists.filter((p) => !p.user?.is_activated);

    return NextResponse.json({
      categories: {
        seminarGroups: {
          count: seminarGroups.length,
          items: seminarGroups.map((g) => ({
            id: g.id,
            name: g.name,
            memberCount: g.members.length,
          })),
        },
        projectGroups: {
          count: projectGroups.length,
          items: projectGroups.map((g) => ({
            id: g.id,
            name: g.name,
            memberCount: g.members.length,
            supervisor: g.supervisors[0]?.lecturer.name ?? "Unassigned",
          })),
        },
        lecturers: {
          count: lecturers.length,
          items: lecturerItems,
        },
        students: {
          count: students.length,
          items: students.map((s) => ({
            matNumber: s.mat_number,
            name: `${s.firstname} ${s.surname}`,
            activated: s.user?.is_activated ?? false,
          })),
        },
        supervisors: {
          count: supervisors.length,
          items: supervisors.map((s) => ({
            id: s.id,
            name: s.lecturer.name,
            specialization: s.lecturer.area_of_specialization,
            projectGroup: s.project_group.name,
          })),
        },
        seminarPanelists: {
          count: seminarPanelists.length,
          items: seminarPanelists.map((p) => ({
            id: p.id,
            name: p.lecturer?.name ?? "—",
            specialization: p.lecturer?.area_of_specialization ?? "—",
            groupId: p.panel.group_id,
          })),
        },
        projectPanelists: {
          count: projectPanelists.length + externalPanelists.length,
          items: [
            ...projectPanelists.map((p) => ({
              id: p.id,
              name: p.lecturer?.name ?? "—",
              type: "Internal",
              groupId: p.panel.group_id,
            })),
            ...externalPanelists.map((p) => ({
              id: p.id,
              name: p.name,
              type: "External",
              groupId: null,
            })),
          ],
        },
      },
      compliance: {
        students: {
          activated: activatedStudents.length,
          notActivated: notActivatedStudents.length,
          activatedList: activatedStudents.map((s) => ({
            matNumber: s.mat_number,
            name: `${s.firstname} ${s.surname}`,
          })),
          notActivatedList: notActivatedStudents.map((s) => ({
            matNumber: s.mat_number,
            name: `${s.firstname} ${s.surname}`,
            userId: s.user_id,
          })),
        },
        lecturers: {
          activated: activatedLecturers.length,
          notActivated: notActivatedLecturers.length,
          activatedList: activatedLecturers.map((l) => ({ id: l.id, name: l.name })),
          notActivatedList: notActivatedLecturers.map((l) => ({
            id: l.id,
            name: l.name,
            userId: l.user_id,
          })),
        },
        panelists: {
          activated: activatedPanelists.length,
          notActivated: notActivatedPanelists.length,
          activatedList: activatedPanelists.map((p) => ({ id: p.id, name: p.name })),
          notActivatedList: notActivatedPanelists.map((p) => ({
            id: p.id,
            name: p.name,
            userId: p.user_id,
          })),
        },
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard data." }, { status: 500 });
  }
}
