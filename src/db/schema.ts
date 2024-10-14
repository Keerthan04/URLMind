// import { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

//enum to differentiate between user and system
export const systemuserenum = pgEnum("system_user_enum",['user','system']);

//chats table to hold the main chats
export const chats = table("chats", {
  // id: t.integer("chat_id").notNull().primaryKey(),//shd make all id as serial("id") and primary key no serial also now
  id: t.integer('chat_id').primaryKey().generatedAlwaysAsIdentity(),
  chat_name: t.text("chat_name").notNull(),
  userId: t.varchar("userId", { length: 256 }).notNull(),
  created_at: t.timestamp("created_at").notNull().defaultNow(),
  namespace_name: t.text("namespace_name").notNull(), //namespace of the pinecone to that chat
});

export type DrizzleChat = typeof chats.$inferSelect;

//messages table to hold the messages with one to many relationship with the chats
export const messages = table("messages", {
  // id: t.integer("message_id").notNull().primaryKey(),
  // id: t.serial("message_id").primaryKey(),
  id: t.integer('message_id').primaryKey().generatedAlwaysAsIdentity(),
  chatId: t
    .integer("chatId")
    .references(() => chats.id)
    .notNull(),
  message_content: t.text("message_content").notNull(),
  created_at: t.timestamp("created_at").notNull().defaultNow(),
  message_by: systemuserenum("message_by").notNull(),
});

//each chat is created using urls stored here with one to many relationship
export const urls = table("urls",{
    // id: t.integer("url_id").notNull().primaryKey(),
    // id: t.serial("url_id").primaryKey(),
    id: t.integer('url_id').primaryKey().generatedAlwaysAsIdentity(),
    url: t.text("url").notNull(),
    created_at: t.timestamp("created_at").notNull().defaultNow(),
    chatId: t
    .integer("chatId")
    .references(() => chats.id)
    .notNull()
})

//drizzle-orm and drizzle-kit