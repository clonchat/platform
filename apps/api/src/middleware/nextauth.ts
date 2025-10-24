import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";

export type NextAuthVariables = {
  userId: string;
};

/**
 * Middleware to validate NextAuth JWT tokens
 * Use this to protect routes that require authentication
 */
export const nextAuthMiddleware = createMiddleware<{
  Variables: NextAuthVariables;
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    // Validate the JWT token from NextAuth
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;

    // Extract user ID from the token
    const userId = decoded.sub || decoded.id;

    if (!userId) {
      return c.json({ error: "Invalid token - No user ID" }, 401);
    }

    // Set the userId in the context for use in route handlers
    c.set("userId", userId);

    await next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});
