import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'

function resolveAppUrl(host: string | null, proto: string | null): string | undefined {
  if (!host) return undefined
  let p = proto
  if (!p) {
    p = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https'
  }
  return `${p}://${host}`.replace(/\/$/, '')
}

/**
 * Prefer the incoming request host so generated absolute URLs match the dev port (e.g. :3002).
 * When undefined, callers fall back to NEXT_PUBLIC_APP_URL.
 */
export async function getAppUrlFromRequest(): Promise<string | undefined> {
  const h = await headers()
  return resolveAppUrl(h.get('x-forwarded-host') ?? h.get('host'), h.get('x-forwarded-proto'))
}

/** Same as getAppUrlFromRequest for Route Handlers (no `headers()` from next/headers). */
export function getAppUrlFromNextRequest(req: NextRequest): string | undefined {
  return resolveAppUrl(
    req.headers.get('x-forwarded-host') ?? req.headers.get('host'),
    req.headers.get('x-forwarded-proto')
  )
}
