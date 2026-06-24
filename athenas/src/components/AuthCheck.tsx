import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface AuthCheckProps {
  children: React.ReactNode;
}

export default async function AuthCheck({ children }: AuthCheckProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Type assertion to access custom role property
  const userRole = (session.user as any)?.role;

  if (userRole !== "coordinator") {
    redirect("/login");
  }

  return <>{children}</>;
}