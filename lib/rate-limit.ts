/**
 * In-memory rate limiter.
 * Works per-process — resets on deploy.
 * For production multi-instance scaling, swap with Upstash Redis.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  /** Unique key (e.g. IP + route) */
  key: string
  /** Max number of requests in the window */
  limit: number
  /** Window duration in seconds */
  windowSecs: number
}

export function checkRateLimit({ key, limit, windowSecs }: RateLimitOptions): {
  allowed: boolean
  remaining: number
  resetIn: number
} {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // Fresh window
    store.set(key, { count: 1, resetAt: now + windowSecs * 1000 })
    return { allowed: true, remaining: limit - 1, resetIn: windowSecs }
  }

  if (entry.count >= limit) {
    const resetIn = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, resetIn }
  }

  entry.count += 1
  store.set(key, entry)
  const resetIn = Math.ceil((entry.resetAt - now) / 1000)
  return { allowed: true, remaining: limit - entry.count, resetIn }
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key)
    }
  }, 5 * 60 * 1000)
}
