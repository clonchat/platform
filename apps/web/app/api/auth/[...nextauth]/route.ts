import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, users, eq } from "@clonchat/core";
import bcrypt from "bcrypt";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
    };
  }

  interface User {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline", // CRUCIAL para obtener refresh_token
          response_type: "code",
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/gmail.send",
          ].join(" "),
        },
      },
    }),
    // Credentials Provider (para email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Buscar usuario en la base de datos
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!user || !user.passwordHash) {
            return null;
          }

          // Verificar la contraseña
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            return null;
          }

          // Verificar que el email esté verificado
          if (!user.emailVerified) {
            throw new Error("Email not verified");
          }

          // Retornar el usuario para la sesión
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name || undefined,
          };
        } catch (error) {
          console.error("Error in credentials authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Cuando el usuario se autentica con Google, lo guardamos/actualizamos en nuestra BD
      if (account?.provider === "google" && profile?.email) {
        try {
          // Buscar si el usuario ya existe
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, profile.email))
            .limit(1);

          if (!existingUser) {
            // Crear nuevo usuario
            const [newUser] = await db
              .insert(users)
              .values({
                email: profile.email,
                name: profile.name || undefined,
                passwordHash: null, // Los usuarios de Google no tienen password
                emailVerified: true, // Google ya verificó el email
              })
              .returning();

            // Guardar el ID en el user object para usarlo en jwt callback
            user.id = newUser.id.toString();
          } else {
            user.id = existingUser.id.toString();
          }
        } catch (error) {
          console.error("Error creating/finding user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Al inicio de sesión, guardar el ID del usuario en el token
      if (user) {
        token.sub = user.id;
      }
      // Guardar tokens de Google si existen (para usar Calendar/Gmail después)
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // La sesión obtiene el ID del usuario directamente del token JWT
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
