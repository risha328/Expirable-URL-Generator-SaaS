# Expirable URL Generator: Rate Limiting System Architecture & Senior Interview Guide

This document provides an end-to-end technical breakdown of the rate limiting mechanisms implemented in the **Expirable URL Generator** project across the backend and frontend. It also serves as a comprehensive system design interview guide for **Mid, Senior, and Staff-level Software Engineering interviews**.

---

## 1. Project-Specific Rate Limiting Architecture Overview

Our application implements a **Dual-Layer Defense Mechanism** to protect the infrastructure against Denial-of-Service (DoS) attacks, brute force authentication attempts, budget exhaustion (AI Chatbot), and link abuse.

```
                    +-------------------------------------+
                    |     Incoming Client Request         |
                    +-------------------------------------+
                                       |
                                       v
                    +-------------------------------------+
                    |   Reverse Proxy (Nginx / Cloudflare)|
                    |    app.set('trust proxy', 1)        |
                    +-------------------------------------+
                                       |
                                       v
     =================================================================
     LAYER 1: Edge & Network Middleware (Redis / express-rate-limit)
     =================================================================
                                       |
                   +-------------------+-------------------+
                   |                   |                   |
                   v                   v                   v
            [ globalLimiter ]   [ authLimiter ]   [ redirectLimiter ]
            100 req / 15m        10 req / 15m        30 req / 1m
                   |                   |                   |
                   +-------------------+-------------------+
                                       | Pass (HTTP 200/Next)
                                       v
     =================================================================
     LAYER 2: Business & Security Analytics Layer (MongoDB Persistent)
     =================================================================
                                       |
            +--------------------------+--------------------------+
            |                                                     |
            v                                                     v
     [ ipRateLimit ]                                   [ linkAbuseDetection ]
     IPAnalytics (50 req/hr)                           Link recentRequests (100 req/hr)
     Bans IP, logs timestamps                          Flags Link `flaggedForAbuse = true`
                                       |
                                       v
     =================================================================
     FRONTEND INTERCEPTOR & USER EXPERIENCE (React / Axios Interceptor)
     =================================================================
                                       |
                       Captures HTTP 429 Status
                                       |
                       Displays Deduplicated Toast
                       (`id: rate-limit-toast`)
```

---

## 2. Technical Codebase Breakdown

### A. Layer 1: Redis-Backed Distributed Edge Limiter (`backend/src/middlewares/rateLimiter.js`)

#### Key Features:
1. **Redis Store Connection**: Utilizes `ioredis` and `rate-limit-redis`. Requests increment Redis keys atomically using window-based expiration.
2. **Graceful Fallback**: If `REDIS_URL` is unavailable or Redis goes down, `express-rate-limit` silently falls back to an internal in-memory `MemoryStore` to ensure high availability without throwing unhandled node server crashes.
3. **Reverse Proxy Configuration**: `app.set("trust proxy", 1)` is enabled in `app.js` so that `req.ip` reflects the true client IP provided by `X-Forwarded-For` header rather than the load balancer's internal IP.
4. **Standard Headers**: Configured with `standardHeaders: true` (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`) to provide standardized feedback compliant with IETF drafts.

#### Defined Policies:
| Limiter Name | Scope / Endpoint | Window | Max Allowed | Primary Objective |
| :--- | :--- | :--- | :--- | :--- |
| `globalLimiter` | All `/api/*` routes | 15 Minutes | 100 requests | General DDoS & crawler protection |
| `authLimiter` | `/auth/login`, `/auth/signup` | 15 Minutes | 10 attempts | Credential stuffing & brute-force defense |
| `chatbotLimiter` | `/chat/message` | 1 Hour | 20 queries | Prevent Gemini API quota/cost exhaustion |
| `redirectLimiter` | `/:slug` | 1 Minute | 30 requests | Lightweight edge defense on target links |

---

### B. Layer 2: Business & Security Analytics Layer (`backend/src/middlewares/advancedRateLimitMiddleware.js`)

While Layer 1 provides lightning-fast edge throttling, Layer 2 persists security metrics inside MongoDB for administrative oversight and auditability.

#### Key Features:
1. **IP Banning & Expiration (`IPAnalytics` Model)**:
   - Tracks persistent IP attributes (`blocked`, `blockReason`, `resetTime`, `requestTimestamps`).
   - If an IP exceeds `MAX_REQUESTS_PER_IP` (50 req/hr), it gets flagged and blocked.
   - Automatically unblocks IPs when `new Date() > ipAnalytics.resetTime`.
2. **Per-Link Abuse Detection (`Link` Model)**:
   - Tracks `recentRequests` per link slug.
   - If a single target URL receives `> 100 requests/hr` from a single IP, the link itself gets marked as `flaggedForAbuse: true` and deactivated automatically to prevent link farming/scraping.

---

### C. Frontend Interceptor & User Experience (`frontend/src/api/api.js`)

1. **Centralized Error Handling**: Axios response interceptors monitor API responses globally.
2. **429 Interception**:
   ```javascript
   else if (status === 429) {
     const errorMessage = data?.message || "Too many requests. Please try again later.";
     toast.error(errorMessage, {
       id: 'rate-limit-toast', // Constant ID prevents toast notification spam
       duration: 5000,
       position: 'top-center'
     });
   }
   ```
3. **Deduplication**: By passing `id: 'rate-limit-toast'`, React Hot Toast updates the active toast rather than stacking dozens of duplicate notifications on screen during burst requests.

---

## 3. Senior Architecture Trade-offs & Engineering Issues in This Codebase

When interviewing for Senior or Lead roles, you are expected to critique architectures, recognize bottlenecks, and suggest optimal scale solutions.

### Critical Vulnerabilities & Bottlenecks Identified in Current Design:

1. **Database IOPS Starvation (Layer 2 MongoDB Writes)**:
   - *Problem*: `advancedRateLimitMiddleware.js` performs `IPAnalytics.findOne({ ip })` and `.save()` on **EVERY SINGLE HTTP REQUEST**.
   - *Senior Critique*: Under 10,000 requests/second, doing MongoDB writes per request will exhaust database connection pools, increase latency from ~5ms to ~150ms+, and crash the database.
   - *Solution*: Remove MongoDB from the active request path. Handle real-time rate limiting in Redis and push IP analytics asynchronously via message queues (e.g. BullMQ / Kafka).

2. **Fixed Window Counter Limitations**:
   - *Problem*: `express-rate-limit` defaults to Fixed Window algorithms.
   - *Senior Critique*: A user can send 100 requests at 14:14:59 and another 100 requests at 14:15:01 without triggering the limit, effectively bursting **200 requests within 2 seconds**.
   - *Solution*: Implement a **Sliding Window Counter** or **Token Bucket** algorithm using Redis Lua scripts.

3. **In-Memory Fallback Split-Brain Problem**:
   - *Problem*: Falling back to `MemoryStore` when Redis disconnects.
   - *Senior Critique*: In a horizontally scaled cluster with 10 Node instance pods behind an AWS ALB, memory is not shared. A user can send `10 max requests * 10 instances = 100 requests` before being blocked.
   - *Solution*: Use Redis Sentinel / Cluster for high availability instead of silent local state fallback.

4. **IP-Based Throttling Vulnerability (NAT / CGNAT Problem)**:
   - *Problem*: Keying rate limits purely by `req.ip`.
   - *Senior Critique*: Hundreds of legitimate corporate or university users sharing an exit IP via NAT will share the same rate limit pool.
   - *Solution*: Use hybrid keys: `user_id` for authenticated sessions, `API_Key` for developer APIs, and `IP + User-Agent Fingerprint` for anonymous endpoints.

---

## 4. Rate Limiting Algorithms Comparison Matrix

In system design interviews, you will frequently be asked to compare rate limiting algorithms:

| Algorithm | How it Works | Pros | Cons | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Fixed Window Counter** | Divides time into fixed windows (e.g., 1 min). Resets count at window edge. | Extremely fast, minimal memory usage. | Traffic spikes at window boundaries can double the allowed quota. | Simple APIs, basic protection. |
| **Sliding Window Log** | Keeps timestamps of requests in a sorted set (Redis ZSET). | 100% accurate sliding window. | High memory consumption (stores every timestamp). | Low-volume, high-security endpoints (Password Reset). |
| **Sliding Window Counter** | Blends count of previous window & current window based on time overlap. | Very memory efficient, accurate, smooth traffic. | Slightly more complex calculation. | Production APIs at scale. |
| **Token Bucket** | Tokens are added to a bucket at a fixed rate. Requests consume tokens. | Allows short bursts of traffic while enforcing average rate. | Requires tracking token counts & last update timestamps. | General API Gateways (AWS API Gateway, Stripe API). |
| **Leaky Bucket** | Requests enter a queue and process at a smooth, constant rate. | Smooths out bursty traffic completely. | Can delay processing of legitimate requests during bursts. | Asynchronous job processing, E-commerce checkouts. |

---

## 5. Senior-Level Interview Questions & Model Answers

### Q1: "How do you handle rate limiting race conditions in a distributed system?"
**Model Answer**:
> "In a distributed environment with multiple API servers hitting a central Redis cache, simple read-then-write operations (`GET count`, `IF count < limit THEN INCR`) suffer from race conditions under high concurrency. Two parallel requests can read `count = 9`, both pass the check, and both increment to `10`, allowing `11` total requests.
>
> To solve this, we must enforce atomicity. In Redis, we achieve atomicity using **Redis Lua Scripts**. A Lua script runs atomically on the single-threaded Redis execution unit, executing the `INCRBY` and `EXPIRE` checks together without interleaved operations. For extreme scale, we can also use Redis Modules like `redis-cell` which implements the Generic Cell Rate Algorithm (GCRA) natively."

---

### Q2: "How would you design a rate limiter that handles 1,000,000 requests per second with sub-millisecond latency?"
**Model Answer**:
> "To handle 1M RPS with sub-millisecond latency:
> 1. **Edge Placement**: Move rate limiting as close to the client as possible using an API Gateway (Kong, Envoy) or Cloudflare Workers at the CDN edge, preventing malicious traffic from reaching application servers.
> 2. **Local Memory + Remote Sync Hybrid Pattern**: Instead of hitting Redis on every request:
>    - Maintain a small in-memory batch counter inside each API instance (e.g., using LRU cache).
>    - Sync local counts to the central Redis cluster in aggregated batches asynchronously (e.g., every 500ms or 100 requests).
> 3. **Redis Sharding**: Cluster Redis by partitioning keys using consistent hashing (`hash(user_id) % num_shards`).
> 4. **Graceful Degradation**: If the cache layer becomes degraded, fall back to soft-limiting or shadow limiting (logging metrics without blocking traffic) to protect availability over strict rate enforcement."

---

### Q3: "What HTTP response headers and status codes should a rate limiter return according to standard conventions?"
**Model Answer**:
> "When a client exceeds their quota, the API must return **HTTP Status 429 Too Many Requests**.
> Standard response headers include:
> - `RateLimit-Limit`: The total request quota allowed within the window (e.g. `100`).
> - `RateLimit-Remaining`: Remaining requests left in the current window (e.g. `0`).
> - `RateLimit-Reset`: UTC epoch timestamp or delta seconds indicating when the window resets.
> - `Retry-After`: Indicates how many seconds the client must wait before sending another request (e.g. `60`)."

---

### Q4: "How does our current project architecture prevent UI toast notification spamming when HTTP 429 occurs?"
**Model Answer**:
> "In `frontend/src/api/api.js`, we use an Axios response interceptor that catches any error response with `status === 429`. To prevent flooding the user interface with dozens of duplicate toast popups during rapid burst requests, we pass a static `id: 'rate-limit-toast'` to `react-hot-toast`. This deduplicates active toasts, causing React Hot Toast to reuse and update the existing toast element rather than creating new DOM elements."

---

### Q5: "If you were asked to refactor our current rate limiting codebase for enterprise production, what step-by-step changes would you make?"
**Model Answer**:
> "1. **Decouple Analytics from Request Path**: Remove `IPAnalytics.findOne()` and `Link.findOne()` queries from `advancedRateLimitMiddleware.js`. Instead, publish access events to Redis Streams or RabbitMQ, consuming them in a background worker process.
> 2. **Upgrade Algorithm**: Replace `express-rate-limit`'s default fixed window store with a custom Redis Lua script implementing the **Sliding Window Counter** or **Token Bucket** algorithm.
> 3. **Implement Tiered Rate Limits**: Define dynamic limits based on user role (`Anonymous`: 30 req/min, `Free User`: 100 req/min, `Pro User`: 1000 req/min, `Admin`: Unlimited).
> 4. **Add Circuit Breaker**: Implement a circuit breaker around the Redis store connection so that if Redis latency spikes above 10ms, the system fails open safely while logging security warnings."

---

## 6. Summary Checklist for Senior Interview Readiness

- [x] Explain the difference between **Edge Throttling** (Redis/API Gateway) and **Business Analytics** (MongoDB/RDBMS).
- [x] Know the 5 core rate limiting algorithms (Fixed Window, Sliding Log, Sliding Counter, Token Bucket, Leaky Bucket).
- [x] Describe Redis Lua scripting for atomic execution.
- [x] Explain how to handle CGNAT/NAT shared IP issues using multi-factor identity keys.
- [x] Understand frontend interceptors and HTTP 429 UX standards.
