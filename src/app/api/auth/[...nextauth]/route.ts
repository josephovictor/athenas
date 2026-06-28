import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Matric Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const identifier = credentials.email.trim();

        // Try email lookup first (all roles)
        let user = await prisma.user.findUnique({
          where: { email: identifier.toLowerCase() },
        });

        // Try mat number lookup for students
        if (!user) {
          const student = await prisma.student.findUnique({
            where: { mat_number: identifier },
            include: { user: true },
          });
          if (student) user = student.user;
        }

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        if (!user.is_activated) {
          throw new Error(
            "Account not activated. Please check your invitation email."
          );
        }

        // Resolve display name from role-specific table
        let displayName = "User";
        if (user.role === "coordinator") {
          const coordinator = await prisma.coordinator.findUnique({
            where: { user_id: user.id },
          });
          displayName = coordinator?.name ?? "Coordinator";
        } else if (user.role === "student") {
          const student = await prisma.student.findUnique({
            where: { user_id: user.id },
          });
          displayName = student
            ? `${student.firstname} ${student.surname}`
            : "Student";
        } else if (user.role === "lecturer") {
          const lecturer = await prisma.lecturer.findUnique({
            where: { user_id: user.id },
          });
          displayName = lecturer?.name ?? "Lecturer";
        } else if (user.role === "external_panelist") {
          const panelist = await prisma.externalPanelist.findUnique({
            where: { user_id: user.id },
          });
          displayName = panelist?.name ?? "Panelist";
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          profileCompleted: user.profile_completed,
          displayName,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.profileCompleted = (user as any).profileCompleted;
        token.displayName = (user as any).displayName;
      }
      // Support session.update() for marking profile complete without re-login
      if (trigger === "update" && session?.profileCompleted !== undefined) {
        token.profileCompleted = session.profileCompleted;
        if (session.displayName) token.displayName = session.displayName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).profileCompleted = token.profileCompleted;
        (session.user as any).name = token.displayName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
