import { randomUUID, randomBytes, createHash } from 'crypto'

export function newId(prefix?: string): string {
  const id = randomUUID()
  return prefix ? `${prefix}_${id}` : id
}

/** Generate a high-entropy bearer token for external gateways (CLI/bots). */
export function newToken(): { token: string; prefix: string; hash: string } {
  const raw = randomBytes(24).toString('base64url')
  const token = `mnm_${raw}`
  return {
    token,
    prefix: token.slice(0, 12),
    hash: hashToken(token),
  }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48)
}
