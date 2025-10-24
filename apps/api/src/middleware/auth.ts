import { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthContext {
  userId: number;
  email: string;
}

type Variables = {
  user: AuthContext;
};

export const authMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  // Try NextAuth headers first (for frontend integration)
  const userId = c.req.header("X-User-Id");
  const userEmail = c.req.header("X-User-Email");

  if (userId && userEmail) {
    // Validate that the user exists in the database
    try {
      const { db, users, eq } = await import("@clonchat/core");
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);

      if (user && user.email === userEmail) {
        c.set("user", { userId: parseInt(userId), email: userEmail });
        return await next();
      }
    } catch (error) {
      console.error("Error validating NextAuth user:", error);
    }
  }

  // Fallback to JWT token authentication
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthContext;
    c.set("user", decoded);
    return await next();
  } catch (error) {
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }
};

export const generateToken = (userId: number, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
};
