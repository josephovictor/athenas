import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();

    // Verify the reset secret
    if (secret !== process.env.RESET_SECRET) {
      return NextResponse.json({ error: "Invalid reset secret." }, { status: 403 });
    }

    // 1. Delete all data in correct order (respecting foreign keys)
    // Delete from child tables first
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.defenseFeedback.deleteMany();
    await prisma.score.deleteMany();
    await prisma.scoringCriterion.deleteMany();
    await prisma.scoringRubric.deleteMany();
    await prisma.panelMember.deleteMany();
    await prisma.panel.deleteMany();
    await prisma.finalSubmissionConfirmation.deleteMany();
    await prisma.finalSubmission.deleteMany();
    await prisma.technicalFileConfirmation.deleteMany();
    await prisma.technicalFileSubmission.deleteMany();
    await prisma.chapterConfirmation.deleteMany();
    await prisma.chapterSubmission.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.proposalConfirmation.deleteMany();
    await prisma.proposal.deleteMany();
    await prisma.proposalBatch.deleteMany();
    await prisma.supervisorProjectConfiguration.deleteMany();
    await prisma.seminarReportFile.deleteMany();
    await prisma.seminarReport.deleteMany();
    await prisma.seminarProposal.deleteMany();
    await prisma.seminarProposalBatch.deleteMany();
    await prisma.portalState.deleteMany();
    await prisma.subgroupMember.deleteMany();
    await prisma.subgroup.deleteMany();
    await prisma.projectGroupMember.deleteMany();
    await prisma.seminarGroupMember.deleteMany();
    await prisma.projectGroup.deleteMany();
    await prisma.seminarGroup.deleteMany();
    await prisma.projectPanelist.deleteMany();
    await prisma.seminarPanelist.deleteMany();
    await prisma.supervisor.deleteMany();
    await prisma.externalPanelist.deleteMany();
    await prisma.lecturer.deleteMany();
    await prisma.student.deleteMany();
    await prisma.coordinator.deleteMany();
    
    // 2. Delete Cohort and User (these cascade to remaining relations)
    await prisma.cohort.deleteMany();
    await prisma.user.deleteMany();

    // 3. Re-seed ONLY the default Cohort (No Coordinator)
    await prisma.cohort.create({
      data: {
        name: "2025/2026 Cohort",
        academic_year: "2025/2026",
      },
    });

    return NextResponse.json({ message: "Database wiped and re-seeded successfully." }, { status: 200 });
  } catch (error) {
    console.error("Dev reset error:", error);
    return NextResponse.json({ error: "Failed to reset database." }, { status: 500 });
  }
}