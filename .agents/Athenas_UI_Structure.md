# ATHENAS
## UI Structure and Navigation Document

*Version 1.3 | June 2025 | Prototype: Single Cohort*

---

ALL DESIGN THAT REQUIRES DATABASE DATA MUST USE SKELETON LOADING IN PLACE OF DIRECT DATA FETCHING USING REACT-LOADING-SCREEN

> This document defines the screen layout, navigation flow, and interface structure for every role on the Athenas platform. It is intended to be read alongside the Role Definition Document v2.0 and the Technical Specification v1.5. All spelling follows British English conventions.

---

## DESIGN PRINCIPLES

### Rounded Rectangle Navigation Pattern
Wherever a page has multiple functions that each lead to their own dedicated page, those functions are represented as clickable rounded rectangle navigation cards. This is the consistent navigation pattern across every role and every section of the platform. It is never replaced with tabs or plain buttons.

### Status Indicators
Information the user needs to see but cannot act on is presented as a status indicator. It sits above the navigation cards and is always visible within its portal. It is not interactive.

### File Submission Component
Used consistently across all file upload actions on the platform. It displays a vertically stacked list of wide flat file slots. Each slot shows the file name once uploaded and has an X button at the right to remove it. An Add File button is always present at the bottom to create additional slots. There is no limit on the number of slots.

### Compliance Split View
Used consistently across all dashboard compliance views. Clicking a metric card expands a window with two tabs: Compliant and Not Compliant. Only one tab is active at a time. Clicking a tab replaces the content with that list. The previous content is removed.

### Progress Bar with Ratio
Used in submission tracking views. Each group shows a horizontal progress bar that fills proportionally based on the number of submissions. Alongside the bar a ratio label shows x/y where x is the number submitted and y is the total number of students in that group. When a group reaches full submission the progress bar is replaced by the word Complete displayed in bright green inside a rounded rectangular border.

### Chapter Progress Bar
Used in the Review section for both students and supervisors. A horizontal multi-step progress bar with 5 steps, one per chapter. Each step shows one of three states: Locked displayed in grey, Active displayed in a highlighted colour, or Complete displayed in filled green. The bar gives both parties a clear visual picture of progress at all times.

### Top Right Icons
Present on every page for every role without exception. Three icons in the top right corner: Messaging, Notifications, and Profile. The Messaging icon opens the inbox for all roles. Roles with send capability also see a Send button within the messaging interface. Roles without send capability see a read-only inbox only.

---

## PLATFORM ENTRY POINT

### First Time Setup Page
Shown only on the very first visit to the platform. The coordinator enters their email address and creates a password. This is the only way into the platform. No other user can access the platform until this step is completed.

After setup the coordinator is taken to the Setup Wizard.

### Setup Wizard
A guided flow with skippable steps. The coordinator is not locked out of the main platform if steps are skipped. Each step can be returned to at any time.

Step 1: Name the cohort and set the academic year.
Step 2: Upload the student CSV.
Step 3: Upload the lecturer CSV.
Step 4: Assign roles to uploaded lecturers.
Step 5: Create groups and assign students.

External panelists are added separately outside the wizard at any point after initial setup.

### Login Page
Shown on all subsequent visits for all roles. Fields: Username (email or mat number for students, email only for all other roles) and Password. A Forgot Password link triggers a reset email to the registered address.

### Profile Completion Page
Shown to every role on their first login after account activation. The user confirms their name and sets their password. One step then they proceed to their home page.

---

## COORDINATOR INTERFACE

### Sidebar Navigation
Home, Seminar, Project.

### Home Page

**Top section — Seven metric cards in three rows:**

Row 1 (three cards): Seminar Groups, Project Groups, Lecturers.
Row 2 (two cards): Students, Supervisors.
Row 3 (two cards): Seminar Panelists, Project Panelists.

Each card displays the total count for that category. All cards are clickable and expand inline below the card to show the full list for that category. Clicking again collapses the list.

**Bottom section — Three compliance cards:**

Students, Lecturers, Panelists.

Each compliance card displays the activation status at a glance, for example 98 activated / 4 not activated. Clicking a card expands a tabbed window with two tabs: Compliant and Not Compliant. Clicking a tab replaces the content with that list. A Resend Invitation action is available on each non-compliant entry.

---

### People Page

Three rounded rectangle navigation cards:

**[ Students ]   [ Lecturers ]   [ Panelists ]**

**Students page:** Full list of all students showing mat number, name, and activation status. Actions: upload CSV, add individual, resend invitation, delete account.

**Lecturers page:** Full list of all lecturers showing name, area of specialisation, and activation status. Actions: upload CSV, resend invitation, delete account. Role assignments happen in the portal pages.

**Panelists page:** Full list of all external panelists showing name, email, and activation status. Actions: upload CSV, resend invitation, delete account.

---

### Seminar Portal

Five rounded rectangle navigation cards on the Seminar portal landing page:

**[ Proposals ]   [ Groups ]   [ Panelists ]   [ Submission ]   [ Defence ]**

---

#### Proposals Page

A list of all students is displayed with their current proposal status shown clearly alongside their name. Status options are: Approved (green), Declined (red), Pending (amber), Not Submitted (grey).

Only students with Approved status can be selected for group assignment.

**Drill-down navigation:**
Clicking a student opens their full topic history showing all submitted batches in order from most recent to oldest. Clicking a batch within that view shows all individual topics submitted in that batch, each displaying its status and any coordinator comment.

**Coordinator actions on the Topics page:**
Approve or decline individual topics within a batch. Leave an optional comment on any declined topic. Select one or more approved students and click Add to Group. The Add to Group action opens a dropdown showing all existing groups with Create New Group as the first option. This is the only way seminar groups are created on the platform.

---

#### Groups Page

Shows all existing seminar groups. Each group card displays the group name, number of members, and assigned panelists at a glance.

Clicking a group opens its detail view showing:

A list of all assigned members. Each member has an X button to remove them from the group. An Add Student button opens an autocomplete scroll menu showing only approved students not yet assigned to a group.

Assigned panelists listed below the members. Each panelist has an X button to remove them. An Add Panelist button opens an autocomplete scroll menu pulling from the full lecturer list.

---

#### Panelists Page (Seminar)

A list of all lecturers assigned as seminar panelists. Each row shows the lecturer name, area of specialisation, and the seminar group they are assigned to. The coordinator can view all seminar panel assignments at a glance from this page.

---

#### Submission Page

Shows all seminar groups, each with a progress bar and x/y ratio.

When all members of a group have submitted their final report the progress bar is replaced by Complete in bright green inside a rounded rectangular border.

Clicking a group expands it to show all members with a green ticked circle for submitted and a red X circle for not submitted.

A broadcast action is available from the expanded view. The coordinator selects non-submitting students and sends a broadcast. Every broadcast goes out as both in-app message and email simultaneously.

Once all groups show Complete the Open Files to Panelists button at the top of the page becomes active. Before that it remains inactive and cannot be clicked.

---

#### Defence Page

**At the top:** Open Scores button. Inactive until defence day. The coordinator clicks this on defence day to open the scoring interface to panelists.

**Below:** Scoring rubric configuration. Horizontal strips, one per criterion. Each strip shows the criterion name and its maximum score with an X button at the right end to remove it. An Add Criterion button at the bottom adds a new strip. The coordinator adds as many criteria as needed.

---

### Project Portal

Five rounded rectangle navigation cards on the Project portal landing page:

**[ Groups ]   [ Supervisors ]   [ Panelists ]   [ Final Report ]   [ Defence ]**

---

#### Groups Page

Shows all project groups. Each group card displays the group name, assigned supervisor, and members.

Clicking a group opens its detail view showing:

A list of all assigned members. Each member has an X button to remove them. An Add Student button opens an autocomplete scroll menu.

Assigned supervisor shown with an X button to reassign. An Add Supervisor button opens an autocomplete scroll menu pulling from the supervisors list.

Assigned panelists listed below. Each panelist has an X button to remove them. An Add Panelist button opens an autocomplete scroll menu pulling from both lecturers and external panelists.

---

#### Supervisors Page

A list of all lecturers assigned as supervisors. Each row shows the lecturer name, area of specialisation, and the project group they are assigned to.

---

#### Panelists Page (Project)

A list of all project panelists split into two clearly labelled sections. The Internal section shows all lecturers assigned as project panelists with their name and the project group panel they sit on. The External section shows all external panelists with their name and the project group panel they sit on.

---

#### Final Report Page

Shows all project groups, each with a progress bar and x/y ratio. Follows the same structure as the Seminar Submission page.

When all members of a group have submitted their final report the progress bar is replaced by Complete in bright green inside a rounded rectangular border.

Once all groups show Complete the Open Files to Panelists button at the top of the page becomes active. Before that it remains inactive.

A broadcast action is available from the expanded group view.

---

#### Defence Page

Identical structure to the Seminar Defence page. Open Scores button at the top. Scoring rubric configuration strips below. Scoring is configured independently from the seminar defence rubric.

---

## STUDENT INTERFACE

### No Sidebar
The student has no sidebar navigation. All navigation happens through the portal cards on the home page and the rounded rectangle cards within each portal.

### Home Page

Two large rounded rectangle portal cards displayed in the centre of the page:

**[ Seminar ]   [ Project ]**

If a portal is not yet open the card shows a message saying the portal is not yet available. The card is visible but not clickable until the coordinator opens the portal.

---

### Seminar Portal

**Group status indicator** sits at the top of the seminar portal, always visible. Shows the student's assigned seminar group name. If not yet assigned it shows Not yet assigned. This is not interactive.

Two rounded rectangle navigation cards below the indicator:

**[ Proposal ]   [ Final Report ]**

---

#### Proposal Page

**Approved Topic section at the top:**
Once a topic is approved it is displayed here prominently and permanently, clearly separated from everything below. Before any topic is approved this section shows a message saying no topic has been approved yet.

**Submission History below:**
All previous batches listed from most recent to oldest. Clicking a batch expands it to show all topics submitted in that batch. Each topic shows its status (Approved, Declined, or Pending) and any coordinator comment on declined topics.

**Submit New Batch button:**
Active only when no topic has been approved yet. Once a topic is approved the button disappears as the submission is closed.

---

#### Final Report Page (Seminar)

The file submission component is displayed. The student attaches all required files using the Add File button to create additional slots as needed. There is no separation between file types. The coordinator communicates via broadcast which files are required.

---

### Project Portal

**Status indicator** sits at the top of the project portal, always visible. Shows three pieces of information: assigned project group name, assigned supervisor name, and subgroup name if the student is in one. If any are not yet assigned it shows Not yet assigned for that item. This is not interactive.

Three rounded rectangle navigation cards below the indicator:

**[ Proposal ]   [ Review ]   [ Final Report ]**

---

#### Proposal Page (Project)

**Approved Proposal section at the top:**
Once a proposal is approved it is displayed here prominently and permanently, clearly separated from everything below. Before any proposal is approved this section shows a message saying no proposal has been approved yet.

**Submission History below:**
All previous batches listed from most recent to oldest. Clicking a batch expands it to show all proposals in that batch. Each proposal shows its status and any supervisor comment.

**Submit New Batch button:**
Active only when the supervisor has configured the batch size and no proposal has been approved yet. If the supervisor has not yet set the batch size the button shows a message saying awaiting supervisor configuration. Once a proposal is approved the button disappears.

**Subgroup confirmation prompt:**
For subgroup members, when any member initiates a submission the other members see a Confirm Submission prompt on this page showing a countdown of the 30-minute window remaining. If the window expires the submission is dropped and the initiating member is notified.

---

#### Review Page

Two rounded rectangle navigation cards:

**[ Chapters ]   [ Technical File ]**

---

##### Chapters

A horizontal multi-step progress bar with 5 steps is displayed at the top. Each step represents one chapter and shows one of three states: Locked (grey), Active (highlighted), or Complete (filled green).

Below the progress bar the active chapter or chapters are shown. Each active chapter displays:

The chapter number and title. The submission history for that chapter showing all previous submissions from most recent to oldest. Each submission shows the supervisor's comment if one was left and the submission status. A Submit button to submit or resubmit the chapter. The same 30-minute subgroup confirmation prompt applies for subgroup members.

Locked chapters are visible in the progress bar but show no content below.

Completed chapters show a green tick and can be expanded to view their full history but cannot be resubmitted.

---

##### Technical File

The submission slot is always open. The student submits using the file submission component. Two types of submission are accepted: a file upload or a live link entered as a URL. The Add File button creates additional slots.

The full iterative history of all technical file submissions is shown from most recent to oldest. Each submission shows the supervisor's comment if one was left and the submission status.

Submission is optional. If the student's project has no technical component they simply do not submit anything and the slot remains empty.

The same 30-minute subgroup confirmation prompt applies for subgroup members.

---

#### Final Report Page (Project)

**Readiness indicator at the top:**
Shows whether all 5 chapters are approved and whether the technical file is approved if applicable. Each item shows a green tick if complete or an amber indicator if still outstanding. The Submit button remains inactive until all required approvals are confirmed.

**File submission component below:**
Once eligible the student attaches all final files using the Add File button. There is no separation between file types. Research document, technical file, and any other relevant documents are all submitted together in one place.

After submission the page shows a confirmation message saying the final report has been submitted and is awaiting the coordinator to make it available to panelists.

---

## SUPERVISOR INTERFACE

### Sidebar Navigation
Reflects only the roles the lecturer has been assigned to. Possible combinations:

Supervisor only: Home, Supervisor, Project.
Supervisor and Seminar panelist: Home, Supervisor, Seminar, Project.
Seminar panelist only: Home, Seminar.
Project panelist only: Home, Project.
Seminar and Project panelist without supervisor role: Home, Seminar, Project.
No role assigned yet: Home only with a message saying not yet assigned a role.

### Home Page

A summary of everything relevant to the lecturer's assigned roles.

**If assigned as supervisor:** Three metric cards showing chapter-based progress across all assigned students. Proposals Approved, Chapters Complete, Final Reports Submitted. Each card is clickable and expands into the compliance split view with Compliant and Not Compliant tabs. A broadcast action is available from the expanded view.

**If assigned as seminar panelist:** A status indicator showing whether seminar files are open for review and whether scores are open on defence day.

**If assigned as project panelist:** A status indicator showing whether project files are open for review and whether scores are open on defence day.

---

### Supervisor Page

**Two metric cards at the top:**

Group Name: Displays the assigned project group name. Not clickable, purely informational.

Number of Students: Displays the total number of assigned students. Clickable. Expands to show the full list of assigned students with their mat number, name, and current project status. Clicking an individual student from the list opens that student's details and subgroup management options.

**Subgroup management from the student detail view:**
The supervisor can create a subgroup, invite students to join it, and set the proposal batch size from this view.

**Three rounded rectangle navigation cards below the metric cards:**

**[ Proposal ]   [ Review ]   [ Final Report ]**

---

#### Proposal Page (Supervisor)

Shows all assigned students and subgroups with their proposal submission status. Clicking a student or subgroup shows all their submitted batches. Clicking a batch shows all proposals in that batch.

For each proposal the supervisor can: approve, decline, or leave an optional comment. Only one proposal can be approved per student or subgroup. Once approved the submission closes.

The supervisor also sets the proposal batch size from this page. Options are a fixed number or Any, meaning the student decides how many proposals to include. The submission slot is locked for the student until this is configured.

---

#### Review Page (Supervisor)

Two rounded rectangle navigation cards:

**[ Chapters ]   [ Technical File ]**

---

##### Chapters (Supervisor)

The same 5-step horizontal progress bar is displayed at the top, consistent with what the student sees.

**Open Chapters control:** The supervisor selects one or more consecutive chapters and clicks Open Chapters to make them active for submission. Chapters must be opened in sequential order. Non-consecutive chapters cannot be opened simultaneously.

For each active chapter the supervisor sees the full submission history. They leave written comments, approve, or decline. Each resubmission creates a new record alongside the original. Once a chapter is approved it is marked Complete on the progress bar.

Once all 5 chapters are approved the supervisor clicks Mark Research Report Complete.

---

##### Technical File (Supervisor)

The supervisor sees the full iterative submission history for the technical file. They leave written comments, approve, or decline each submission. Once the final submission is approved the supervisor clicks Mark Technical File Complete.

---

#### Final Report Page (Supervisor)

Shows each student's or subgroup's final complete submission. The supervisor reviews all attached files to confirm everything is in order before the coordinator opens the files to panelists.

---

### Seminar Panelist Page

Two rounded rectangle navigation cards:

**[ Files ]   [ Scores ]**

**Files page:** Shows a list of assigned seminar groups and their students. Clicking a student opens their submitted seminar report files for review. Initially shows a message saying files are not yet available until the coordinator opens them.

**Scores page:** Shows the coordinator-configured scoring rubric with all criteria and their maximum scores. The panelist enters a score per criterion for each student and writes optional feedback. Initially shows a message saying scores are not yet available until the coordinator opens them on defence day. Once submitted the panelist confirms and locks their score submission. Scores and feedback are visible to the coordinator internally but are never released to students through the platform.

---

### Project Panelist Page

Two rounded rectangle navigation cards:

**[ Files ]   [ Scores ]**

**Files page:** Shows a list of assigned students with their mat numbers. Clicking a student opens their final complete submission showing all attached files for review. Initially shows a message saying files are not yet available until the coordinator opens them.

**Scores page:** Identical structure to the Seminar Scores page. The panelist enters scores per criterion for each student or subgroup and submits written feedback. Initially shows a message saying scores are not yet available until the coordinator opens them on defence day. Once submitted the panelist confirms and locks their score submission.

---

## EXTERNAL PANELIST INTERFACE

### Sidebar Navigation
Home, Project.

### Home Page
A status indicator showing whether project files are open for review and whether scores are open on defence day.

### Project Page

Two rounded rectangle navigation cards:

**[ Files ]   [ Scores ]**

Identical structure and behaviour to the internal Project Panelist page. Files are not available until the coordinator opens them. Scores are not available until the coordinator opens them on defence day.

External panelists have no messaging capability. The messaging icon is visible in the top right but opens a read-only inbox showing only coordinator broadcast messages. There is no send button.

---

## MESSAGING INTERFACE

The messaging interface is accessible via the Messaging icon in the top right of every page for every role.

### Coordinator Messaging
Opens to an outbox and inbox view. The outbox shows all sent broadcasts organised by recipient group. A Send button with a dropdown allows the coordinator to select the recipient group: All, Students, Supervisors, Seminar Panelists, or Project Panelists. Every broadcast is delivered as both an in-app message and an email to the recipient's registered address simultaneously.

### Supervisor Messaging
Opens to an outbox and inbox view. The outbox shows all broadcasts sent to the assigned project group. A Send button with no dropdown sends to the entire assigned project group. The inbox shows a read-only Coordinator thread with all broadcasts received from the coordinator. Every broadcast is delivered as both in-app message and email simultaneously.

### Student Messaging
Opens to an inbox only view. No send button. Two read-only threads: a Coordinator thread and a Supervisor thread. If the student is in a subgroup a subgroup indicator is shown displaying the subgroup name. Every message also arrives as an email to their registered address.

### Panelist-Only Lecturer Messaging
Opens to an inbox only view. No send button. A read-only Coordinator thread showing all broadcasts received from the coordinator.

### External Panelist Messaging
Opens to an inbox only view. No send button. A read-only Coordinator thread showing all broadcasts received from the coordinator.

---

## NOTIFICATIONS INTERFACE

The notifications interface is accessible via the Notifications icon in the top right of every page for every role.

Notifications are system-generated alerts triggered by platform events. They do not send emails. They appear only within the platform.

Notifications are displayed in reverse chronological order, most recent at the top, in a scrollable list. They are stored permanently and nothing is ever deleted.

Unread notifications are indicated by a badge on the Notifications icon showing the count of unread items.

---

## PROFILE PAGE

Accessible via the Profile icon in the top right of every page for every role.

The profile page shows the user's current details. Any change requires the user to enter their current password before the update is saved.

Students can update: name, mat number, email, phone number.
All other roles can update: name, email.

A Change Password option is available separately. The user enters their current password, new password, and confirms the new password.

---

## SCREEN FLOW SUMMARY

### Coordinator Flow
Login → Home (metric cards and compliance) → Seminar portal (Proposals → Groups → Submission → Defence) → Project portal (Groups → Final Report → Defence)

### Student Flow
Login → Home (two portal cards) → Seminar portal (Proposal → Final Report) → Project portal (Proposal → Review (Chapters, Technical File) → Final Report)

### Supervisor Flow
Login → Home (summary metrics) → Supervisor page (metric cards → Proposal, Review (Chapters, Technical File), Final Report) → Seminar page (Files, Scores) → Project page (Files, Scores)

### External Panelist Flow
Login → Home (status indicators) → Project page (Files, Scores)

---

*Athenas UI Structure Document | v1.3 | June 2025 | Prototype Scope: Single Cohort | Confidential*
