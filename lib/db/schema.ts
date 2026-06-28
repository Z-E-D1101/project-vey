import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  jsonb,
  real,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Every app table carries a plain `userId` column for per-user scoping (there
// is no RLS on Neon). No foreign keys by design.

/** A chat thread. The agent can talk to the same conversation from web, CLI,
 *  Telegram or Discord — `channel` records where the last activity came from. */
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull().default('New conversation'),
  channel: text('channel').notNull().default('web'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

/** Individual turns inside a conversation. */
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  conversationId: text('conversationId').notNull(),
  role: text('role').notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  channel: text('channel').notNull().default('web'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Long-term memories distilled from conversations. `embedding` is a JSON
 *  array of floats used for semantic recall (cosine similarity in app code). */
export const memories = pgTable('memories', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  kind: text('kind').notNull().default('fact'), // fact | preference | event | goal | relationship
  content: text('content').notNull(),
  importance: integer('importance').notNull().default(3), // 1-5
  embedding: jsonb('embedding').$type<number[]>(),
  source: text('source').notNull().default('chat'),
  sourceConversationId: text('sourceConversationId'),
  pinned: boolean('pinned').notNull().default(false),
  lastUsedAt: timestamp('lastUsedAt'),
  useCount: integer('useCount').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Structured "who you are" model. One row per (userId, section). The agent
 *  rewrites these over time as it learns. */
export const identityTraits = pgTable('identity_traits', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  section: text('section').notNull(), // identity | communication | preferences | goals | context
  label: text('label').notNull(),
  value: text('value').notNull(),
  confidence: real('confidence').notNull().default(0.6), // 0-1
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Self-authored, reusable skills the agent writes after solving a complex
 *  task. `instructions` is the procedure it follows next time. */
export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  whenToUse: text('whenToUse').notNull(),
  instructions: text('instructions').notNull(),
  triggers: jsonb('triggers').$type<string[]>().notNull().default([]),
  enabled: boolean('enabled').notNull().default(true),
  origin: text('origin').notNull().default('authored'), // authored | manual
  useCount: integer('useCount').notNull().default(0),
  lastUsedAt: timestamp('lastUsedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Configured model endpoints. The agent can switch between these. Built-in
 *  Vercel AI Gateway models need no key; custom providers store a key. */
export const modelEndpoints = pgTable('model_endpoints', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  label: text('label').notNull(),
  provider: text('provider').notNull(), // gateway | openai | anthropic | openrouter | custom
  modelId: text('modelId').notNull(),
  baseUrl: text('baseUrl'),
  apiKey: text('apiKey'), // null for gateway models
  isDefault: boolean('isDefault').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Scheduled / automated tasks (e.g. "send me a daily report"). An external
 *  cron hits /api/cron which runs anything due. */
export const schedules = pgTable('schedules', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  prompt: text('prompt').notNull(),
  cron: text('cron').notNull(), // standard 5-field cron expression
  timezone: text('timezone').notNull().default('UTC'),
  deliverTo: text('deliverTo').notNull().default('inbox'), // inbox | telegram | discord
  enabled: boolean('enabled').notNull().default(true),
  lastRunAt: timestamp('lastRunAt'),
  nextRunAt: timestamp('nextRunAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Output of each scheduled run — the assistant's "inbox". */
export const scheduleRuns = pgTable('schedule_runs', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  scheduleId: text('scheduleId').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull().default('success'), // success | error
  output: text('output').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Bearer tokens that let external gateways (CLI, Telegram, Discord) talk to
 *  the same agent. We store only a SHA-256 hash of the token. */
export const accessTokens = pgTable('access_tokens', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  channel: text('channel').notNull().default('cli'), // cli | telegram | discord | api
  tokenHash: text('tokenHash').notNull(),
  prefix: text('prefix').notNull(), // first chars, shown in UI for identification
  lastUsedAt: timestamp('lastUsedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

/** Activity feed showing the assistant improving itself — memories saved,
 *  identity updated, skills authored, schedules run. Powers the dashboard. */
export const agentEvents = pgTable('agent_events', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  type: text('type').notNull(), // memory | identity | skill | schedule | model
  title: text('title').notNull(),
  detail: text('detail'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
