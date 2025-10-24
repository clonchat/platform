import { Hono } from "hono";
import { db, businesses, users } from "@clonchat/core";
import { eq } from "drizzle-orm";
import { authMiddleware, AuthContext } from "../middleware/auth";

type Variables = {
  user: AuthContext;
};

const userRoutes = new Hono<{ Variables: Variables }>();

// GET /user/status - Get user onboarding status
userRoutes.get("/status", authMiddleware, async (c) => {
  const authUser = c.get("user");

  try {
    // Get user info including email verification status
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.userId))
      .limit(1);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if user has any businesses (completed onboarding)
    const userBusinesses = await db
      .select({ id: businesses.id })
      .from(businesses)
      .where(eq(businesses.userId, authUser.userId))
      .limit(1);

    const hasCompletedOnboarding = userBusinesses.length > 0;

    return c.json({
      hasCompletedOnboarding,
      emailVerified: (user as any).emailVerified || false,
    });
  } catch (error) {
    console.error("Get user status error:", error);
    return c.json({ error: "Failed to get user status" }, 500);
  }
});

export { userRoutes };
