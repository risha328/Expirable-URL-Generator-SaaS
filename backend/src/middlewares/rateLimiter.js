import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";

// Initialize Redis Client if REDIS_URL is provided in environment variables
let redisClient;
let store;

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    });
    
    store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });
    console.log("Redis rate limiter store initialized successfully.");
  } catch (error) {
    console.error("Failed to connect to Redis. Falling back to MemoryStore:", error);
  }
} else {
  console.warn("REDIS_URL not configured. Rate limiter is running in-memory (local state).");
}

// 1. Global Limiter - Safeguard for all public and API endpoints
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in 'RateLimit-*' headers
  legacyHeaders: false, // Disable 'X-RateLimit-*' headers
  store: store, // Fallback to MemoryStore if undefined
  message: {
    message: "Too many requests from this IP. Please try again after 15 minutes."
  }
});

// 2. Auth Limiter - Strict brute force protection for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/signup attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  message: {
    message: "Too many authentication attempts. Please try again after 15 minutes."
  }
});

// 3. Chatbot Limiter - Protects budget for AI queries
export const chatbotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 messages per hour
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  message: {
    message: "Chatbot message quota exceeded. Please try again after 1 hour."
  }
});

// 4. Redirect Limiter - Light protection before hitting link redirection logic
export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 redirection attempts per minute
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  message: {
    message: "Too many link redirect requests. Please slow down."
  }
});
