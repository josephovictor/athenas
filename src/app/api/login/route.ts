import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Initialize a clean Prisma instance
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 2. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        coordinator: true, // Pull their coordinator profile at the same time
      },
    });

    // 3. If user doesn't exist, return a generic error (for security)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 4. Verify the password matches the hashed one in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 5. Ensure they are actually a Coordinator
    if (user.role !== "coordinator" && user.role !== "COORDINATOR") {
      return NextResponse.json(
        { error: "Access denied. This portal is for Coordinators only." },
        { status: 403 }
      );
    }

    // 6. Create the safe JWT payload (Don't put the password in here!)
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      coordinatorId: user.coordinator?.id,
    };

    // Use the secret from .env, or a fallback if it's missing during dev
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign(tokenPayload, secret, { expiresIn: "1d" });

    // 7. Create the response and bake the token into a secure cookie
    const response = NextResponse.json(
      { message: "Login successful!" },
      { status: 200 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true, // Prevents hackers from stealing it via client JavaScript
      secure: process.env.NODE_ENV === "production", // Uses HTTPS in live mode
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 Day expiration
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}