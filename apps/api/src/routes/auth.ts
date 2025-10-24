import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { db, users } from "@clonchat/core";
import { eq } from "drizzle-orm";
import { authMiddleware, generateToken, AuthContext } from "../middleware/auth";
import {
  sendVerificationEmail,
  sendResendVerificationEmail,
} from "../utils/email";

type Variables = {
  user: AuthContext;
};

const authRoutes = new Hono<{ Variables: Variables }>();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

// POST /auth/register
authRoutes.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password, name } = c.req.valid("json");

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        emailVerified: false,
        emailVerificationToken,
        emailVerificationExpires,
      })
      .returning();

    // Send verification email
    try {
      await sendVerificationEmail(email, emailVerificationToken, name);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    return c.json({
      message:
        "Registration successful. Please check your email to verify your account.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        emailVerified: false,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// POST /auth/login
authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  try {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.passwordHash) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return c.json(
        {
          error: "Email not verified",
          message: "Please verify your email before logging in",
        },
        403
      );
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// GET /auth/me
authRoutes.get("/me", authMiddleware, async (c) => {
  const authUser = c.get("user");

  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, authUser.userId))
      .limit(1);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

// POST /auth/verify-email
const verifyEmailSchema = z.object({
  token: z.string(),
});

authRoutes.post(
  "/verify-email",
  zValidator("json", verifyEmailSchema),
  async (c) => {
    const { token } = c.req.valid("json");

    try {
      // Find user with this token
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.emailVerificationToken, token))
        .limit(1);

      if (!user) {
        return c.json({ error: "Invalid verification token" }, 400);
      }

      // Check if token has expired
      if (
        !user.emailVerificationExpires ||
        user.emailVerificationExpires < new Date()
      ) {
        return c.json({ error: "Verification token has expired" }, 400);
      }

      // Update user to verified
      await db
        .update(users)
        .set({
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      return c.json({
        message: "Email verified successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: true,
        },
      });
    } catch (error) {
      console.error("Email verification error:", error);
      return c.json({ error: "Email verification failed" }, 500);
    }
  }
);

// POST /auth/resend-verification
const resendVerificationSchema = z.object({
  email: z.string().email(),
});

authRoutes.post(
  "/resend-verification",
  zValidator("json", resendVerificationSchema),
  async (c) => {
    const { email } = c.req.valid("json");

    try {
      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      // Check if already verified
      if (user.emailVerified) {
        return c.json({ error: "Email already verified" }, 400);
      }

      // Generate new verification token
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");
      const emailVerificationExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours

      // Update user with new token
      await db
        .update(users)
        .set({
          emailVerificationToken,
          emailVerificationExpires,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      // Send verification email
      try {
        await sendResendVerificationEmail(
          email,
          emailVerificationToken,
          user.name || undefined
        );
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        return c.json({ error: "Failed to send verification email" }, 500);
      }

      return c.json({
        message: "Verification email sent successfully",
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      return c.json({ error: "Failed to resend verification email" }, 500);
    }
  }
);

export { authRoutes };
