const { pgTable, uuid, varchar, text, timestamp, boolean, integer, pgEnum, jsonb } = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");

const roomStatusEnum = pgEnum("room_status", ["OPEN", "FULL", "CLOSED"]);
const participantStatusEnum = pgEnum("participant_status", ["PENDING", "JOINED", "REJECTED"]);

// Users Table
const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  image: text("image"),
  domicile: varchar("domicile", { length: 100 }),
  hobbies: text("hobbies").array().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Categories Table
const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});

// Rooms Table
const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  masterId: uuid("master_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  region: varchar("region", { length: 100 }).notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  isPrivate: boolean("is_private").default(false),
  status: roomStatusEnum("status").default("OPEN"),
  activityDetails: jsonb("activity_details").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Participants Table
const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: participantStatusEnum("status").default("PENDING"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
});

// Relationships
const usersRelations = relations(users, ({ many }) => ({
  roomsMastered: many(rooms),
  participations: many(participants),
}));

const roomsRelations = relations(rooms, ({ one, many }) => ({
  master: one(users, { fields: [rooms.masterId], reference: [users.id] }),
  category: one(categories, { fields: [rooms.categoryId], reference: [categories.id] }),
  participants: many(participants),
}));

module.exports = {
  roomStatusEnum,
  participantStatusEnum,
  users,
  categories,
  rooms,
  participants,
  usersRelations,
  roomsRelations
};
