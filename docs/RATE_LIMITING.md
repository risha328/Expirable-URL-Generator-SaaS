# Expirable URL Generator - Rate Limiting & Abuse Prevention Strategy

Rate limiting is essential to ensure high availability, prevent Denial of Service (DoS) attacks, mitigate brute force attempts on password-protected URLs, and control API utilization costs (such as chatbot usage).

This document details how and where to implement rate limiting across the backend (Express) and frontend (React).

---

## 1. Architectural Overview & Current State

### Current State
* **Global API protection**: A commented-out in-memory rate limiter using `express-rate-limit` exists in [app.js](file:///d:/ExpirableURLGenerator/backend/src/app.js#L23).
* **Link Redirections & Password Protection**: Custom middlewares in [advancedRateLimitMiddleware.js](file:///d:/ExpirableURLGenerator/backend/src/middlewares/advancedRateLimitMiddleware.js) and [bruteForceMiddleware.js](file:///d:/ExpirableURLGenerator/backend/src/middlewares/bruteForceMiddleware.js) track request counts using MongoDB.
* **Frontend Error Handling**: The frontend Axios client in [api.js](file:///d:/ExpirableURLGenerator/frontend/src/api/api.js) intercepts `401 Unauthorized` responses but does not handle `429 Too Many Requests` responses.

---

## 2. Stability Analysis & Implementation Comparison

### A. Why the Current MongoDB Implementation is Unstable
1. **Database Connection Pool Exhaustion**: Rate limiting is designed to prevent server crashes under heavy load or brute force attacks. However, querying (`findOne`) and writing (`save`/`update`) to MongoDB for *every single incoming request* puts immense pressure on the database. Under a DDoS or massive credential-stuffing attack, the database connection pool will saturate, slowing down or crashing the entire service.
2. **Race Conditions and Non-Atomicity**: The check-then-write pattern in `advancedRateLimitMiddleware.js` is not atomic. If two requests from the same client arrive simultaneously, both can bypass the rate limit threshold before MongoDB records the updated request count.
3. **Storage Bloat and Write Latency**: Continuously slicing and updating arrays of timestamps within MongoDB documents requires rewriting the entire document on disk. This results in heavy disk I/O, increased query latency, and document bloat.

### B. Why the In-Memory/Default Version is Unstable
The commented-out code in `app.js` uses `express-rate-limit`'s default in-memory `MemoryStore`. This approach is unstable for production because:
1. **State Reset on Restarts**: In modern hosting environments (e.g., PM2 crash recovery, container restarts, or Serverless Vercel/AWS Lambda function sleep cycles), server processes restart frequently. Each restart wipes the in-memory store, resetting all rate limit counters to `0` and rendering the system vulnerable to sustained attacks.
2. **Scale and Clustering Inconsistency**: In load-balanced or clustered server setups, each process maintains its own localized RAM state. An attacker can route requests round-robin to bypass limits.
3. **RAM Exhaustion (OOM)**: Storing IP tables in server RAM makes the server vulnerable to Out-of-Memory crashes. If an attacker spoofs millions of random IP addresses, the Node.js memory footprint will grow until the process crashes.

### C. Implementation Comparison Matrix

| Feature / Metric | Current (MongoDB-Based) | Unstable / Naïve (In-Memory / MemoryStore) | Future / Production (Distributed Redis-Based) |
| :--- | :--- | :--- | :--- |
| **Storage Medium** | Disk / SSD (MongoDB Atlas) | Local Server RAM (JS Map/Object) | Distributed In-Memory Cache (Redis) |
| **Lookup/Write Latency** | 5ms to 50ms (Network & Disk bound) | <0.1ms (Immediate local RAM access) | <1ms (Sub-millisecond TCP-based RAM access) |
| **Behavior Under DDoS** | DB pool saturates; entire application crashes | Server CPU spikes; process runs out of memory | Fast filtering in memory; no impact on core DB |
| **Clustered Environments** | Shared database, but slow and blocking | **Broken** (IP counts not synchronized across instances) | **Shared & Synchronized** (all instances use one cache) |
| **Resilience to Restarts** | Persistent (counts retained) | **Volatile** (counts reset to 0 immediately) | Persistent (counts retained with automatic TTLs) |
| **Concurrency & Race Conditions** | **Vulnerable** (non-atomic MongoDB checks) | Safe (single-process Node event loop) | **Safe & Atomic** (using Redis atomic transactions) |
| **Memory Management** | Heavy (Mongoose document overhead) | Risk of memory leak with IP rotation | Automated garbage collection (Keys auto-expire via TTL) |

---

## 3. Proposed Strategy
1. **Express & Redis backend integration**: Utilize Redis as a shared cache layer for rate limit tracking. This prevents limits from resetting on application restarts and works seamlessly in multi-instance or serverless deployments.
2. **Tiered Limits**: Apply distinct limits to different API sections:
   * **Global API Limit**: High threshold to prevent DDoS.
   * **Auth Endpoint Limit**: Low threshold to prevent login/signup brute-forcing.
   * **Chatbot Limit**: Restrict LLM usage to protect API token budgets.
   * **Redirect/Password Try Limit**: Fast cache-level check before executing MongoDB-based IP analytics.
3. **Frontend Interception**: Capture `429` responses globally in Axios, displaying user-friendly error messages using `react-hot-toast`.

---

## 4. Backend Implementation Strategy

### A. Core Rate Limiting Middleware
We will create a new middleware file to house all rate limiting policies: [rateLimiter.js](file:///d:/ExpirableURLGenerator/backend/src/middlewares/rateLimiter.js).

It will utilize:
* `express-rate-limit`: The standard rate limiting framework for Express.
* `rate-limit-redis`: Redis store integration for distributed rate limiting.
* `ioredis`: A robust Redis client for Node.js.

#### Proposed Middleware Code: `backend/src/middlewares/rateLimiter.js`
```javascript
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
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
```

---

### B. Registering Limiters in the Server Entrypoint
In [app.js](file:///d:/ExpirableURLGenerator/backend/src/app.js), these limiters should be imported and applied at the appropriate levels:

```javascript
import { globalLimiter, authLimiter, chatbotLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// Trust reverse proxies (such as Cloudflare, Nginx, Vercel) to capture correct client IP
app.set("trust proxy", 1);

// Apply Global Rate Limiting to all routes
app.use(globalLimiter);

// Apply auth rate limiting specifically to sensitive routes
app.use("/auth/login", authLimiter);
app.use("/auth/signup", authLimiter);
app.use("/auth/admin/login", authLimiter);
app.use("/auth/admin/signup", authLimiter);

// Apply chatbot rate limiting
app.use("/chat/message", chatbotLimiter);
```

And in [linkRoutes.js](file:///d:/ExpirableURLGenerator/backend/src/routes/linkRoutes.js), apply `redirectLimiter` prior to other middlewares to filter out bots:

```javascript
import { redirectLimiter } from "../middlewares/rateLimiter.js";

router.post("/:slug", redirectLimiter, ipRateLimit, validatePassword, linkAbuseDetection, checkBruteForce, updateIPAnalytics, redirectLink);
router.get("/:slug", redirectLimiter, ipRateLimit, validatePassword, linkAbuseDetection, checkBruteForce, updateIPAnalytics, redirectLink);
```

---

## 3. Frontend Implementation Strategy

### A. Axios Response Interceptor (Global Error Handling)
In [api.js](file:///d:/ExpirableURLGenerator/frontend/src/api/api.js), intercept `429` responses and display a toast notification using `react-hot-toast`.

#### Proposed Update for Interceptor:
```javascript
import toast from 'react-hot-toast';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle unauthorized token invalidation
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
          window.location.href = '/login';
        }
      } else if (status === 429) {
        // Display toast error for Rate Limiting
        const errorMessage = data?.message || "Too many requests. Please try again later.";
        toast.error(errorMessage, {
          id: 'rate-limit-toast', // Use a unique ID to prevent duplicating multiple toasts
          duration: 5000,
          position: 'top-center',
          style: {
            border: '1px solid #EF4444',
            padding: '16px',
            color: '#7F1D1D',
            background: '#FEE2E2',
          }
        });
      }
    }
    return Promise.reject(error);
  }
);
```

---

### B. Client UX Best Practices

1. **Button Disabling**: Ensure any button triggering an API call is set to `disabled={loading}` during the flight. This prevents double-clicks from double-firing requests and triggering the rate limiter.
2. **Countdown Lockout Timer**:
   If an authentication request returns a 429 status, the backend response includes standard headers or JSON info indicating lockout details.
   In components like [Login.jsx](file:///d:/ExpirableURLGenerator/frontend/src/pages/Login.jsx) or [Signup.jsx](file:///d:/ExpirableURLGenerator/frontend/src/pages/Signup.jsx), capture the error and lock the submit button locally using a countdown state timer to guide the user.

Example React lockout state implementation:
```javascript
const [lockoutTime, setLockoutTime] = useState(0);

const handleLogin = async (e) => {
  e.preventDefault();
  if (lockoutTime > 0) return;

  try {
    await loginService(credentials);
  } catch (error) {
    if (error.response?.status === 429) {
      // 15-minute lockout or read 'Retry-After' header (defaulting to 900 seconds)
      const seconds = error.response.headers['retry-after'] || 900;
      setLockoutTime(parseInt(seconds, 10));
    }
  }
};

// Hook to count down the lockout timer
useEffect(() => {
  if (lockoutTime <= 0) return;
  const interval = setInterval(() => {
    setLockoutTime((prev) => prev - 1);
  }, 1000);
  return () => clearInterval(interval);
}, [lockoutTime]);
```

---

## 4. Dependencies to Install

To fully support the Redis distributed rate limiting backend strategy, install the following packages in `backend/`:

```bash
cd backend
npm install express-rate-limit rate-limit-redis ioredis
```
