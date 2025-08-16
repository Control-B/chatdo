import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

export async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    process.exit(1);
  }
}

export async function disconnectRedis() {
  await redisClient.disconnect();
}

export { redisClient };
