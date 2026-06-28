import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendInvitationEmail } from "@/lib/email";

// ==========================================
// GET: Fetch all users with optional filtering
// ==========================================
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "coordinator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const whereClause: any = {};
    
    if (role) {
      whereClause.role = role;
    }

    if (search) {
      whereClause.email = { contains: search, mode: "insensitive" };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        student: true,
        lecturer: true,
        external_panelist: true,
        coordinator: true,
      },
      orderBy: { created_at: "desc" },
    });

    const transformedUsers = users.map(user => {
      const baseUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        is_activated: user.is_activated,
        created_at: user.created_at,
      };

      if (user.student) {
        return {
          ...baseUser,
          profile: {
            mat_number: user.student.mat_number,
            name: `${user.student.surname} ${user.student.firstname} ${user.student.othername || ""}`.trim(),
            phone: user.student.phone_number,
            level: user.student.level,
          }
        };
      } else if (user.lecturer) {
        return {
          ...baseUser,
          profile: {
            name: user.lecturer.name,
            title: user.lecturer.title,
            specialization: user.lecturer.area_of_specialization,
            phone: user.lecturer.phone,
          }
        };
      } else if (user.external_panelist) {
        return {
          ...baseUser,
          profile: {
            name: user.external_panelist.name,
            title: user.external_panelist.title,
            specialization: user.external_panelist.specialization,
            phone: user.external_panelist.phone,
          }
        };
      } else if (user.coordinator) {
        return {
          ...baseUser,
          profile: {
            name: user.coordinator.name,
          }
        };
      }

      return baseUser;
    });

    return NextResponse.json({ users: transformedUsers }, { status: 200 });

  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

// ==========================================
// Helper: Generate secure temp password
// ==========================================
function generateTempPassword() {
  const randomPart = crypto.randomBytes(4).toString('hex');
  return `Athenas-${randomPart}!`; 
}

// ==========================================
// POST: Create user & send email invite
// ==========================================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "coordinator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role, email, profile } = body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // 2. Generate and hash the temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Get the first cohort (required for all role-based profiles)
    const cohort = await prisma.cohort.findFirst();

    if (!cohort) {
      return NextResponse.json(
        { error: "No cohort found. Please initialize the system first." },
        { status: 400 }
      );
    }

    // 4. Create the user based on role
    let user;
    let userName = "";

    if (role === "student") {
      // Changed surname to lastname to match the new modal
      userName = `${profile.lastname}, ${profile.firstname}${profile.othername ? " " + profile.othername : ""}`;
      
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "student",
          is_activated: true,
          student: {
            create: {
              mat_number: profile.mat_number,
              surname: profile.lastname, // Changed from profile.surname
              firstname: profile.firstname,
              othername: profile.othername || null,
              email: email.toLowerCase(),
              phone_number: profile.phone_number,
              level: profile.level,
              cohort_id: cohort.id,
            }
          }
        },
        include: { student: true }
      });
      
    } else if (role === "lecturer") {
      const { title, lastname, firstname, othername, area_of_specialization, phone } = profile;
      const fullName = `${title} ${lastname}, ${firstname}${othername ? " " + othername : ""}`;
      userName = fullName;
      
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "lecturer",
          is_activated: true,
          lecturer: {
            create: {
              name: fullName,
              title: title,
              area_of_specialization: area_of_specialization,
              phone: phone,
              email: email.toLowerCase(), // NOW THIS WILL WORK
              cohort_id: cohort.id, // NOW THIS WILL WORK
            }
          }
        },
        include: { lecturer: true }
      });
      
    } else if (role === "external_panelist") {
      const { title, lastname, firstname, othername, specialization, phone } = profile;
      const fullName = `${title} ${lastname}, ${firstname}${othername ? " " + othername : ""}`;
      userName = fullName;
      
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "external_panelist",
          is_activated: true,
          external_panelist: {
            create: {
              name: fullName,
              title: title,
              specialization: specialization,
              phone: phone,
              email: email.toLowerCase(), // NOW THIS WILL WORK
              cohort_id: cohort.id, // NOW THIS WILL WORK
            }
          }
        },
        include: { external_panelist: true }
      });
    }

    // 5. Send the invitation email
    try {
      await sendInvitationEmail({
        email: email.toLowerCase(),
        name: userName,
        role: role.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase()),
        temporaryPassword: tempPassword,
        loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`,
      });
      console.log(`✅ Invitation email sent to ${email}`);
    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError);
    }

    return NextResponse.json(
      { message: "User created and invitation sent successfully", user },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE: Remove a user
// ==========================================
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "coordinator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as { id: string; role: string };

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (userId === currentUser.id) {
      return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });

  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}