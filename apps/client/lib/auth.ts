import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { env } from "@/env.mjs";
import { db } from "./prisma";
import { generateAsyncKey } from "./encryption";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = await db.user.findFirst({
        where: {
          email: token.email!,
        },
      });
      if (!dbUserResult) {
        token.id = user!.id;
        return token;
      }

      if (!dbUserResult.username) {
        await db.user.update({
          where: {
            id: dbUserResult.id,
          },
          data: {
            username: `Guest-${nanoid(4)}`,
          },
        });
      }

      return {
        id: dbUserResult.id,
        name: dbUserResult.name,
        email: dbUserResult.email,
        picture: dbUserResult.image,
        username: dbUserResult.username,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
