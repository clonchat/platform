import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 255 }),
  emailVerified: boolean("email_verified").default(false).notNull(),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  emailVerificationExpires: timestamp("email_verification_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  subdomain: varchar("subdomain", { length: 100 }).notNull().unique(),
  visualConfig: jsonb("visual_config").$type<{
    logoUrl?: string;
    theme: "light" | "dark";
    welcomeMessage?: string;
  }>(),
  appointmentConfig: jsonb("appointment_config")
    .$type<{
      services: {
        id: string;
        name: string;
        duration: number;
        price?: number;
      }[];
    }>()
    .notNull(),
  availability: jsonb("availability").$type<
    {
      day:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday";
      slots: { start: string; end: string }[];
    }[]
  >(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  customerData: jsonb("customer_data")
    .$type<{ name: string; email?: string; phone?: string }>()
    .notNull(),
  appointmentTime: timestamp("appointment_time", {
    withTimezone: true,
  }).notNull(),
  serviceName: varchar("service_name", { length: 255 }),
  status: varchar("status", {
    length: 50,
  })
    .$type<"pending" | "confirmed" | "cancelled">()
    .default("pending")
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports for use in other packages
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
