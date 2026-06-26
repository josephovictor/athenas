import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Papa from "papaparse";
import { sendInvitationEmail } from "@/lib/email";

// Helper function to generate a secure temporary password
function generateTempPassword() {
  const randomPart = crypto.randomBytes(4).toString('hex');
  return `Athenas-${randomPart}!`;
}

// Helper function to format display name
function formatDisplayName(lastname: string, firstname: string, othername?: string, title?: string): string {
  const nameParts = [lastname, firstname];
  if (othername) nameParts.push(othername);
  const fullName = nameParts.join(' ');
  
  if (title) {
    return `${title} ${fullName}`;
  }
  return fullName;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "coordinator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const role = formData.get("role") as string;

    if (!file || !role) {
      return NextResponse.json({ error: "Missing file or role." }, { status: 400 });
    }

    // Validate role
    if (!["student", "lecturer", "external_panelist"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // Read the file content
    const fileContent = await file.text();

    // Parse CSV
    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, "_"),
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        error: "CSV parsing failed.", 
        details: parseResult.errors 
      }, { status: 400 });
    }

    const rows = parseResult.data as any[];

    if (rows.length === 0) {
      return NextResponse.json({ error: "CSV file is empty." }, { status: 400 });
    }

    // Get the current cohort
    const cohort = await prisma.cohort.findFirst();
    if (!cohort) {
      return NextResponse.json({ error: "No active cohort found." }, { status: 400 });
    }

    // Validate and prepare users
    const usersToCreate: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      try {
        if (role === "student") {
          // NEW FORMAT: email, mat_number, lastname, firstname, othername, phone_number, level
          if (!row.email || !row.mat_number || !row.lastname || 
              !row.firstname || !row.phone_number || !row.level) {
            errors.push(`Row ${rowNumber}: Missing required fields (email, mat_number, lastname, firstname, phone_number, level)`);
            continue;
          }

          const displayName = formatDisplayName(row.lastname, row.firstname, row.othername);

          usersToCreate.push({
            email: row.email.toLowerCase(),
            role: "student",
            profile: {
              mat_number: row.mat_number,
              surname: row.lastname, // Map lastname to surname in DB
              firstname: row.firstname,
              othername: row.othername || null,
              phone_number: row.phone_number,
              level: row.level,
              cohort_id: cohort.id,
            },
            displayName: displayName
          });

        } else if (role === "lecturer") {
          // NEW FORMAT: email, title, lastname, firstname, othername, area_of_specialization, phone
          if (!row.email || !row.title || !row.lastname || 
              !row.firstname || !row.area_of_specialization || !row.phone) {
            errors.push(`Row ${rowNumber}: Missing required fields (email, title, lastname, firstname, area_of_specialization, phone)`);
            continue;
          }

          const displayName = formatDisplayName(row.lastname, row.firstname, row.othername, row.title);

          usersToCreate.push({
            email: row.email.toLowerCase(),
            role: "lecturer",
            profile: {
              name: displayName, // Store full display name with title
              title: row.title,
              area_of_specialization: row.area_of_specialization,
              phone: row.phone,
              cohort_id: cohort.id,
            },
            displayName: displayName
          });

        } else if (role === "external_panelist") {
          // NEW FORMAT: email, title, lastname, firstname, othername, specialization, phone
          if (!row.email || !row.title || !row.lastname || 
              !row.firstname || !row.specialization || !row.phone) {
            errors.push(`Row ${rowNumber}: Missing required fields (email, title, lastname, firstname, specialization, phone)`);
            continue;
          }

          const displayName = formatDisplayName(row.lastname, row.firstname, row.othername, row.title);

          usersToCreate.push({
            email: row.email.toLowerCase(),
            role: "external_panelist",
            profile: {
              name: displayName, // Store full display name with title
              title: row.title,
              specialization: row.specialization,
              phone: row.phone,
              cohort_id: cohort.id,
            },
            displayName: displayName
          });
        }
      } catch (err) {
        errors.push(`Row ${rowNumber}: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    // If there are validation errors, return them (all-or-nothing approach)
    if (errors.length > 0) {
      return NextResponse.json({ 
        error: "CSV validation failed.", 
        errors,
        message: "No users were created due to validation errors."
      }, { status: 400 });
    }

    // Check for duplicate emails
    const emails = usersToCreate.map(u => u.email);
    const existingUsers = await prisma.user.findMany({
      where: { email: { in: emails } }
    });

    if (existingUsers.length > 0) {
      const duplicateEmails = existingUsers.map(u => u.email);
      return NextResponse.json({ 
        error: "Duplicate emails found.", 
        duplicateEmails,
        message: "No users were created. Please remove duplicates and try again."
      }, { status: 400 });
    }

    // Create all users in a transaction with auto-generated passwords
    const createdUsers = await prisma.$transaction(async (tx) => {
      const results: any[] = [];

      for (const userData of usersToCreate) {
        // Generate temporary password
        const tempPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        let newUser;

        if (userData.role === "student") {
          newUser = await tx.user.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              role: "student",
              is_activated: true,
              student: {
                create: {
                  ...userData.profile,
                  email: userData.email
                }
              }
            }
          });
        } else if (userData.role === "lecturer") {
          newUser = await tx.user.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              role: "lecturer",
              is_activated: true,
              lecturer: {
                create: userData.profile
              }
            }
          });
        } else if (userData.role === "external_panelist") {
          newUser = await tx.user.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              role: "external_panelist",
              is_activated: true,
              external_panelist: {
                create: userData.profile
              }
            }
          });
        }

        // Store the plain text password for email sending
        results.push({ 
          user: newUser, 
          tempPassword,
          name: userData.displayName
        });
      }

      return results;
    });

    // Send invitation emails (outside transaction to avoid blocking)
    const emailPromises = createdUsers.map(async (userData) => {
      const { user, tempPassword, name } = userData;
      
      if (!user) {
        console.error("User is undefined, skipping email");
        return { email: "unknown", success: false };
      }
      
      try {
        await sendInvitationEmail({
          email: user.email,
          name: name,
          role: role.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
          temporaryPassword: tempPassword,
          loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`,
        });
        console.log(`✅ Invitation email sent to ${user.email}`);
        return { email: user.email, success: true };
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${user.email}:`, emailError);
        return { email: user.email, success: false };
      }
    });

    // Wait for all emails to be sent (or fail silently)
    const emailResults = await Promise.all(emailPromises);
    const successfulEmails = emailResults.filter(r => r.success).length;
    const failedEmails = emailResults.filter(r => !r.success).length;

    return NextResponse.json({ 
      message: `Successfully created ${createdUsers.length} users. Sent ${successfulEmails} invitation emails.${failedEmails > 0 ? ` ${failedEmails} emails failed.` : ''}`,
      count: createdUsers.length,
      emailsSent: successfulEmails,
      emailsFailed: failedEmails,
      users: createdUsers.map(({ user }) => ({ id: user.id, email: user.email }))
    }, { status: 201 });

  } catch (error) {
    console.error("CSV upload error:", error);
    return NextResponse.json({ 
      error: "Failed to process CSV upload.",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}