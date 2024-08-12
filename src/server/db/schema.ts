import { relations, sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `blinksights_${name}`);

export const organizations = createTable("organization", {
  id: uuid("id")
    .primaryKey()
    .unique()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  apiKey: varchar("api_key", { length: 255 }),
  subscription: varchar("subscription", { length: 255 }),
  subscriptionStartDate: timestamp("subscription_start_date", {
    withTimezone: true,
  }),
  subscriptionEndDate: timestamp("subscription_end_date", {
    withTimezone: true,
  }),
  email: varchar("email", { length: 255 }).notNull(),
});

export const blinkEvents = createTable("blink_event", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  blinkId: varchar("blink_id")
    .notNull()
    .references(() => blinks.id, { onDelete: "cascade" }),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  eventType: integer("event_type").notNull(),
  url: varchar("url", { length: 255 }),
  userPubKey: varchar("user_pub_key", { length: 255 }),
  trackingPubKey: varchar("tracking_pub_key", { length: 255 }),
  timestamp: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const blinks = createTable("blink", {
  id: varchar("id")
    .primaryKey()
    .notNull(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  actions: jsonb('actions').default(sql`'[]'::jsonb`),
  url: varchar("url", { length: 255 }),
  title: varchar("title", { length: 255 }),
  description: varchar("description", { length: 255 }),
  label: varchar("label", { length: 255 }),
  icon: varchar("icon", { length: 1024 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  orgId: uuid("org_id").default(sql`NULL`),
});

export const userRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.orgId],
    references: [organizations.id],
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
