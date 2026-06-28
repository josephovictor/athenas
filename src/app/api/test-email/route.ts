import { NextResponse } from "next/server";
import { sendInvitationEmail } from "@/lib/email";

export async function POST() {
  try {
    await sendInvitationEmail({
      email: "your-email@example.com", // Replace with YOUR email to test
      name: "Test User",
      role: "Student",
      temporaryPassword: "TempPass123!",
      loginUrl: "http://localhost:3000/login",
    });

    return NextResponse.json({ message: "Test email sent!" }, { status: 200 });
  } catch (error) {
    console.error("Test email failed:", error);
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 });
  }
}