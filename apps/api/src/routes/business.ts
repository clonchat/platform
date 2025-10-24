import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, businesses } from "@clonchat/core";
import { eq } from "drizzle-orm";
import { authMiddleware, AuthContext } from "../middleware/auth";

type Variables = {
  user: AuthContext;
};

const businessRoutes = new Hono<{ Variables: Variables }>();

// Validation schemas
const createBusinessSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  subdomain: z
    .string()
    .min(3)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain must contain only lowercase letters, numbers, and hyphens"
    ),
  visualConfig: z
    .object({
      logoUrl: z.string().url().optional(),
      theme: z.enum(["light", "dark"]),
      primaryColor: z.string().optional(),
      welcomeMessage: z.string().optional(),
    })
    .optional(),
  appointmentConfig: z.object({
    services: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        duration: z.number(),
        price: z.number().optional(),
      })
    ),
  }),
  availability: z
    .array(
      z.object({
        day: z.enum([
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ]),
        slots: z.array(
          z.object({
            start: z.string(),
            end: z.string(),
          })
        ),
      })
    )
    .optional(),
});

const updateBusinessSchema = createBusinessSchema.partial();

// GET /businesses - Get all businesses for authenticated user
businessRoutes.get("/", authMiddleware, async (c) => {
  const authUser = c.get("user");

  try {
    const userBusinesses = await db
      .select()
      .from(businesses)
      .where(eq(businesses.userId, authUser.userId));

    return c.json({ businesses: userBusinesses });
  } catch (error) {
    console.error("Get businesses error:", error);
    return c.json({ error: "Failed to get businesses" }, 500);
  }
});

// POST /businesses - Create new business
businessRoutes.post(
  "/",
  authMiddleware,
  zValidator("json", createBusinessSchema),
  async (c) => {
    const authUser = c.get("user");
    const businessData = c.req.valid("json");

    try {
      // Check if subdomain is already taken
      const existingBusiness = await db
        .select()
        .from(businesses)
        .where(eq(businesses.subdomain, businessData.subdomain))
        .limit(1);

      if (existingBusiness.length > 0) {
        return c.json({ error: "Subdomain already taken" }, 400);
      }

      // Create business
      const [newBusiness] = await db
        .insert(businesses)
        .values({
          name: businessData.name,
          description: businessData.description,
          subdomain: businessData.subdomain,
          visualConfig: businessData.visualConfig || { theme: "light" },
          appointmentConfig: businessData.appointmentConfig,
          availability: businessData.availability,
          userId: authUser.userId,
        })
        .returning();

      return c.json({ business: newBusiness }, 201);
    } catch (error) {
      console.error("Create business error:", error);
      return c.json({ error: "Failed to create business" }, 500);
    }
  }
);

// PUT /businesses/:id - Update business
businessRoutes.put(
  "/:id",
  authMiddleware,
  zValidator("json", updateBusinessSchema),
  async (c) => {
    const authUser = c.get("user");
    const businessId = parseInt(c.req.param("id"));
    const updateData = c.req.valid("json");

    try {
      // Check if business exists and belongs to user
      const [existingBusiness] = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, businessId))
        .limit(1);

      if (!existingBusiness) {
        return c.json({ error: "Business not found" }, 404);
      }

      if (existingBusiness.userId !== authUser.userId) {
        return c.json({ error: "Forbidden" }, 403);
      }

      // If subdomain is being updated, check if it's available
      if (
        updateData.subdomain &&
        updateData.subdomain !== existingBusiness.subdomain
      ) {
        const subdomainTaken = await db
          .select()
          .from(businesses)
          .where(eq(businesses.subdomain, updateData.subdomain))
          .limit(1);

        if (subdomainTaken.length > 0) {
          return c.json({ error: "Subdomain already taken" }, 400);
        }
      }

      // Update business
      const [updatedBusiness] = await db
        .update(businesses)
        .set({
          name: updateData.name,
          description: updateData.description,
          subdomain: updateData.subdomain,
          visualConfig: updateData.visualConfig,
          appointmentConfig: updateData.appointmentConfig,
          availability: updateData.availability,
          updatedAt: new Date(),
        })
        .where(eq(businesses.id, businessId))
        .returning();

      return c.json({ business: updatedBusiness });
    } catch (error) {
      console.error("Update business error:", error);
      return c.json({ error: "Failed to update business" }, 500);
    }
  }
);

// GET /businesses/check-subdomain/:subdomain - Check if subdomain is available
businessRoutes.get("/check-subdomain/:subdomain", async (c) => {
  const subdomain = c.req.param("subdomain");

  try {
    const [existingBusiness] = await db
      .select({ id: businesses.id })
      .from(businesses)
      .where(eq(businesses.subdomain, subdomain))
      .limit(1);

    return c.json({ available: !existingBusiness });
  } catch (error) {
    console.error("Check subdomain error:", error);
    return c.json({ error: "Failed to check subdomain" }, 500);
  }
});

// GET /businesses/subdomain/:subdomain - Get public business config
businessRoutes.get("/subdomain/:subdomain", async (c) => {
  const subdomain = c.req.param("subdomain");

  try {
    const [business] = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        description: businesses.description,
        subdomain: businesses.subdomain,
        visualConfig: businesses.visualConfig,
        appointmentConfig: businesses.appointmentConfig,
        availability: businesses.availability,
      })
      .from(businesses)
      .where(eq(businesses.subdomain, subdomain))
      .limit(1);

    if (!business) {
      return c.json({ error: "Business not found" }, 404);
    }

    return c.json({ business });
  } catch (error) {
    console.error("Get business by subdomain error:", error);
    return c.json({ error: "Failed to get business" }, 500);
  }
});

// DELETE /businesses/:id - Delete business
businessRoutes.delete("/:id", authMiddleware, async (c) => {
  const authUser = c.get("user");
  const businessId = parseInt(c.req.param("id"));

  try {
    // Check if business exists and belongs to user
    const [existingBusiness] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, businessId))
      .limit(1);

    if (!existingBusiness) {
      return c.json({ error: "Business not found" }, 404);
    }

    if (existingBusiness.userId !== authUser.userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Delete business
    await db.delete(businesses).where(eq(businesses.id, businessId));

    return c.json({ message: "Business deleted successfully" });
  } catch (error) {
    console.error("Delete business error:", error);
    return c.json({ error: "Failed to delete business" }, 500);
  }
});

export { businessRoutes };
