import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. CRITICAL: Check if a coordinator already exists
    const existingCoordinator = await prisma.user.findFirst({
      where: { role: "coordinator" },
    });

    if (existingCoordinator) {
      return NextResponse.json({ error: "System already initialized. Coordinator account exists." }, { status: 403 });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the User and the linked Coordinator record in one transaction
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "coordinator",
        is_activated: true, // The first user is automatically activated
        coordinator: {
          create: {
            name: fullName,
          },
        },
      },
    });

    return NextResponse.json({ message: "System initialized successfully.", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Setup API Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during setup." }, { status: 500 });
  }
}