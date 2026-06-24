import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "coordinator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all metrics in parallel
    const [
      totalStudents,
      totalLecturers,
      totalExternalPanelists,
      totalSeminarGroups,
      totalProjectGroups,
      portalState,
      // Count students assigned to groups
      studentsInSeminarGroups,
      studentsInProjectGroups,
      // Count supervisors assigned to groups
      supervisorsInGroups,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.lecturer.count(),
      prisma.externalPanelist.count(),
      prisma.seminarGroup.count(),
      prisma.projectGroup.count(),
      prisma.portalState.findFirst(),
      prisma.seminarGroupMember.count(),
      prisma.projectGroupMember.count(),
      prisma.supervisor.count(),
    ]);

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalLecturers,
        totalExternalPanelists,
        totalSeminarGroups,
        totalProjectGroups,
        // For the UI's "assigned / total" display
        studentsAssignedToSeminar: studentsInSeminarGroups,
        studentsAssignedToProject: studentsInProjectGroups,
        supervisorsAssigned: supervisorsInGroups,
      },
      portalState: {
        seminarPortalOpen: portalState?.seminar_portal_open ?? false,
        projectPortalOpen: portalState?.project_portal_open ?? false,
      },
      // Progress data will be empty until we have real submissions
      projectProgress: [],
      seminarProgress: [],
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data." }, { status: 500 });
  }
}