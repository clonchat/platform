import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get database URL from environment variable
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://clonchat_user:clonchat_password@localhost:5433/clonchat_db";

// Create postgres connection
const queryClient = postgres(databaseUrl);

// Create drizzle instance
export const db = drizzle(queryClient, { schema });

// Export schema for use in queries
export { schema };
