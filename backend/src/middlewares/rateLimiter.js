import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL?.trim();
const redisEnabledFlag = process.env.REDIS_ENABLED?.trim();
const redisEnabled = Boolean(redisUrl) && redisEnabledFlag !== "false";

let redisClient = null;

function createStore(prefix) {
  if (!redisClient) return undefined;

  return new RedisStore({
    prefix,
    sendCommand: (...args) => redisClient.call(...args),
  });
}

if (redisEnabled) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: () => null,
    });

    redisClient.on("error", (err) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Redis rate-limiter error:", err.message);
      }
    });

    console.log("Redis rate limiter client configured (lazy connect).");
  } catch (error) {
    console.error("Failed to init Redis rate limiter. Using MemoryStore:", error.message);
    redisClient = null;
  }
} else {
  console.warn("Redis rate limiter disabled. Using in-memory store.");
}

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore("rl:global:"),
  message: {
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore("rl:auth:"),
  message: {
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

export const chatbotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore("rl:chat:"),
  message: {
    message: "Chatbot message quota exceeded. Please try again after 1 hour.",
  },
});

export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore("rl:redirect:"),
  message: {
    message: "Too many link redirect requests. Please slow down.",
  },
});
