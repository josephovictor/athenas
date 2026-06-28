# ATHENAS
## Digital Workflow and Project Management System
### For Final-Year Students in Nigerian Universities

## ROLE DEFINITION DOCUMENT

*Version 2.3 | June 2025 | Prototype: Single Cohort*

---

> This document defines the roles, responsibilities, permissions, and interface features for each of the four user types in the Athenas platform. It is scoped to the prototype stage which supports a single cohort at a time. Every role requires a login with email and password, and the ability to reset their password via an email verification link. Submission records, messages, feedback, and scores cannot be deleted by any role. User account management is a separate operation governed by the rules defined in this document. A future version of the platform will introduce an admin role that allows multiple coordinators to manage separate cohorts simultaneously. The current architecture is designed with this expansion in mind.

---

## MESSAGING SYSTEM OVERVIEW

Athenas uses a one-way broadcast-only messaging system. No user can reply to any message through the platform. Every broadcast is delivered simultaneously as an in-app message and an email to the recipient's registered email address. This dual delivery ensures users receive important updates even when they are not logged in.

The ability to send messages is tied to having subordinates to manage. The coordinator manages everyone on the platform so they can broadcast to all groups. The supervisor manages their assigned students so they can broadcast to their project group. All other roles have no subordinates and therefore cannot send.

The supervisor is the only role that both sends and receives. They send to their assigned students and receive from the coordinator in their inbox.

The messaging icon appears in the top right for every role without exception. However what opens when clicked differs by role. Roles that can send see both an inbox and a send button. Roles that can only receive see an inbox with no send button.

**Coordinator** sends via a Send button with a dropdown. The five recipient options are: All, Students, Supervisors, Seminar Panelists, Project Panelists. The coordinator selects one option and sends. Selecting Seminar Panelists sends to every lecturer assigned to any seminar panel in the cohort. Selecting Project Panelists sends to every lecturer and external panelist assigned to any project panel in the cohort. There is no individual messaging.

**Supervisor** sends via a Send button with no dropdown. Every message goes to their entire assigned project group automatically. There are no targeting options and no individual messaging. Individual communication between a supervisor and a student happens outside the platform. The supervisor also receives coordinator broadcasts in their inbox.

**Students** receive broadcasts from the coordinator and supervisor in dedicated read-only threads. No send button.

**Lecturers assigned only as panelists** receive coordinator broadcasts in a read-only inbox. No send button. This applies whether they are assigned to seminar, project, or both panels without a supervisory role.

**External panelists** receive coordinator broadcasts in a read-only inbox. No send button.

All messages are logged with full history and timestamps and cannot be deleted. Topic and proposal approval comments are a separate process and do not appear in the messaging system.

**Broadcast messages and notifications are two completely separate channels:**

A broadcast message is human-initiated by the coordinator or supervisor. It delivers simultaneously as an in-app message in the recipient's inbox and as an email to their registered email address. Both deliveries happen automatically with every broadcast without exception.

A notification is system-generated and appears only within the platform as an alert in the notifications panel. It does not send an email. It is triggered automatically by platform events such as a chapter being approved, a proposal slot opening, or a subgroup invitation being received.

---

## Role Summary

| Role | Primary Responsibility | Access Scope | Navigation |
|---|---|---|---|
| Coordinator | Manages the entire academic workflow for the cohort | Full platform admin | Home, People, Seminar, Project |
| Student | Submits topics, proposals, reports, and project work | Own records only | Two portal cards on home page |
| Supervisor / Panelist | Guides assigned students and reviews submissions at defense | Assigned students and panels | Home + assigned role sections |
| External Panelist | Reviews project submissions and scores students at defense | Assigned project panels only | Home, Project |

---

## PLATFORM FIRST TIME SETUP

The platform ships with one pre-seeded coordinator account with no email and no password. On first visit the coordinator lands on a setup page where they enter their email and create a password. This is the only way into the platform. There is no public registration page anywhere. The only way any other user gets an account is through a coordinator-initiated CSV upload and email invitation.

After setting their credentials the coordinator is taken through a setup wizard with the following steps. Every step except the initial account creation can be skipped and returned to later. The coordinator is not locked out of the main platform while setup is incomplete.

**Setup wizard steps:**

1. Name the cohort and set the academic year.
2. Upload the student CSV.
3. Upload the lecturer CSV.
4. Assign roles to uploaded lecturers: supervisor, seminar panelist, project panelist, or a combination. A supervisor is automatically assigned as a project panelist for their own group's defense. This does not need to be done manually.
5. Create seminar and project groups and assign students.

External panelists are not part of the initial setup wizard. They are added later by uploading their CSV at any point after initial setup is complete.

---

## ROLE 1: COORDINATOR

The coordinator is the administrative hub of the Athenas platform. They set up and manage the entire workflow from cohort creation and onboarding through to opening portals, assigning roles, approving topics, monitoring progress, and managing the defense period. Every other role depends on the coordinator completing setup before they can access their interface.

The coordinator's home page is the cohort overview showing a bird's eye view of all activity across both portals. The sidebar shows Home, Seminar, and Project. Messaging, notifications, and profile are always accessible via icons in the top right of every page.

### A. Account Access

1. Set up email and password on first visit via the platform setup page.
2. Log in using email and password on subsequent visits.
3. Reset password via an email verification link.
4. Update profile details from the profile page. Any change requires authentication with the current password before the update is saved.

### B. People Management

The People page is the dedicated user management hub for the coordinator. It is accessible from the sidebar and handles all account-related actions for students, lecturers, and external panelists. It is separate from the portal pages where role assignments and group management happen.

The People page has three rounded rectangle navigation cards:

**[ Students ]   [ Lecturers ]   [ Panelists ]**

**Students page:**
Full list of all students with their mat number, name, and activation status. Actions available: upload student CSV, add individual student, plunk email invitation, delete account.

**Lecturers page:**
Full list of all lecturers with their name, area of specialisation, and activation status. Actions available: upload lecturer CSV, resend invitation, delete account. Role assignment to supervisor, seminar panelist, or project panelist happens within the relevant portal pages where the group context is available.

**Panelists page:**
Full list of all external panelists with their name, email, and activation status. Actions available: upload external panelist CSV, resend invitation, delete account.

### C. Cohort and User Management

1. Create a single cohort for the current academic session, giving it a name and academic year.

2. Add students to the cohort by uploading a CSV file. The file must contain exactly six columns in the following order: mat_number, surname, firstname, othername, email, phone_number. The platform validates the file against this structure before accepting it. If any column is missing, misnamed, or out of order the entire file is rejected and nothing is imported. The coordinator is shown which column failed. A sample row is shown on the upload screen.

**Required student CSV format:**

| mat_number | surname | firstname | othername | email | phone_number |
|---|---|---|---|---|---|
| 2023/001 | Adeyemi | Chisom | Grace | cg.adeyemi@uni.edu.ng | 08012345678 |

> Note: The othername column must be present even if a student has no other name. Leave the cell empty in that case. The upload is all or nothing. Either every record passes validation and all are imported, or the entire file is rejected and nothing is added.

3. Add lecturers to the platform by uploading a CSV file containing their name, email, and area of specialization. Each lecturer receives an invitation email to activate their account. The same all-or-nothing validation rule applies.

4. Add external panelists by uploading a CSV file containing their name and email. External panelists can be added at any point after initial setup. The same all-or-nothing validation rule applies.

5. Resend invitation emails to any user who has not yet activated their account.

6. Add an individual student outside of CSV upload for late additions to the cohort.

**User account deletion rules:**

Inactive accounts can be deleted in bulk with a single confirmation for the entire bulk action.

Active accounts require a multi-step confirmation per individual account regardless of how many are being deleted. The steps are: initiate the delete, review a summary of what will be affected including all associated records and any interaction records with other users, confirm intent to proceed, and give a final confirmation acknowledging that all records will be removed. Bulk deletion of active accounts is not permitted. Each must be confirmed individually.

### C. Seminar Portal

1. Open the seminar portal to make it accessible to students. The portal can only be opened once all students currently in the system have been assigned to a seminar group. The platform enforces this rule by checking the portal state before allowing the coordinator to toggle it open. Students added after the portal is open are assigned to a group as part of their onboarding and do not require the portal to be reopened. Seminar and project group assignments are completely independent.

2. Set the number of proposals each student must submit per batch.

3. Configure the seminar portal to accept additional file types beyond the seminar report. The coordinator communicates file requirements to students via broadcast. The file submission component always shows an Add File button so students can attach any requested files.

4. Review incoming proposal batches. Each batch opens to display all submitted topics for that student. The coordinator approves or declines each topic individually. Only one topic can be approved across all batches. Once a topic is approved the submission closes for that student. An optional comment can be left on any declined proposal.

5. Create seminar groups and assign lecturers as seminar panelists to those groups. A student with an approved proposal is eligible for group assignment at any point. The coordinator is not required to wait for all students to have approved proposals before creating groups.

6. Open seminar reports to panelists when the defense period begins. This is a manual action. There are no automated date-based triggers anywhere on the platform. The coordinator sends a broadcast to inform panelists that files are available. Every broadcast goes out as both in-app message and email simultaneously.

7. Configure the seminar defense scoring rubric before the defense period opens. Define the scoring criteria and the score scale for each criterion. The platform aggregates panelist scores automatically.

8. Open scores to panelists on defense day by toggling the scores available flag on the panel. Until this is done the scores section shows nothing with a message saying scores are not yet available.

### C1. Seminar Progress Dashboard

The seminar portal includes a live progress dashboard. Each metric card is compact and clickable. Clicking expands a split view panel showing complied students on the left and non-complied on the right.

**Seminar Progress Dashboard**

| X / N Accounts Activated | X / N Topics Approved | X / N Reports Submitted |
|---|---|---|
| Students who have logged in out of total added | Students with at least one approved seminar proposal | Students who have uploaded their seminar report |

> Note: The dashboard updates in real time.

**Outreach Action from the Seminar Dashboard**

From the expanded split view the coordinator selects defaulting students and sends a broadcast. The Send button dropdown options are: All, Students, Supervisors, Seminar Panelists, Project Panelists. Every broadcast goes out as both in-app message and email simultaneously. All outreach is logged with full history and timestamps and cannot be deleted.

### D. Project Portal

1. Open the project portal to make it accessible to students. The portal can only be opened once all students currently in the system have been assigned to a project group.

2. Create project groups and assign students, supervisors, and additional panelists including external panelists. A supervisor is automatically an internal panelist for their own group's project defense.

3. Send a broadcast to supervisors and students with the timeline for final submissions to be ready before the defense period. Every broadcast goes out as both in-app message and email simultaneously.

4. Open project final submissions to panelists when ready. This is a manual action. The coordinator toggles the files available flag on the panel. Until toggled the files section on the panelist interface shows nothing with a message saying files are not yet available.

5. Open scores to panelists on defense day by toggling the scores available flag on the panel.

6. Configure the project defense scoring rubric before the defense period opens. Define the scoring criteria and the score scale for each criterion. Scoring configuration is set independently for seminar and project defenses.

### D1. Project Progress Dashboard

The project portal includes a live progress dashboard that updates in real time. Each metric card expands into the same split compliance view as the seminar dashboard.

**Project Progress Dashboard**

| X / N Proposals Approved | X / N Final Submissions In | X / N Technical Files In |
|---|---|---|
| Students or subgroups with an approved proposal | Students whose final complete submission is in | Students who have submitted a technical file |

> Note: The project dashboard serves as the pre-defense submission tracker.

### E. Messaging

The coordinator sends broadcasts using a Send button with a dropdown. The five recipient options are: All, Students, Supervisors, Seminar Panelists, Project Panelists. There is no individual messaging. Every broadcast is delivered as both in-app message and email simultaneously.

Recipients see all coordinator messages in a dedicated Coordinator thread in their inbox. No reply is possible. All messages are logged with full history and timestamps and cannot be deleted.

---

## ROLE 2: STUDENT

The student is the primary end user of Athenas. Their experience is built around two workflows, seminar and project, each accessible only after the coordinator opens the relevant portal.

**First time experience:** After activating their account via the invitation email and setting their password, the student is prompted to complete their profile before reaching their home page. They confirm their name and set their password. One step then they are in.

**Home page:** Two large rectangular cards in the centre of the page, one for Seminar and one for Project. No sidebar. If a portal is not yet open the card shows a message saying the portal is not yet available. Messaging, notifications, and profile are accessible via icons in the top right.

**Login:** Students can log in using either their mat number or their email alongside their password.

### A. Account Access

1. Log in using mat number or email and password.
2. Reset password via a verification email sent to their registered email address.
3. Update profile details from the profile page. Any change requires authentication with the current password before the update is saved. Students can update their name, mat number, email, and phone number.

### B. Seminar Portal

Visible only after the coordinator opens it. Students manage this workflow independently with no supervisor involvement.

At the top of the seminar portal a group status indicator is always visible showing the student's assigned seminar group name. If not yet assigned it shows Not yet assigned. This sits above the navigation and is not interactive.

Below the group indicator two rounded rectangle navigation cards lead to the two sections of the seminar portal:

**Proposal page:**
The approved proposal sits at the top in its own clearly separated section. Before any topic is approved this section shows a message saying no proposal approved yet. Below that the full submission history shows all previous batches from most recent to oldest. Clicking a batch expands it to show all topics submitted in that batch, each with its status and any coordinator comment. A Submit New Batch button is active only when no topic has been approved yet. Once a topic is approved the button disappears.

**Final Report page:**
The student submits their seminar report files using the file submission component. The component displays a vertically stacked list of wide flat file slots. Each slot shows the file name once uploaded and has an X button to remove it. An Add File button is always present at the bottom to add additional slots. The coordinator communicates via broadcast which files are required. There is no separation between file types. The student adds all required files in one place.

The student also receives broadcast messages from the coordinator in a dedicated read-only Coordinator thread in their inbox. Every broadcast also arrives as an email to their registered address. No reply is possible.

### C. Project Portal

Accessible only after the coordinator opens it.

At the top of the project portal a status indicator is always visible showing the student's assigned project group name, their supervisor's name, and their subgroup name if they are in one. If any of these are not yet assigned it shows Not yet assigned. This sits above the navigation and is not interactive.

Below the status indicator three rounded rectangle navigation cards lead to the three sections of the project portal:

**Proposal page:**
The approved proposal sits at the top in its own clearly separated section. Before any proposal is approved this section shows a message saying no proposal approved yet. Below that the full submission history shows all previous batches from most recent to oldest. Clicking a batch expands it to show all proposals submitted in that batch, each with its status and any supervisor comment. A Submit New Batch button is active only when the supervisor has configured the batch size and no proposal has been approved yet. Once a proposal is approved the button disappears. For subgroup members, any member may initiate a submission. All other members receive a notification to confirm from their own account within 30 minutes. If the window expires the submission is dropped and the initiating member is notified.

**Review page:**
This is where all iterative work between the student and supervisor happens. Two rounded rectangle navigation cards lead to two sections:

Chapters: Shows a horizontal multi-step progress bar with 5 steps, one per chapter. Each step shows one of three states: Locked (greyed out, not yet opened by supervisor), Active (open for submission, highlighted), or Complete (approved, filled green). Below the progress bar the active chapter or chapters show their submission history and supervisor comments. The student submits or resubmits from here. The same 30-minute subgroup confirmation flow applies.

Technical File: The submission slot is always open. The student submits a file upload or live link using the file submission component. The full iterative history of all technical file submissions and supervisor comments is visible from most recent to oldest. Submission is optional. The same 30-minute subgroup confirmation flow applies.

**Final Report page:**
Once all chapters are approved and the technical file is approved if applicable a readiness indicator at the top confirms the student is eligible to submit. The student uses the file submission component to attach all files in one place with no separation between file types. The Add File button creates additional slots as needed. After submission the page shows a confirmation that the final report has been submitted and is awaiting the coordinator to open it to panelists. The submit button remains inactive until all preceding approvals are complete.

The student also receives broadcast messages in a structured inbox. Their inbox contains a dedicated Coordinator thread and a Supervisor thread. Every broadcast also arrives as an email to their registered address. No reply is possible.

> Note: All submission records are immutable. Once a submission is made it cannot be deleted. Resubmission creates a new record alongside the original.

---

## ROLE 3: SUPERVISOR AND PANELIST

Lecturers on Athenas do not have a generic lecturer role. They exist on the platform only in the context of roles assigned to them by the coordinator. The available roles are supervisor, seminar panelist, and project panelist. A lecturer can hold any combination of these simultaneously. A supervisor is always automatically a project panelist for their own group's defense.

**First time experience:** After activating their account the lecturer is prompted to complete their profile before reaching their home page. They confirm their name and set their password. If no roles have been assigned yet the home page shows a message saying they have not been assigned a role yet.

**Navigation sidebar:** The sidebar reflects only the roles the lecturer has been assigned to. The possible combinations are:

A lecturer assigned as supervisor only: Home, Supervisor, Project.

A lecturer assigned as supervisor and seminar panelist: Home, Supervisor, Seminar, Project.

A lecturer assigned as seminar panelist only: Home, Seminar.

A lecturer assigned as project panelist only: Home, Project.

A lecturer assigned as both seminar and project panelist without a supervisory role: Home, Seminar, Project.

A lecturer with no assignment yet: Home only with a message saying they have not been assigned a role yet.

Messaging, notifications, and profile are accessible via icons in the top right of every page. For lecturers assigned only as panelists the messaging icon opens a read-only inbox with no send capability. For lecturers with a supervisory role the messaging icon opens both an inbox and a send button.

### A. Account Access

1. Log in using email and password.
2. Reset password via an email verification link.
3. Update profile details from the profile page. Any change requires authentication with the current password before the update is saved.

### B. Supervisor Page

The supervisor page is the main working area for managing assigned students. At the top two metric cards sit side by side: Group Name showing the assigned project group, and Number of Students which is clickable and expands to show the full list of assigned students with their mat number, name, and current project status. Subgroup management is accessible from within the student list by clicking an individual student.

Below the metric cards three rounded rectangle navigation cards lead to the three sections:

**Proposal page:** The supervisor receives and reviews proposal batches from assigned students and subgroups. Each batch shows all proposals with their file attachments. The supervisor approves or declines each proposal individually and leaves optional comments on declined ones.

**Review page:** Two rounded rectangle navigation cards lead to two sections. Chapters: The supervisor sees the same 5-step horizontal progress bar as the student. The supervisor controls which chapters are open by selecting consecutive chapters and clicking Open Chapters. They review submitted chapters, leave comments, and approve or decline. Technical File: The supervisor reviews iterative technical file submissions, leaves comments, and approves or declines. Once approved the supervisor clicks Mark Technical File Complete.

**Final Report page:** The supervisor reviews the student's final complete submission to confirm everything is in order before the coordinator opens it to panelists.

**Supervisor Progress Tracker**

At the top of the Supervisor page three metric cards show chapter-based progress across all assigned students:

| X / N Proposals Approved | X / N Chapters Complete | X / N Final Reports Submitted |
|---|---|---|
| Assigned students with an approved proposal | Students with all 5 chapters approved | Students who have submitted their final report |

*Clicking any metric card expands into a split view: complied on the left, not complied on the right. The outreach broadcast button is available from the expanded view.*

### C. Subgroup Management

Subgroup management is accessible from within the student list on the Supervisor page. Clicking an individual student reveals their details and subgroup options.

1. Create a subgroup after agreement has been reached with students outside the platform. The supervisor creates the subgroup on the platform and sends invitations to the relevant students.
2. Each invited student receives a notification and must accept from their own account. The platform tracks each invitation as pending, accepted, or declined. The subgroup becomes active only once all invited members have accepted.
3. Set the proposal batch size for each student or subgroup. Options are a fixed number or any, meaning the student decides how many proposals to include. The submission slot is locked until this is set. The student receives a notification when the slot opens.

### D. Proposal Review

1. Receive proposal batches from assigned students and subgroups.
2. Review all proposals in a batch with their file attachments.
3. Approve or decline each proposal individually. Only one proposal can be approved. Once approved the submission closes.
4. Leave an optional comment on any declined proposal.

### E. Supervisor Messaging

The supervisor is the only role that both sends and receives. They send broadcasts to their entire assigned project group using a Send button with no dropdown. There are no targeting options and no individual messaging. Every broadcast goes out as both in-app message and email simultaneously. Individual communication between the supervisor and a student happens outside the platform.

The supervisor also receives coordinator broadcasts in their own inbox in a dedicated read-only Coordinator thread. No reply to the coordinator is possible.

All messages are logged with full history and timestamps and cannot be deleted. Recipients see all supervisor messages in a dedicated thread labelled with the supervisor's name in their inbox. No reply is possible.

### F. Research Submission Review

1. Open research chapters progressively for assigned students and subgroups. The project defaults to 5 chapters. All 5 slots are visible to students from the start. The supervisor opens chapters in sequential order, one at a time or multiple consecutive chapters at once. Chapters cannot be skipped.

2. Review each submitted chapter and leave written comments.

3. Approve or decline each chapter. The student revises and resubmits until approved. Each resubmission creates a new record. The next chapter only becomes available once preceding chapters are approved.

4. Once all chapters are approved click Mark Research Report Complete.

### G. Technical File Review

The technical file slot is always open once the project portal is open. Submission is optional for students. The supervisor communicates via broadcast who needs to submit a technical file. The supervisor reviews iteratively, leaving comments to guide the process. Each submission creates a new record and a full history is maintained. Accepted formats are file uploads and live links.

Once the final technical submission is approved click Mark Technical File Complete.

The 30-minute subgroup confirmation flow applies for subgroup members before a submission reaches the supervisor.

### H. Final Submission Review

Once a student has all chapters approved and their technical file approved if applicable, the student submits their final complete package. The supervisor reviews this final submission to confirm everything is in order before the coordinator opens it to panelists.

### I. Panelist: Seminar Defense

This section is visible only if the coordinator has assigned the lecturer as a seminar panelist.

1. Access submitted seminar reports and any additional files for assigned students once the coordinator opens them.
2. On defense day, score each student against the criteria configured by the coordinator. The scoring rubric and scale are displayed on the scoring interface. The platform aggregates scores automatically.
3. Submit written feedback per student and confirm and lock the score submission. Scores and feedback are visible to the coordinator internally but are not released to students through the platform. Result release is handled by the institution's existing result system.

### J. Panelist: Project Defense

This section is visible to all supervisors as they are always project panelists for their own group, and to any lecturer assigned as a project panelist by the coordinator.

On the project defense page the panelist sees a list of assigned students with their mat numbers. Each student entry has two rounded rectangle buttons: Files and Scores.

Files: Initially shows nothing with a message saying files are not yet available. Once the coordinator toggles files open the panelist can click a student's name to view their final submission including research document and technical file if applicable.

Scores: Initially shows nothing with a message saying scores are not yet available. Only opens on defense day when the coordinator toggles scores open.

1. Access and review final submissions for assigned students before defense day once files are opened by the coordinator.
2. On defense day, score individual students or subgroups against the criteria configured by the coordinator. The platform aggregates scores automatically.
3. Submit written feedback per student or subgroup.
4. Confirm and lock score submission. Results are not released to students through the platform.

> Note: Supervisors are scoped only to their assigned students for project supervision. They cannot view other supervisors' students or access another supervisor's project dashboard.

---

## ROLE 4: EXTERNAL PANELIST

External panelists are individuals from outside the department who are brought in for the project defense only. They are added by the coordinator via CSV upload after initial setup. External panelists have no messaging capability whatsoever. No inbox and no outbox.

**First time experience:** After activating their account the external panelist is prompted to complete their profile before reaching their home page. They confirm their name and set their password.

**Navigation:** Home and Project in the sidebar. Messaging icon, notifications, and profile accessible via icons in the top right. The messaging icon opens a read-only inbox only.

### A. Account Access

1. Log in using email and password.
2. Reset password via an email verification link.
3. Update profile details from the profile page. Any change requires authentication with the current password.

### B. Project Defense

The external panelist sees the same project defense interface as the internal project panelist. A list of assigned students with their mat numbers. Each student entry has two rounded rectangle buttons: Files and Scores.

Files: Shows nothing with a message saying files are not yet available until the coordinator opens them. Once open the panelist clicks a student to view their final submission.

Scores: Shows nothing with a message saying scores are not yet available until the coordinator opens them on defense day.

1. Review final submissions for assigned students once files are available.
2. Score students against the coordinator-configured rubric on defense day.
3. Submit written feedback per student or subgroup.
4. Confirm and lock score submission.

---

## PERMISSION SUMMARY

| Permission | Coordinator | Student | Supervisor | Panelist (Internal) | Panelist (External) |
|---|---|---|---|---|---|
| Platform first-time setup | Yes | No | No | No | No |
| Log in and reset password | Yes | Yes | Yes | Yes | Yes |
| Log in with mat number | No | Yes | No | No | No |
| Update profile with password confirmation | Yes | Yes | Yes | Yes | Yes |
| Create and manage the cohort | Yes | No | No | No | No |
| Upload users via CSV (all or nothing) | Yes | No | No | No | No |
| Add individual student | Yes | No | No | No | No |
| Delete inactive accounts in bulk (one confirmation) | Yes | No | No | No | No |
| Delete active accounts individually (multi-step) | Yes | No | No | No | No |
| Resend activation emails | Yes | No | No | No | No |
| Assign supervisor and panelist roles to lecturers | Yes | No | No | No | No |
| Open seminar and project portals | Yes | No | No | No | No |
| Configure defense scoring rubric | Yes | No | No | No | No |
| Toggle files and scores available for panelists | Yes | No | No | No | No |
| Approve seminar proposals | Yes | No | No | No | No |
| Create seminar and project groups | Yes | No | No | No | No |
| View seminar and project dashboards | Yes | No | Yes | Limited | No |
| Send broadcast via dropdown (All, Students, Supervisors, Seminar Panelists, Project Panelists) | Yes | No | No | No | No |
| Send broadcast to entire assigned project group | No | No | Yes (supervisors only) | No | No |
| Dual delivery of all broadcasts (in-app and email) | Yes | No | Yes (supervisors only) | No | No |
| Receive broadcasts in inbox (in-app and email, no reply) | No | Yes | Yes | Yes | Yes |
| Messaging icon visible in top right | Yes | Yes | Yes | Yes | Yes |
| Send button visible in messaging | Yes | No | Yes (supervisors only) | No | No |
| Submit seminar proposals | No | Yes | No | No | No |
| Submit seminar report files | No | Yes | No | No | No |
| Submit project proposals | No | Yes | No | No | No |
| Confirm subgroup submission (30 min window) | No | Yes | No | No | No |
| Submit research chapters | No | Yes | No | No | No |
| Submit technical files | No | Yes | No | No | No |
| Submit final complete submission | No | Yes | No | No | No |
| Accept subgroup invitation | No | Yes | No | No | No |
| Set proposal batch size or any | No | No | Yes | No | No |
| Create subgroups | No | No | Yes | No | No |
| Open research chapters progressively | No | No | Yes | No | No |
| Review submissions and leave comments | No | No | Yes | No | No |
| Approve or decline proposals and chapters | No | No | Yes | No | No |
| Mark research report complete | No | No | Yes | No | No |
| Mark technical file complete | No | No | Yes | No | No |
| Review final submissions before defense | No | No | Yes | Yes | Yes |
| Score students at defense | No | No | Yes (own group) | Yes | Yes |
| Submit written defense feedback | No | No | Yes (own group) | Yes | Yes |
| Confirm and lock score submission | No | No | Yes (own group) | Yes | Yes |
| Delete submission, message, score, or feedback records | No | No | No | No | No |

> Note: No role has delete access to any submission, feedback, score, or message record. The platform maintains an immutable audit trail across all these interactions. User account management is a separate operation governed by the deletion rules defined under the Coordinator role. This applies to the prototype and all future versions of the system.

---

*Athenas Role Definition Document | v2.3 | June 2025 | Prototype Scope: Single Cohort | Confidential*
