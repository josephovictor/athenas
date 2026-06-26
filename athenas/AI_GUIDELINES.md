# Athenas Project AI Guidelines

This document provides style guidelines, behavioral constraints, and architectural standards for AI agents and developers working on the Athenas codebase. All code edits, refactors, and feature updates should adhere to these principles.

---

## 1. Project Stack & Architecture
* **Framework**: Next.js (App Router, using the `src/` directory layout).
* **Database & ORM**: Prisma with PostgreSQL.
* **Services**: Supabase (utilizing `@supabase/supabase-js` client).
* **Styling**: Tailwind CSS.

---

## 2. Directory Structure & File Naming Conventions

### 2.1 Components (`src/components`)
* **Casing Consistency**: All directories under `src/components` must use a consistent casing convention. Avoid mixing lowercase and uppercase directory names.
  * **Preferred Casing**: Use **lowercase kebab-case** for directories (e.g., `src/components/broadcast`, `src/components/defence`, `src/components/ui`).
  * **Component Files**: Use **PascalCase** for component filenames (e.g., `BroadcastModal.tsx`, `ConfirmModal.tsx`).
* **UI Components**: Place atomic, reusable UI components in `src/components/ui`.

### 2.2 Server Actions (`src/actions` or `src/lib`)
* **Dedicated Location**: Do not place server actions (`"use server"`) inside generic client/utility files in `src/lib/`.
* **Grouping**: Group server actions inside a dedicated directory `src/actions/` (e.g., `src/actions/coordinatorActions.ts`) or a singular file `src/lib/actions.ts`.
* **Naming**: Use lowercase camelCase or kebab-case for action filenames, avoiding capitalized file names like `Action.ts`.

### 2.3 Libraries & Utilities (`src/lib`)
* **Naming**: Keep files in `src/lib` lowercase (e.g., `prisma.ts`, `supabase.ts`, `email.ts`).
* **Prisma client singleton**: Always import the existing prisma instance from `@/lib/prisma` (defined in `src/lib/prisma.ts`). Do **NOT** instantiate `new PrismaClient()` directly in page or component files, as this causes database connection exhaustion during development hot-reloads.

---

## 3. Code Hygiene & Version Control

* **No Backup Files in Source**: Do not create or leave backup files in the source tree (e.g., `src/middleware.ts.bak`). Use Git for version history.
* **No Unused Config Files**: Avoid empty configuration files at the workspace root (e.g., `prisma.config.ts` if empty). Remove them to keep the project clean.
* **Environment Variables**: Use `.env` or `.env.local` for local secrets. Never check secrets into the Git repository.

---

## 4. Development & CLI Commands (Windows-specific)

* **NPM & NPX Execution**: The environment uses Windows PowerShell which may restrict running `.ps1` scripts by default. 
  * Always use the `.cmd` executable variant when executing node package commands (e.g., `npm.cmd i`, `npm.cmd run dev`, `npx.cmd prisma generate`).

---

## 5. Database Migrations (Prisma Migrate)

* **Use Prisma Migrate**: Avoid using `prisma db push` or direct manual changes in production or shared staging environments. All schema updates must be version-controlled using Prisma Migrate.
* **Creating Migrations**: When updating `prisma/schema.prisma` in development, run:
  ```bash
  npx.cmd prisma migrate dev --name <migration_name>
  ```
  This creates a migration SQL script under `prisma/migrations/` which **must** be committed to Git.
* **Applying Migrations in Production/Staging**: Run:
  ```bash
  npx.cmd prisma migrate deploy
  ```
* **Package.json Scripts**: Ensure standard migration helper scripts are defined in `package.json` for easy access:
  * `"db:migrate": "prisma migrate dev"`
  * `"db:deploy": "prisma migrate deploy"`
  * `"db:status": "prisma migrate status"`

---

## 6. Database Schema & Modeling Conventions (Prisma)

* **ID Consistency**: Always use `uuid()` for auto-generated string IDs across all database models. Avoid mixing `uuid()` and `cuid()` within the same schema.
* **Cascade Deletes**: Ensure that secondary profile models linked to the base `User` model (such as `Lecturer`, `Student`, `Coordinator`, `ExternalPanelist`) implement `onDelete: Cascade` on the `User` relation to maintain referential integrity.
* **Join Table Uniqueness**: All explicit join tables (e.g., `SeminarGroupMember`, `ProjectGroupMember`) must enforce a uniqueness constraint on the key pair using `@@unique([foreign_key_a, foreign_key_b])` to prevent duplicate memberships.
* **Query Indexing**: Explicitly define database indexes using `@@index([field_name])` for frequently queried foreign keys (e.g., `cohort_id`, `project_group_id`, `student_mat_number`) to prevent full table scans and performance degradation.
* **Table Mapping**: Maintain consistent database table naming. Map all Prisma models to lowercase snake_case plural table names using `@@map("table_names")` to conform with PostgreSQL standards.


