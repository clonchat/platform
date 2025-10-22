import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, appointments, businesses } from "@clonchat/core";
import { eq, and } from "drizzle-orm";
import { authMiddleware, AuthContext } from "../middleware/auth";

type Variables = {
  user: AuthContext;
};

const appointmentRoutes = new Hono<{ Variables: Variables }>();

// Validation schemas
const createAppointmentSchema = z.object({
  businessId: z.number(),
  customerData: z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  appointmentTime: z.string().datetime(),
  serviceName: z.string().optional(),
  notes: z.string().optional(),
});

const confirmAppointmentSchema = z.object({
  appointmentId: z.number(),
});

const cancelAppointmentSchema = z.object({
  appointmentId: z.number(),
});

// GET /appointments/:businessId - Get all appointments for a business
appointmentRoutes.get("/:businessId", authMiddleware, async (c) => {
  const authUser = c.get("user");
  const businessId = parseInt(c.req.param("businessId"));

  try {
    // Verify business belongs to user
    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, businessId))
      .limit(1);

    if (!business) {
      return c.json({ error: "Business not found" }, 404);
    }

    if (business.userId !== authUser.userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Get appointments
    const businessAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.businessId, businessId))
      .orderBy(appointments.appointmentTime);

    return c.json({ appointments: businessAppointments });
  } catch (error) {
    console.error("Get appointments error:", error);
    return c.json({ error: "Failed to get appointments" }, 500);
  }
});

// POST /appointments - Create new appointment (public endpoint for chatbot)
appointmentRoutes.post(
  "/",
  zValidator("json", createAppointmentSchema),
  async (c) => {
    const appointmentData = c.req.valid("json");

    try {
      // Verify business exists
      const [business] = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, appointmentData.businessId))
        .limit(1);

      if (!business) {
        return c.json({ error: "Business not found" }, 404);
      }

      // Create appointment
      const [newAppointment] = await db
        .insert(appointments)
        .values({
          businessId: appointmentData.businessId,
          customerData: appointmentData.customerData,
          appointmentTime: new Date(appointmentData.appointmentTime),
          serviceName: appointmentData.serviceName,
          notes: appointmentData.notes,
          status: "pending",
        })
        .returning();

      return c.json({ appointment: newAppointment }, 201);
    } catch (error) {
      console.error("Create appointment error:", error);
      return c.json({ error: "Failed to create appointment" }, 500);
    }
  }
);

// POST /appointments/:businessId/confirm - Confirm appointment
appointmentRoutes.post(
  "/:businessId/confirm",
  authMiddleware,
  zValidator("json", confirmAppointmentSchema),
  async (c) => {
    const authUser = c.get("user");
    const businessId = parseInt(c.req.param("businessId"));
    const { appointmentId } = c.req.valid("json");

    try {
      // Verify business belongs to user
      const [business] = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, businessId))
        .limit(1);

      if (!business || business.userId !== authUser.userId) {
        return c.json({ error: "Forbidden" }, 403);
      }

      // Update appointment status
      const [updatedAppointment] = await db
        .update(appointments)
        .set({
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(appointments.id, appointmentId),
            eq(appointments.businessId, businessId)
          )
        )
        .returning();

      if (!updatedAppointment) {
        return c.json({ error: "Appointment not found" }, 404);
      }

      return c.json({ appointment: updatedAppointment });
    } catch (error) {
      console.error("Confirm appointment error:", error);
      return c.json({ error: "Failed to confirm appointment" }, 500);
    }
  }
);

// POST /appointments/:businessId/cancel - Cancel appointment
appointmentRoutes.post(
  "/:businessId/cancel",
  authMiddleware,
  zValidator("json", cancelAppointmentSchema),
  async (c) => {
    const authUser = c.get("user");
    const businessId = parseInt(c.req.param("businessId"));
    const { appointmentId } = c.req.valid("json");

    try {
      // Verify business belongs to user
      const [business] = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, businessId))
        .limit(1);

      if (!business || business.userId !== authUser.userId) {
        return c.json({ error: "Forbidden" }, 403);
      }

      // Update appointment status
      const [updatedAppointment] = await db
        .update(appointments)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(appointments.id, appointmentId),
            eq(appointments.businessId, businessId)
          )
        )
        .returning();

      if (!updatedAppointment) {
        return c.json({ error: "Appointment not found" }, 404);
      }

      return c.json({ appointment: updatedAppointment });
    } catch (error) {
      console.error("Cancel appointment error:", error);
      return c.json({ error: "Failed to cancel appointment" }, 500);
    }
  }
);

export { appointmentRoutes };
