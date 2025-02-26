import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

// Validate database connection string
if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create database client with connection pooling
const client = postgres(env.DATABASE_URL, {
  max: 10, // Maximum number of connections
  idle_timeout: 30, // Close connections after 30 seconds of inactivity
  connect_timeout: 10, // Timeout after 10 seconds when connecting
  ssl: env.NODE_ENV === 'production', // Use SSL in production
});

// Create and export drizzle instance
export const db = drizzle(client);
