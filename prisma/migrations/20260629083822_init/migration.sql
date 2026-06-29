-- CreateEnum
CREATE TYPE "Role" AS ENUM ('coordinator', 'student', 'lecturer', 'external_panelist');

-- CreateEnum
CREATE TYPE "PanelType" AS ENUM ('internal', 'external');

-- CreateEnum
CREATE TYPE "PortalPanelType" AS ENUM ('seminar', 'project');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'declined');

-- CreateEnum
CREATE TYPE "TopicProposalStatus" AS ENUM ('pending', 'approved', 'declined');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('pending_confirmation', 'pending_review', 'reviewed', 'approved', 'declined');

-- CreateEnum
CREATE TYPE "ChapterState" AS ENUM ('locked', 'open', 'submitted', 'approved', 'declined');

-- CreateEnum
CREATE TYPE "SenderRole" AS ENUM ('coordinator', 'supervisor');

-- CreateEnum
CREATE TYPE "RecipientType" AS ENUM ('all', 'students', 'supervisors', 'seminar_panelists', 'project_panelists', 'project_group');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('account_activated', 'seminar_portal_opened', 'project_portal_opened', 'seminar_proposal_slot_opened', 'project_proposal_slot_opened', 'seminar_proposal_approved', 'seminar_batch_declined', 'project_proposal_approved', 'project_batch_declined', 'chapter_opened', 'chapter_approved', 'chapter_declined', 'technical_file_approved', 'technical_file_declined', 'subgroup_invitation', 'submission_confirmation_request', 'submission_expired', 'final_submission_successful', 'chapter_submitted', 'technical_file_submitted', 'final_submission_received', 'defense_files_available', 'defense_scores_open', 'all_groups_submission_complete');

-- CreateTable
CREATE TABLE "cohorts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "is_activated" BOOLEAN NOT NULL DEFAULT false,
    "profile_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinators" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "coordinators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "mat_number" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "othername" TEXT,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "level" TEXT,
    "cohort_id" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("mat_number")
);

-- CreateTable
CREATE TABLE "lecturers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "area_of_specialization" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "cohort_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_panelists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "specialization" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "external_panelists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisors" (
    "id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "project_group_id" TEXT NOT NULL,

    CONSTRAINT "supervisors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seminar_panelists" (
    "id" TEXT NOT NULL,
    "type" "PanelType" NOT NULL,
    "lecturer_id" TEXT,
    "external_panelist_id" TEXT,
    "panel_id" TEXT NOT NULL,

    CONSTRAINT "seminar_panelists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_panelists" (
    "id" TEXT NOT NULL,
    "type" "PanelType" NOT NULL,
    "lecturer_id" TEXT,
    "external_panelist_id" TEXT,
    "panel_id" TEXT NOT NULL,

    CONSTRAINT "project_panelists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seminar_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seminar_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seminar_group_members" (
    "id" TEXT NOT NULL,
    "seminar_group_id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,

    CONSTRAINT "seminar_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_group_members" (
    "id" TEXT NOT NULL,
    "project_group_id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,

    CONSTRAINT "project_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subgroups" (
    "id" TEXT NOT NULL,
    "project_group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subgroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subgroup_members" (
    "id" TEXT NOT NULL,
    "subgroup_id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,
    "invitation_status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "joined_at" TIMESTAMP(3),

    CONSTRAINT "subgroup_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_states" (
    "id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "seminar_portal_open" BOOLEAN NOT NULL DEFAULT false,
    "project_portal_open" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seminar_proposal_batches" (
    "id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,
    "batch_number" INTEGER NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seminar_proposal_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seminar_proposals" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TopicProposalStatus" NOT NULL DEFAULT 'pending',
    "coordinator_comment" TEXT,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "seminar_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seminar_reports" (
    "id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seminar_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seminar_report_files" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seminar_report_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisor_project_configurations" (
    "id" TEXT NOT NULL,
    "supervisor_id" TEXT NOT NULL,
    "student_mat_number" TEXT,
    "subgroup_id" TEXT,
    "proposal_batch_size" INTEGER,
    "is_any" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supervisor_project_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_batches" (
    "id" TEXT NOT NULL,
    "student_mat_number" TEXT,
    "subgroup_id" TEXT,
    "batch_number" INTEGER NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'pending_confirmation',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "proposal_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "status" "TopicProposalStatus" NOT NULL DEFAULT 'pending',
    "supervisor_comment" TEXT,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_confirmations" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "project_group_id" TEXT NOT NULL,
    "subgroup_id" TEXT,
    "student_mat_number" TEXT,
    "chapter_number" INTEGER NOT NULL,
    "status" "ChapterState" NOT NULL DEFAULT 'locked',
    "opened_at" TIMESTAMP(3),

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter_submissions" (
    "id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "student_mat_number" TEXT,
    "subgroup_id" TEXT,
    "file_url" TEXT NOT NULL,
    "submission_number" INTEGER NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'pending_confirmation',
    "supervisor_comment" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "chapter_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter_confirmations" (
    "id" TEXT NOT NULL,
    "chapter_submission_id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chapter_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_file_submissions" (
    "id" TEXT NOT NULL,
    "student_mat_number" TEXT,
    "subgroup_id" TEXT,
    "file_url" TEXT,
    "link_url" TEXT,
    "submission_number" INTEGER NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'pending_confirmation',
    "supervisor_comment" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "technical_file_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_file_confirmations" (
    "id" TEXT NOT NULL,
    "technical_file_submission_id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technical_file_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_submissions" (
    "id" TEXT NOT NULL,
    "student_mat_number" TEXT,
    "subgroup_id" TEXT,
    "research_file_url" TEXT NOT NULL,
    "technical_file_url" TEXT,
    "technical_link_url" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "final_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_submission_confirmations" (
    "id" TEXT NOT NULL,
    "final_submission_id" TEXT NOT NULL,
    "student_mat_number" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "final_submission_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panels" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "panel_type" "PortalPanelType" NOT NULL,
    "files_available" BOOLEAN NOT NULL DEFAULT false,
    "scores_available" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panel_members" (
    "id" TEXT NOT NULL,
    "panel_id" TEXT NOT NULL,
    "seminar_panelist_id" TEXT,
    "project_panelist_id" TEXT,

    CONSTRAINT "panel_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoring_rubrics" (
    "id" TEXT NOT NULL,
    "panel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scoring_rubrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoring_criteria" (
    "id" TEXT NOT NULL,
    "rubric_id" TEXT NOT NULL,
    "criterion_name" TEXT NOT NULL,
    "max_score" INTEGER NOT NULL,

    CONSTRAINT "scoring_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "panel_id" TEXT NOT NULL,
    "seminar_panelist_id" TEXT,
    "project_panelist_id" TEXT,
    "student_mat_number" TEXT,
    "subgroup_id" TEXT,
    "criterion_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_feedbacks" (
    "id" TEXT NOT NULL,
    "panel_id" TEXT NOT NULL,
    "seminar_panelist_id" TEXT,
    "project_panelist_id" TEXT,
    "student_mat_number" TEXT,
    "subgroup_id" TEXT,
    "feedback_text" TEXT NOT NULL,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "defense_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_role" "SenderRole" NOT NULL,
    "recipient_type" "RecipientType" NOT NULL,
    "recipient_group_id" TEXT,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "action_url" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coordinators_user_id_key" ON "coordinators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE INDEX "students_cohort_id_idx" ON "students"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_email_key" ON "lecturers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_user_id_key" ON "lecturers"("user_id");

-- CreateIndex
CREATE INDEX "lecturers_cohort_id_idx" ON "lecturers"("cohort_id");

-- CreateIndex
CREATE UNIQUE INDEX "external_panelists_email_key" ON "external_panelists"("email");

-- CreateIndex
CREATE UNIQUE INDEX "external_panelists_user_id_key" ON "external_panelists"("user_id");

-- CreateIndex
CREATE INDEX "external_panelists_cohort_id_idx" ON "external_panelists"("cohort_id");

-- CreateIndex
CREATE INDEX "supervisors_lecturer_id_idx" ON "supervisors"("lecturer_id");

-- CreateIndex
CREATE INDEX "supervisors_project_group_id_idx" ON "supervisors"("project_group_id");

-- CreateIndex
CREATE INDEX "seminar_panelists_panel_id_idx" ON "seminar_panelists"("panel_id");

-- CreateIndex
CREATE INDEX "project_panelists_panel_id_idx" ON "project_panelists"("panel_id");

-- CreateIndex
CREATE INDEX "seminar_groups_cohort_id_idx" ON "seminar_groups"("cohort_id");

-- CreateIndex
CREATE INDEX "project_groups_cohort_id_idx" ON "project_groups"("cohort_id");

-- CreateIndex
CREATE INDEX "seminar_group_members_seminar_group_id_idx" ON "seminar_group_members"("seminar_group_id");

-- CreateIndex
CREATE INDEX "seminar_group_members_student_mat_number_idx" ON "seminar_group_members"("student_mat_number");

-- CreateIndex
CREATE UNIQUE INDEX "seminar_group_members_seminar_group_id_student_mat_number_key" ON "seminar_group_members"("seminar_group_id", "student_mat_number");

-- CreateIndex
CREATE INDEX "project_group_members_project_group_id_idx" ON "project_group_members"("project_group_id");

-- CreateIndex
CREATE INDEX "project_group_members_student_mat_number_idx" ON "project_group_members"("student_mat_number");

-- CreateIndex
CREATE UNIQUE INDEX "project_group_members_project_group_id_student_mat_number_key" ON "project_group_members"("project_group_id", "student_mat_number");

-- CreateIndex
CREATE INDEX "subgroups_project_group_id_idx" ON "subgroups"("project_group_id");

-- CreateIndex
CREATE INDEX "subgroup_members_subgroup_id_idx" ON "subgroup_members"("subgroup_id");

-- CreateIndex
CREATE UNIQUE INDEX "subgroup_members_subgroup_id_student_mat_number_key" ON "subgroup_members"("subgroup_id", "student_mat_number");

-- CreateIndex
CREATE UNIQUE INDEX "portal_states_cohort_id_key" ON "portal_states"("cohort_id");

-- CreateIndex
CREATE INDEX "seminar_proposal_batches_student_mat_number_idx" ON "seminar_proposal_batches"("student_mat_number");

-- CreateIndex
CREATE INDEX "seminar_proposals_batch_id_idx" ON "seminar_proposals"("batch_id");

-- CreateIndex
CREATE INDEX "seminar_reports_student_mat_number_idx" ON "seminar_reports"("student_mat_number");

-- CreateIndex
CREATE INDEX "seminar_report_files_report_id_idx" ON "seminar_report_files"("report_id");

-- CreateIndex
CREATE INDEX "supervisor_project_configurations_supervisor_id_idx" ON "supervisor_project_configurations"("supervisor_id");

-- CreateIndex
CREATE INDEX "proposal_batches_student_mat_number_idx" ON "proposal_batches"("student_mat_number");

-- CreateIndex
CREATE INDEX "proposal_batches_subgroup_id_idx" ON "proposal_batches"("subgroup_id");

-- CreateIndex
CREATE INDEX "proposals_batch_id_idx" ON "proposals"("batch_id");

-- CreateIndex
CREATE INDEX "proposal_confirmations_batch_id_idx" ON "proposal_confirmations"("batch_id");

-- CreateIndex
CREATE INDEX "chapters_project_group_id_idx" ON "chapters"("project_group_id");

-- CreateIndex
CREATE INDEX "chapter_submissions_chapter_id_idx" ON "chapter_submissions"("chapter_id");

-- CreateIndex
CREATE INDEX "chapter_confirmations_chapter_submission_id_idx" ON "chapter_confirmations"("chapter_submission_id");

-- CreateIndex
CREATE INDEX "technical_file_submissions_student_mat_number_idx" ON "technical_file_submissions"("student_mat_number");

-- CreateIndex
CREATE INDEX "technical_file_confirmations_technical_file_submission_id_idx" ON "technical_file_confirmations"("technical_file_submission_id");

-- CreateIndex
CREATE INDEX "final_submissions_student_mat_number_idx" ON "final_submissions"("student_mat_number");

-- CreateIndex
CREATE INDEX "final_submission_confirmations_final_submission_id_idx" ON "final_submission_confirmations"("final_submission_id");

-- CreateIndex
CREATE INDEX "panels_group_id_idx" ON "panels"("group_id");

-- CreateIndex
CREATE INDEX "panel_members_panel_id_idx" ON "panel_members"("panel_id");

-- CreateIndex
CREATE INDEX "scoring_rubrics_panel_id_idx" ON "scoring_rubrics"("panel_id");

-- CreateIndex
CREATE INDEX "scoring_criteria_rubric_id_idx" ON "scoring_criteria"("rubric_id");

-- CreateIndex
CREATE INDEX "scores_panel_id_idx" ON "scores"("panel_id");

-- CreateIndex
CREATE INDEX "defense_feedbacks_panel_id_idx" ON "defense_feedbacks"("panel_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_id_idx" ON "notifications"("recipient_id");

-- AddForeignKey
ALTER TABLE "coordinators" ADD CONSTRAINT "coordinators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturers" ADD CONSTRAINT "lecturers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturers" ADD CONSTRAINT "lecturers_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_panelists" ADD CONSTRAINT "external_panelists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_panelists" ADD CONSTRAINT "external_panelists_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisors" ADD CONSTRAINT "supervisors_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisors" ADD CONSTRAINT "supervisors_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_panelists" ADD CONSTRAINT "seminar_panelists_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_panelists" ADD CONSTRAINT "seminar_panelists_external_panelist_id_fkey" FOREIGN KEY ("external_panelist_id") REFERENCES "external_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_panelists" ADD CONSTRAINT "seminar_panelists_panel_id_fkey" FOREIGN KEY ("panel_id") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_panelists" ADD CONSTRAINT "project_panelists_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_panelists" ADD CONSTRAINT "project_panelists_external_panelist_id_fkey" FOREIGN KEY ("external_panelist_id") REFERENCES "external_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_panelists" ADD CONSTRAINT "project_panelists_panel_id_fkey" FOREIGN KEY ("panel_id") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_groups" ADD CONSTRAINT "seminar_groups_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_groups" ADD CONSTRAINT "project_groups_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_group_members" ADD CONSTRAINT "seminar_group_members_seminar_group_id_fkey" FOREIGN KEY ("seminar_group_id") REFERENCES "seminar_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_group_members" ADD CONSTRAINT "seminar_group_members_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_group_members" ADD CONSTRAINT "project_group_members_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_group_members" ADD CONSTRAINT "project_group_members_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subgroups" ADD CONSTRAINT "subgroups_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subgroup_members" ADD CONSTRAINT "subgroup_members_subgroup_id_fkey" FOREIGN KEY ("subgroup_id") REFERENCES "subgroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subgroup_members" ADD CONSTRAINT "subgroup_members_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_states" ADD CONSTRAINT "portal_states_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_proposal_batches" ADD CONSTRAINT "seminar_proposal_batches_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_proposals" ADD CONSTRAINT "seminar_proposals_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "seminar_proposal_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_reports" ADD CONSTRAINT "seminar_reports_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seminar_report_files" ADD CONSTRAINT "seminar_report_files_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "seminar_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisor_project_configurations" ADD CONSTRAINT "supervisor_project_configurations_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "supervisors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisor_project_configurations" ADD CONSTRAINT "supervisor_project_configurations_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisor_project_configurations" ADD CONSTRAINT "supervisor_project_configurations_subgroup_id_fkey" FOREIGN KEY ("subgroup_id") REFERENCES "subgroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_batches" ADD CONSTRAINT "proposal_batches_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_batches" ADD CONSTRAINT "proposal_batches_subgroup_id_fkey" FOREIGN KEY ("subgroup_id") REFERENCES "subgroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "proposal_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_confirmations" ADD CONSTRAINT "proposal_confirmations_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "proposal_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_confirmations" ADD CONSTRAINT "proposal_confirmations_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_project_group_id_fkey" FOREIGN KEY ("project_group_id") REFERENCES "project_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subgroup_id_fkey" FOREIGN KEY ("subgroup_id") REFERENCES "subgroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_submissions" ADD CONSTRAINT "chapter_submissions_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_submissions" ADD CONSTRAINT "chapter_submissions_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_submissions" ADD CONSTRAINT "chapter_submissions_subgroup_id_fkey" FOREIGN KEY ("subgroup_id") REFERENCES "subgroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_confirmations" ADD CONSTRAINT "chapter_confirmations_chapter_submission_id_fkey" FOREIGN KEY ("chapter_submission_id") REFERENCES "chapter_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_confirmations" ADD CONSTRAINT "chapter_confirmations_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_file_submissions" ADD CONSTRAINT "technical_file_submissions_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_file_submissions" ADD CONSTRAINT "technical_file_submissions_subgroup_id_fkey" FOREIGN KEY ("subgroup_id") REFERENCES "subgroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_file_confirmations" ADD CONSTRAINT "technical_file_confirmations_technical_file_submission_id_fkey" FOREIGN KEY ("technical_file_submission_id") REFERENCES "technical_file_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_file_confirmations" ADD CONSTRAINT "technical_file_confirmations_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_submissions" ADD CONSTRAINT "final_submissions_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_submissions" ADD CONSTRAINT "final_submissions_subgroup_id_fkey" FOREIGN KEY ("subgroup_id") REFERENCES "subgroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_submission_confirmations" ADD CONSTRAINT "final_submission_confirmations_final_submission_id_fkey" FOREIGN KEY ("final_submission_id") REFERENCES "final_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_submission_confirmations" ADD CONSTRAINT "final_submission_confirmations_student_mat_number_fkey" FOREIGN KEY ("student_mat_number") REFERENCES "students"("mat_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panel_members" ADD CONSTRAINT "panel_members_panel_id_fkey" FOREIGN KEY ("panel_id") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panel_members" ADD CONSTRAINT "panel_members_seminar_panelist_id_fkey" FOREIGN KEY ("seminar_panelist_id") REFERENCES "seminar_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panel_members" ADD CONSTRAINT "panel_members_project_panelist_id_fkey" FOREIGN KEY ("project_panelist_id") REFERENCES "project_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_rubrics" ADD CONSTRAINT "scoring_rubrics_panel_id_fkey" FOREIGN KEY ("panel_id") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_criteria" ADD CONSTRAINT "scoring_criteria_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "scoring_rubrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_panel_id_fkey" FOREIGN KEY ("panel_id") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_criterion_id_fkey" FOREIGN KEY ("criterion_id") REFERENCES "scoring_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_seminar_panelist_id_fkey" FOREIGN KEY ("seminar_panelist_id") REFERENCES "seminar_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_project_panelist_id_fkey" FOREIGN KEY ("project_panelist_id") REFERENCES "project_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_feedbacks" ADD CONSTRAINT "defense_feedbacks_panel_id_fkey" FOREIGN KEY ("panel_id") REFERENCES "panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_feedbacks" ADD CONSTRAINT "defense_feedbacks_seminar_panelist_id_fkey" FOREIGN KEY ("seminar_panelist_id") REFERENCES "seminar_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_feedbacks" ADD CONSTRAINT "defense_feedbacks_project_panelist_id_fkey" FOREIGN KEY ("project_panelist_id") REFERENCES "project_panelists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_group_id_fkey" FOREIGN KEY ("recipient_group_id") REFERENCES "project_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
