import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Matric Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Invalid credentials format.");
        }

        let userRecord = null;

        // 1. Check if the identifier is an email
        if (credentials.identifier.includes("@")) {
          userRecord = await prisma.user.findUnique({
            where: { email: credentials.identifier.toLowerCase() },
          });
        } else {
          // 2. If it's not an email, treat it as a student matriculation number
          const studentRecord = await prisma.student.findUnique({
            where: { mat_number: credentials.identifier },
            include: { user: true },
          });
          if (studentRecord) {
            userRecord = studentRecord.user;
          }
        }

        // 3. Validate user existence and password
        if (!userRecord) {
          throw new Error("No user found with those details.");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          userRecord.password
        );

        if (!isValidPassword) {
          throw new Error("Incorrect password.");
        }

        // 4. Return user object for the session token
        return {
          id: userRecord.id,
          email: userRecord.email,
          role: userRecord.role,
          isActivated: userRecord.is_activated,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isActivated = (user as any).isActivated;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).isActivated = token.isActivated;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };