import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/account/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const portal = credentials.portal || "customer";

        if (portal === "admin") {
          const email = process.env.ADMIN_EMAIL;
          const password = process.env.ADMIN_PASSWORD;
          if (
            email &&
            password &&
            credentials.email === email &&
            credentials.password === password
          ) {
            return {
              id: "admin",
              email,
              name: "ZAYUNE Admin",
              role: "admin",
            };
          }
          return null;
        }

        if (isDemoMode()) {
          const customer = getDemoCustomers().get(credentials.email.toLowerCase());
          if (!customer || !verifyPassword(credentials.password, customer.passwordHash)) {
            return null;
          }
          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            role: "customer",
          };
        }

        const customer = await prisma.customer.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!customer || !verifyPassword(credentials.password, customer.passwordHash)) {
          return null;
        }

        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          role: "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role?: string }).role || "customer";
        token.sub = user.id;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.sub;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },
};
