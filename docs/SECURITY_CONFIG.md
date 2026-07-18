# Security Configuration

This document outlines the security features implemented and the environment variables needed for proper configuration.

## Security Features Implemented

### 1. Brute Force Protection
- **Rate limiting per IP** on download endpoints
- **File lockout** after N wrong password attempts for X minutes
- **Failed attempt logging** in database for admin monitoring

### 2. DDoS/Abuse Protection
- **Per-IP request throttling** with configurable limits
- **Per-link request monitoring** with automatic flagging
- **IP analytics tracking** for suspicious activity detection

## Required Environment Variables

Add these variables to your `.env` file:

```env
# Security Configuration
MAX_FAILED_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
TRACKING_WINDOW_MINUTES=60

# Rate Limiting
MAX_REQUESTS_PER_IP=50
MAX_REQUESTS_PER_LINK=100
TRACKING_WINDOW_HOURS=1
SUSPICIOUS_THRESHOLD=30

# Database Configuration (if not already set)
MONGODB_URI=mongodb://localhost:27017/expirable-url-generator
JWT_SECRET=your-super-secret-jwt-key
BASE_URL=http://localhost:5000
```

## Configuration Explanations

### Brute Force Protection
- `MAX_FAILED_ATTEMPTS`: Number of failed password attempts before lockout (default: 5)
- `LOCKOUT_DURATION_MINUTES`: How long to lock the link after max attempts (default: 15)
- `TRACKING_WINDOW_MINUTES`: Time window to track failed attempts (default: 60)

### Rate Limiting
- `MAX_REQUESTS_PER_IP`: Maximum requests per IP per hour (default: 50)
- `MAX_REQUESTS_PER_LINK`: Maximum requests to a specific link per hour (default: 100)
- `TRACKING_WINDOW_HOURS`: Time window for rate limiting (default: 1)
- `SUSPICIOUS_THRESHOLD`: Requests per hour threshold for flagging (default: 30)

## Admin Security Endpoints

The following endpoints are available for security monitoring:

- `GET /url/admin/security/failed-attempts` - View failed login attempts
- `GET /url/admin/security/flagged-links` - View flagged/suspicious links
- `GET /url/admin/security/ip-analytics` - View IP analytics and blocks
- `PUT /url/admin/security/unflag/:id` - Unflag a suspicious link
- `PUT /url/admin/security/block-ip/:ip` - Manually block an IP address
- `PUT /url/admin/security/unblock-ip/:ip` - Unblock an IP address

## Security Middleware Chain

The security middleware is applied in this order:
1. `ipRateLimit` - Global IP-based rate limiting
2. `linkAbuseDetection` - Per-link abuse detection
3. `checkBruteForce` - Password brute force protection
4. `updateIPAnalytics` - Update IP analytics data

## Database Collections

New collections created for security:
- `failedattempts` - Tracks all failed password attempts
- `ipanalytics` - Tracks per-IP request patterns and blocks
- Enhanced `links` collection with security fields

## Monitoring and Alerts

The system automatically:
- Logs all failed password attempts
- Flags links with suspicious activity
- Blocks IPs exceeding rate limits
- Provides detailed analytics for admin review

## Best Practices

1. **Monitor failed attempts** regularly through the admin dashboard
2. **Review flagged links** and take appropriate action
3. **Adjust rate limits** based on your application's needs
4. **Set up alerts** for high volumes of failed attempts
5. **Regularly review IP blocks** to prevent false positives
