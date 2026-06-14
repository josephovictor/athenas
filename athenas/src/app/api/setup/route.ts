import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Basic Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 2. Security Check: Ensure no Master Coordinator already exists
    // We check the User table for anyone with the 'coordinator' enum role
    const existingCoordinator = await prisma.user.findFirst({
      where: { role: "coordinator" },
    });

    if (existingCoordinator) {
      return NextResponse.json(
        { error: "System initialization blocked: A Master Coordinator already exists." },
        { status: 403 }
      );
    }

    // 3. Hash the password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Derive a temporary name from the email (e.g., "admin" from "admin@athenas.com")
    const derivedName = email.split("@")[0];

    // 5. Database Transaction: Create both records atomically based on your schema
    await prisma.$transaction(async (tx) => {
      // Step A: Create the base User
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: "coordinator", // Matches your Role enum
          is_activated: true,  // Master coordinator is active immediately
        },
      });

      // Step B: Create the Coordinator profile linked to the User
      await tx.coordinator.create({
        data: {
          user_id: newUser.id,
          name: derivedName,
        },
      });
    });

    return NextResponse.json(
      { message: "Master Coordinator account created successfully!" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Setup API Error Failure:", error);
    
    // Prisma error code for unique constraint violation (e.g., email already taken)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This email address is already registered in the system." },
        { status: 409 }
      );
    }

    // Send the exact error message back so our frontend try/catch can see it
    return NextResponse.json(
      { error: error.message || "An internal database server error occurred." },
      { status: 500 }
    );
  }
}