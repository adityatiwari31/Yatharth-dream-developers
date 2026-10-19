import mongoose from "mongoose";

// One shared connection, reused across requests (and across hot reloads in dev).
// Mongoose buffers queries until the connection is ready, so pages can simply
// `await connectDB()` and then query.

const MONGODB_URI = process.env.MONGODB_URI;

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: Cached | undefined;
}

const cached: Cached = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (locally) or in Vercel → Settings → Environment Variables.");
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false, maxPoolSize: 5 })
      .then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

/** True when a database address is configured (used to show friendly empty states). */
export const hasDatabase = Boolean(MONGODB_URI);
