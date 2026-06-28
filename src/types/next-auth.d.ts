import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "coordinator" | "student" | "lecturer" | "external_panelist";
      profileCompleted: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: "coordinator" | "student" | "lecturer" | "external_panelist";
    profileCompleted: boolean;
    displayName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "coordinator" | "student" | "lecturer" | "external_panelist";
    profileCompleted: boolean;
    displayName: string;
  }
}
