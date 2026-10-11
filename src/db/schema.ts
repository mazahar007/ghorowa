import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  live: boolean("live").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    /** girls | boys | baby | unisex */
    gender: text("gender").notNull().default("unisex"),
    /** 0-12m | 1-3y | 4-7y | 8-12y */
    ageGroups: text("age_groups").array().notNull().default([]),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    sizes: text("sizes").array().notNull().default([]),
    colors: text("colors").array().notNull().default([]),
    images: text("images").array().notNull().default([]),
    description: text("description").notNull().default(""),
    details: text("details").array().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    active: boolean("active").notNull().default(true),
    inStock: boolean("in_stock").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.categoryId)],
);

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  address: text("address").notNull().default(""),
  zone: text("zone").notNull().default("inside"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    /** inside | outside */
    zone: text("zone").notNull(),
    note: text("note").notNull().default(""),
    /** cod | bkash_manual | bkash_online */
    paymentMethod: text("payment_method").notNull(),
    /** unpaid | pending | paid | failed */
    paymentStatus: text("payment_status").notNull().default("unpaid"),
    bkashSender: text("bkash_sender"),
    bkashTrxId: text("bkash_trx_id"),
    bkashPaymentId: text("bkash_payment_id"),
    subtotal: integer("subtotal").notNull(),
    delivery: integer("delivery").notNull(),
    total: integer("total").notNull(),
    /** new | confirmed | shipped | delivered | cancelled | returned */
    status: text("status").notNull().default("new"),
    courier: text("courier"),
    courierConsignmentId: text("courier_consignment_id"),
    courierTrackingCode: text("courier_tracking_code"),
    courierStatus: text("courier_status"),
    adminNote: text("admin_note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("orders_customer_idx").on(t.customerId),
    index("orders_status_idx").on(t.status),
    index("orders_phone_idx").on(t.phone),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    productSlug: text("product_slug").notNull(),
    name: text("name").notNull(),
    size: text("size").notNull(),
    color: text("color"),
    qty: integer("qty").notNull(),
    unitPrice: integer("unit_price").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export type CategoryRow = typeof categories.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type CustomerRow = typeof customers.$inferSelect;
