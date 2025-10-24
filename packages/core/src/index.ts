// Export database client and schema
export { db, schema } from "./db";

// Export schema tables
export { users, businesses, appointments } from "./schema";

// Export drizzle-orm utilities
export { eq, and, or, sql } from "drizzle-orm";

// Export types
export type {
  User,
  NewUser,
  Business,
  NewBusiness,
  Appointment,
  NewAppointment,
} from "./schema";
