This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# 📘 Prisma + PostgreSQL এবং Next.js — সম্পূর্ণ বাংলা রেফারেন্স গাইড

> **উদ্দেশ্য:** এই ফাইলটি আপনার revision চিটশিট। প্রতিটি topic-এর নাম দিয়ে documentation-এ search করুন এবং বিস্তারিত শিখুন।  
> **ডকুমেন্টেশন লিংক:**  
> — Prisma: https://www.prisma.io/docs  
> — Next.js: https://nextjs.org/docs  
> — PostgreSQL: https://www.postgresql.org/docs

---

## 📚 সূচিপত্র

### Part 1 — Prisma with PostgreSQL
1. [Prisma কী এবং কেন?](#1-prisma-কী-এবং-কেন)
2. [Installation ও Setup](#2-installation-ও-setup)
3. [Prisma Schema](#3-prisma-schema)
4. [Data Types in Prisma](#4-data-types-in-prisma)
5. [Relations (সম্পর্ক)](#5-relations-সম্পর্ক)
6. [Migrations](#6-migrations)
7. [Prisma Client — CRUD Operations](#7-prisma-client--crud-operations)
8. [Filtering ও Searching](#8-filtering-ও-searching)
9. [Sorting ও Pagination](#9-sorting-ও-pagination)
10. [Select ও Include](#10-select-ও-include)
11. [Transactions](#11-transactions)
12. [Aggregation ও Grouping](#12-aggregation-ও-grouping)
13. [Raw SQL Queries](#13-raw-sql-queries)
14. [Prisma Middleware](#14-prisma-middleware)
15. [Prisma Studio](#15-prisma-studio)
16. [Seeding Database](#16-seeding-database)

### Part 2 — Next.js Core Concepts
17. [Next.js কী এবং কেন?](#17-nextjs-কী-এবং-কেন)
18. [App Router vs Pages Router](#18-app-router-vs-pages-router)
19. [File-based Routing](#19-file-based-routing)
20. [Server Components vs Client Components](#20-server-components-vs-client-components)
21. [Layouts ও Templates](#21-layouts-ও-templates)
22. [Data Fetching](#22-data-fetching)
23. [Server Actions](#23-server-actions)
24. [API Routes (Route Handlers)](#24-api-routes-route-handlers)
25. [Middleware](#25-middleware)
26. [Image Optimization](#26-image-optimization)
27. [Fonts](#27-fonts)
28. [Metadata ও SEO](#28-metadata-ও-seo)
29. [Environment Variables](#29-environment-variables)
30. [Error Handling](#30-error-handling)
31. [Loading ও Suspense](#31-loading-ও-suspense)
32. [Caching Strategy](#32-caching-strategy)
33. [Authentication Pattern](#33-authentication-pattern)
34. [Prisma + Next.js একসাথে](#34-prisma--nextjs-একসাথে)

---

# PART 1 — PRISMA WITH POSTGRESQL

---

## 1. Prisma কী এবং কেন?

### 📖 বাংলা ব্যাখ্যা

**Prisma** হলো Node.js এবং TypeScript-এর জন্য একটি **next-generation ORM (Object-Relational Mapper)**। এটা আপনাকে database-এর সাথে কাজ করতে দেয় — raw SQL না লিখেও।

**Prisma ছাড়া:**
```js
// Raw SQL — error-prone, no type safety
const result = await db.query(
  "SELECT * FROM users WHERE email = $1 AND active = $2",
  [email, true]
);
// result.rows[0].naem ← typo! কোনো error নেই
```

**Prisma দিয়ে:**
```ts
// Type-safe, auto-complete, readable
const user = await prisma.user.findFirst({
  where: { email, active: true }
});
// user.naem ← TypeScript এখানেই error দেবে!
```

### কেন Prisma?
- **Type Safety** — TypeScript-এর সাথে পুরোপুরি integrated
- **Auto-complete** — IDE-তে schema দেখে suggest করে
- **Migrations** — Database schema change track করে
- **Prisma Studio** — Visual database browser
- **Readable query** — SQL জানা না থাকলেও কাজ করা যায়

### Prisma-র ৩টি অংশ:
| অংশ | কাজ | Documentation Search |
|-----|-----|---------------------|
| **Prisma Schema** | Database structure define করা | "Prisma schema reference" |
| **Prisma Client** | Database query চালানো (auto-generated) | "Prisma client CRUD" |
| **Prisma Migrate** | Schema change track ও apply করা | "Prisma migrate" |

---

## 2. Installation ও Setup

### 📖 বাংলা ব্যাখ্যা

Prisma setup করতে কয়েকটি ধাপ আছে। PostgreSQL আলাদাভাবে install করতে হবে (locally বা cloud — যেমন Supabase, Neon, Railway)।

### ধাপগুলো:

**ধাপ ১ — Package install**
```bash
npm install prisma --save-dev
npm install @prisma/client
```

**ধাপ ২ — Prisma initialize**
```bash
npx prisma init --datasource-provider postgresql
```
এটা দুটো file তৈরি করে:
- `prisma/schema.prisma` — আপনার database structure লেখার জায়গা
- `.env` — database connection URL রাখার জায়গা

**ধাপ ৩ — Database URL সেট করা (.env)**
```env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/myapp_db"

# Supabase হলে:
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Neon হলে:
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require"
```

**ধাপ ৪ — Schema লিখুন, migrate করুন**
```bash
npx prisma migrate dev --name init
```

**ধাপ ৫ — Prisma Client generate**
```bash
npx prisma generate
```

### 🔍 Documentation-এ Search করুন:
- `"Prisma getting started" → Quickstart`
- `"Connection URLs" → PostgreSQL connection string format`
- `"Prisma CLI reference" → সব CLI command`

---

## 3. Prisma Schema

### 📖 বাংলা ব্যাখ্যা

`prisma/schema.prisma` ফাইলে আপনার **পুরো database structure** লেখা হয়। এটাই Prisma-র heart। এই ফাইল দেখে Prisma:
1. Database table তৈরি করে (migrate)
2. TypeScript types generate করে (client)

### Schema-র ৩টি অংশ:

```prisma
// ─── ১. Generator: কী generate হবে ──────────────────────────────────────────
generator client {
  provider = "prisma-client-js"   // JavaScript/TypeScript client
  // output = "../generated/client" // custom output path (optional)
}

// ─── ২. Datasource: কোন database ────────────────────────────────────────────
datasource db {
  provider = "postgresql"          // database type
  url      = env("DATABASE_URL")  // .env থেকে পড়ে
}

// ─── ৩. Models: Table structure ──────────────────────────────────────────────
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?                // ? মানে optional (NULL হতে পারে)
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
  profile   Profile?

  @@map("users")  // actual table name in DB (optional)
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())

  // Foreign key
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])

  tags      Tag[]    @relation("PostTags")

  @@index([authorId])   // index for faster queries
  @@map("posts")
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  userId Int     @unique
  user   User    @relation(fields: [userId], references: [id])
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] @relation("PostTags")
}

// Enum
enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### Field Attributes (@ দিয়ে শুরু):

| Attribute | মানে | উদাহরণ |
|-----------|------|---------|
| `@id` | Primary key | `id Int @id` |
| `@default()` | Default value | `@default(now())` |
| `@unique` | Unique constraint | `email String @unique` |
| `@updatedAt` | Auto-update on change | `updatedAt DateTime @updatedAt` |
| `@relation` | Relation define | দেখুন Relations section |
| `@map` | Column rename | `@map("user_id")` |
| `@ignore` | Prisma ignore করবে | ব্যবহার বিরল |

### Block Attributes (@@ দিয়ে শুরু):

| Attribute | মানে |
|-----------|------|
| `@@id([a, b])` | Composite primary key |
| `@@unique([a, b])` | Composite unique |
| `@@index([a, b])` | Composite index |
| `@@map("table_name")` | Table rename |

### 🔍 Documentation-এ Search করুন:
- `"Prisma schema reference" → সব field types ও attributes`
- `"Data model" → Model definition guide`
- `"Enum" → Prisma enum usage`

---

## 4. Data Types in Prisma

### 📖 বাংলা ব্যাখ্যা

Prisma-তে field type লিখলে সেটা automatically PostgreSQL-এর সঠিক type-এ map হয়।

### Scalar Types:

| Prisma Type | PostgreSQL Type | TypeScript Type | ব্যবহার |
|-------------|-----------------|-----------------|---------|
| `String` | `TEXT` / `VARCHAR` | `string` | নাম, email, content |
| `Int` | `INTEGER` | `number` | ID, count, age |
| `BigInt` | `BIGINT` | `bigint` | বড় সংখ্যা |
| `Float` | `DOUBLE PRECISION` | `number` | দশমিক সংখ্যা (অনির্ভুল) |
| `Decimal` | `DECIMAL` | `Decimal` | টাকা, নির্ভুল decimal |
| `Boolean` | `BOOLEAN` | `boolean` | true/false |
| `DateTime` | `TIMESTAMP` | `Date` | তারিখ ও সময় |
| `Json` | `JSONB` | `JsonValue` | যেকোনো JSON data |
| `Bytes` | `BYTEA` | `Buffer` | Binary data, file |

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)  // max length
  description String?  @db.Text          // unlimited text
  price       Decimal  @db.Decimal(10,2) // 10 digits, 2 decimal
  rating      Float
  inStock     Boolean  @default(true)
  metadata    Json?
  image       Bytes?
  createdAt   DateTime @default(now())
  expiresAt   DateTime?
  views       BigInt   @default(0)
}
```

### Native Type Modifiers (@db.):
```prisma
name    String  @db.VarChar(100)   // VARCHAR(100)
content String  @db.Text           // TEXT
price   Decimal @db.Decimal(10, 2) // DECIMAL(10,2)
small   Int     @db.SmallInt       // SMALLINT
uuid    String  @default(uuid()) @db.Uuid // UUID type
```

### 🔍 Documentation-এ Search করুন:
- `"Prisma field types" → Scalar types`
- `"Native database types" → PostgreSQL specific types`
- `"Decimal type Prisma" → Money/price handling`

---

## 5. Relations (সম্পর্ক)

### 📖 বাংলা ব্যাখ্যা

Database-এ table গুলো একে অপরের সাথে সম্পর্কিত থাকে। Prisma-তে এই সম্পর্ক schema-তে define করা হয়।

### ৩ ধরনের Relation:

---

### 5.1 One-to-One (এক-এক)
একজন User-এর একটিই Profile।

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile? // optional: profile নাও থাকতে পারে
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  userId Int    @unique       // @unique মানে one-to-one
  user   User   @relation(fields: [userId], references: [id])
}
```

**Prisma Client-এ:**
```ts
// User তৈরির সময় Profile-ও তৈরি (nested write)
const user = await prisma.user.create({
  data: {
    email: "rahim@example.com",
    profile: {
      create: { bio: "Developer from Dhaka" }
    }
  },
  include: { profile: true }
});
```

---

### 5.2 One-to-Many (এক-অনেক)
একজন User-এর অনেক Post।

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[] // User-এর সব Post
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

**Prisma Client-এ:**
```ts
// User তৈরির সময় Post-ও
const user = await prisma.user.create({
  data: {
    email: "karim@example.com",
    posts: {
      create: [
        { title: "First Post" },
        { title: "Second Post" }
      ]
    }
  }
});

// User-এর সব Post
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});
```

---

### 5.3 Many-to-Many (অনেক-অনেক)
একটি Post-এ অনেক Tag, একটি Tag-এ অনেক Post।

**Implicit (Prisma নিজে junction table বানায়):**
```prisma
model Post {
  id   Int   @id @default(autoincrement())
  tags Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
// Prisma নিজে _PostToTag নামে junction table বানাবে
```

**Explicit (নিজের junction table — extra field দরকার হলে):**
```prisma
model Post {
  id         Int         @id @default(autoincrement())
  categories PostCategory[]
}

model Category {
  id    Int            @id @default(autoincrement())
  name  String
  posts PostCategory[]
}

model PostCategory {
  postId     Int
  categoryId Int
  assignedAt DateTime @default(now())  // extra field!
  assignedBy String

  post       Post     @relation(fields: [postId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])

  @@id([postId, categoryId])  // composite primary key
}
```

---

### 5.4 Self-Relation (নিজের সাথে)
```prisma
model Category {
  id       Int        @id @default(autoincrement())
  name     String
  parentId Int?
  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
}

model User {
  id          Int    @id @default(autoincrement())
  name        String
  followedBy  User[] @relation("UserFollows")
  following   User[] @relation("UserFollows")
}
```

### 5.5 Referential Actions (Cascade):
```prisma
model Post {
  authorId Int
  author   User @relation(
    fields: [authorId],
    references: [id],
    onDelete: Cascade,   // User delete হলে Post-ও delete
    onUpdate: Cascade    // User id update হলে Post-ও update
  )
}
```

| Action | মানে |
|--------|------|
| `Cascade` | Parent delete/update হলে child-ও |
| `Restrict` | Child থাকলে parent delete করা যাবে না |
| `SetNull` | Child-এর foreign key null হবে |
| `SetDefault` | Child-এর foreign key default value হবে |
| `NoAction` | কিছু করবে না (DB-র default) |

### 🔍 Documentation-এ Search করুন:
- `"Relations" → Prisma relation types`
- `"Referential actions" → onDelete, onUpdate`
- `"Relation queries" → nested reads/writes`

---

## 6. Migrations

### 📖 বাংলা ব্যাখ্যা

Migration হলো আপনার schema change-এর **ইতিহাস**। যখন schema বদলান, migration চালালে database-ও সেইভাবে বদলে যায় — আগের data নষ্ট না করে।

### Commands:

```bash
# ─── Development এ ─────────────────────────────────────────────────────────────
# Schema বদলানোর পর নতুন migration তৈরি ও apply
npx prisma migrate dev --name add_user_role
# → prisma/migrations/20240101_add_user_role/migration.sql তৈরি হবে
# → Database update হবে
# → Prisma Client re-generate হবে

# Migration reset (সব data মুছে নতুন করে শুরু — dev only!)
npx prisma migrate reset

# ─── Production এ ──────────────────────────────────────────────────────────────
# Pending migration apply করা (data মুছবে না)
npx prisma migrate deploy

# Migration status দেখা
npx prisma migrate status

# ─── অন্যান্য ─────────────────────────────────────────────────────────────────
# Prisma Client নতুন করে generate (schema বদলালে)
npx prisma generate

# Database থেকে schema pull করা (existing DB থেকে শুরু করলে)
npx prisma db pull

# Schema push করা (migration file ছাড়া — prototyping এ)
npx prisma db push
```

### Migration Workflow:

```
Schema বদলান
    ↓
npx prisma migrate dev --name [descriptive-name]
    ↓
Migration SQL file তৈরি হয়
    ↓
Database-এ apply হয়
    ↓
Client re-generate হয়
    ↓
Git-এ commit করুন (migration files)
```

### একটি Migration ফাইল দেখতে কেমন:
```sql
-- prisma/migrations/20240315120000_add_posts/migration.sql

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
```

### 🔍 Documentation-এ Search করুন:
- `"Prisma Migrate" → Migration workflow`
- `"Deploy migrations" → Production deployment`
- `"Prisma db push" → Prototyping without migrations`

---

## 7. Prisma Client — CRUD Operations

### 📖 বাংলা ব্যাখ্যা

`@prisma/client` package generate হওয়ার পর আপনি `PrismaClient` দিয়ে database query করতে পারবেন। প্রতিটি model-এ `findUnique`, `findMany`, `create`, `update`, `delete` সহ অনেক method আছে।

### Setup:
```ts
// lib/prisma.ts — Singleton pattern (Next.js এর জন্য গুরুত্বপূর্ণ)
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // development-এ query log দেখুন
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

---

### 7.1 CREATE

```ts
// ─── একটি record তৈরি ────────────────────────────────────────────────────────
const user = await prisma.user.create({
  data: {
    email: "rahim@example.com",
    name: "Mohammad Rahim",
    role: "USER",
  },
});
// return: পুরো user object

// ─── Nested create: User + Profile একসাথে ───────────────────────────────────
const userWithProfile = await prisma.user.create({
  data: {
    email: "karim@example.com",
    name: "Karim",
    profile: {
      create: {
        bio: "Full-stack developer",
      },
    },
    posts: {
      create: [
        { title: "Hello World", published: true },
        { title: "Draft Post" },
      ],
    },
  },
  include: {
    profile: true,
    posts: true,
  },
});

// ─── অনেক record একসাথে তৈরি (bulk) ─────────────────────────────────────────
const result = await prisma.user.createMany({
  data: [
    { email: "a@example.com", name: "Alice" },
    { email: "b@example.com", name: "Bob" },
    { email: "c@example.com", name: "Charlie" },
  ],
  skipDuplicates: true, // duplicate হলে skip করো, error নয়
});
console.log(result.count); // কতটা তৈরি হয়েছে
```

---

### 7.2 READ

```ts
// ─── ID দিয়ে একটি খোঁজা (null return করে না পেলে) ──────────────────────────
const user = await prisma.user.findUnique({
  where: { id: 1 },
});
// user: User | null

// ─── Unique field দিয়ে খোঁজা ─────────────────────────────────────────────────
const userByEmail = await prisma.user.findUnique({
  where: { email: "rahim@example.com" },
});

// ─── প্রথম match খোঁজা ───────────────────────────────────────────────────────
const firstAdmin = await prisma.user.findFirst({
  where: { role: "ADMIN" },
  orderBy: { createdAt: "desc" },
});
// user: User | null

// ─── সব record (list) ────────────────────────────────────────────────────────
const allUsers = await prisma.user.findMany();

// ─── Condition সহ list ────────────────────────────────────────────────────────
const activeAdmins = await prisma.user.findMany({
  where: {
    role: "ADMIN",
    active: true,
  },
  orderBy: { name: "asc" },
  take: 10,    // limit
  skip: 20,    // offset (page 3)
});

// ─── Total count ──────────────────────────────────────────────────────────────
const totalUsers = await prisma.user.count({
  where: { role: "USER" },
});
```

---

### 7.3 UPDATE

```ts
// ─── একটি record update (where unique হতে হবে) ──────────────────────────────
const updated = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: "Updated Name",
    role: "ADMIN",
  },
});

// ─── Atomic operations (increment/decrement/multiply) ────────────────────────
await prisma.post.update({
  where: { id: 1 },
  data: {
    views:    { increment: 1 },   // views + 1
    likes:    { decrement: 1 },   // likes - 1
    score:    { multiply: 2 },    // score * 2
    ranking:  { divide: 2 },      // ranking / 2
  },
});

// ─── Upsert: থাকলে update, না থাকলে create ───────────────────────────────────
const user = await prisma.user.upsert({
  where: { email: "rahim@example.com" },
  update: { name: "Rahim Updated" },  // পাওয়া গেলে এটা
  create: {                            // না পাওয়া গেলে এটা
    email: "rahim@example.com",
    name: "Rahim",
  },
});

// ─── অনেক record update (condition দিয়ে) ────────────────────────────────────
const result = await prisma.post.updateMany({
  where: { published: false, authorId: 1 },
  data: { published: true },
});
console.log(result.count); // কতটা update হয়েছে
```

---

### 7.4 DELETE

```ts
// ─── একটি delete ─────────────────────────────────────────────────────────────
const deleted = await prisma.user.delete({
  where: { id: 1 },
});

// ─── অনেক delete ─────────────────────────────────────────────────────────────
const result = await prisma.post.deleteMany({
  where: {
    published: false,
    createdAt: { lt: new Date("2024-01-01") }, // পুরনো unpublished post
  },
});
console.log(result.count);
```

### 🔍 Documentation-এ Search করুন:
- `"CRUD" → Prisma CRUD operations`
- `"create" → prisma.model.create()`
- `"findMany" → Query options`
- `"upsert" → Create or update`

---

## 8. Filtering ও Searching

### 📖 বাংলা ব্যাখ্যা

`where` clause-এ অনেক ধরনের filter দেওয়া যায়।

```ts
// ─── Comparison Operators ─────────────────────────────────────────────────────
const posts = await prisma.post.findMany({
  where: {
    views: { gt: 100 },      // greater than (>)
    likes: { gte: 50 },      // greater than or equal (>=)
    rating: { lt: 3 },       // less than (<)
    price: { lte: 1000 },    // less than or equal (<=)
    score: { not: 0 },       // not equal (!=)
    authorId: { in: [1, 2, 3] },    // IN list
    categoryId: { notIn: [5, 6] },  // NOT IN list
  }
});

// ─── String Filtering ─────────────────────────────────────────────────────────
const users = await prisma.user.findMany({
  where: {
    name: { contains: "rahim" },         // LIKE '%rahim%'
    email: { startsWith: "admin" },      // LIKE 'admin%'
    username: { endsWith: ".bd" },       // LIKE '%.bd'
    // Case insensitive (PostgreSQL):
    name: { contains: "rahim", mode: "insensitive" },
  }
});

// ─── Date Filtering ──────────────────────────────────────────────────────────
const recentPosts = await prisma.post.findMany({
  where: {
    createdAt: {
      gte: new Date("2024-01-01"),      // ১ জানুয়ারির পর
      lt: new Date("2024-12-31"),       // ৩১ ডিসেম্বরের আগে
    }
  }
});

// গত ৭ দিনের posts:
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentPosts2 = await prisma.post.findMany({
  where: {
    createdAt: { gte: sevenDaysAgo }
  }
});

// ─── Null Checking ────────────────────────────────────────────────────────────
const usersWithBio = await prisma.user.findMany({
  where: { bio: { not: null } }    // bio আছে
});

const usersWithoutBio = await prisma.user.findMany({
  where: { bio: null }             // bio নেই
});

// ─── Boolean Logic (AND, OR, NOT) ────────────────────────────────────────────
const filtered = await prisma.post.findMany({
  where: {
    AND: [
      { published: true },
      { views: { gt: 50 } },
    ]
  }
});

const eitherOr = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: "TypeScript" } },
      { title: { contains: "JavaScript" } },
    ]
  }
});

const excluded = await prisma.user.findMany({
  where: {
    NOT: { role: "BANNED" }
  }
});

// Combined:
const complex = await prisma.post.findMany({
  where: {
    published: true,
    OR: [
      { views: { gt: 1000 } },
      { likes: { gt: 100 } },
    ],
    NOT: { authorId: 5 },
  }
});

// ─── Relation Filtering ───────────────────────────────────────────────────────
// যেসব User-এর কমপক্ষে একটি published post আছে:
const activeAuthors = await prisma.user.findMany({
  where: {
    posts: {
      some: { published: true }
    }
  }
});

// যেসব User-এর সব post published:
const fullAuthors = await prisma.user.findMany({
  where: {
    posts: {
      every: { published: true }
    }
  }
});

// যেসব User-এর কোনো post নেই:
const noPostUsers = await prisma.user.findMany({
  where: {
    posts: { none: {} }
  }
});

// Relation-এর field দিয়ে filter (JOIN-এর মতো):
const postsByAdmin = await prisma.post.findMany({
  where: {
    author: {     // User-এর field দিয়ে Post filter
      role: "ADMIN"
    }
  }
});
```

### 🔍 Documentation-এ Search করুন:
- `"Filter conditions" → where clause operators`
- `"String filters" → contains, startsWith, mode`
- `"Relation filters" → some, every, none, is, isNot`

---

## 9. Sorting ও Pagination

```ts
// ─── Sorting (orderBy) ────────────────────────────────────────────────────────
// Single field
const users = await prisma.user.findMany({
  orderBy: { createdAt: "desc" }  // newest first
});

// Multiple fields
const posts = await prisma.post.findMany({
  orderBy: [
    { published: "desc" },  // published আগে
    { views: "desc" },      // তারপর most viewed
    { createdAt: "asc" },   // তারপর oldest
  ]
});

// Relation field দিয়ে sort:
const postsByAuthorName = await prisma.post.findMany({
  orderBy: {
    author: { name: "asc" }  // author name অনুযায়ী
  }
});

// Null values sorting:
const withNullsLast = await prisma.user.findMany({
  orderBy: { age: { sort: "asc", nulls: "last" } }
});

// ─── Offset Pagination (page number) ─────────────────────────────────────────
const PAGE_SIZE = 10;

async function getUsersPage(page: number) {
  const skip = (page - 1) * PAGE_SIZE;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage: page,
    hasNextPage: skip + PAGE_SIZE < total,
    hasPrevPage: page > 1,
  };
}

const page1 = await getUsersPage(1);
const page2 = await getUsersPage(2);

// ─── Cursor-based Pagination (infinite scroll এর জন্য ভালো) ─────────────────
// প্রথম page:
const firstPage = await prisma.post.findMany({
  take: 10,
  orderBy: { id: "asc" },
});

// পরের page (শেষ item-এর cursor থেকে):
const lastItem = firstPage[firstPage.length - 1];

const nextPage = await prisma.post.findMany({
  take: 10,
  skip: 1,              // cursor item skip করো
  cursor: { id: lastItem.id },
  orderBy: { id: "asc" },
});
```

### 🔍 Documentation-এ Search করুন:
- `"Ordering" → orderBy clause`
- `"Pagination" → offset and cursor pagination`
- `"Cursor-based pagination" → infinite scroll pattern`

---

## 10. Select ও Include

### 📖 বাংলা ব্যাখ্যা

**`select`:** শুধু নির্দিষ্ট field নাও (performance-এর জন্য)।  
**`include`:** Relation-ও সাথে নাও (JOIN-এর মতো)।

```ts
// ─── select: নির্দিষ্ট field ─────────────────────────────────────────────────
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // password: false — default-ই false, আলাদা লিখতে হবে না
    // createdAt field আসবে না
  }
});
// users: { id: number, name: string | null, email: string }[]

// ─── include: Relation সহ ────────────────────────────────────────────────────
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,      // সব post
    profile: true,    // profile
  }
});
// userWithPosts.posts → Post[]

// ─── include with filter ──────────────────────────────────────────────────────
const userWithPublishedPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },      // শুধু published post
      orderBy: { createdAt: "desc" },
      take: 5,                          // শুধু ৫টি
      select: {
        id: true,
        title: true,
        views: true,
      }
    }
  }
});

// ─── Nested include ───────────────────────────────────────────────────────────
const fullUser = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        tags: true,     // post-এর tags
        comments: {     // post-এর comments
          include: {
            author: {   // comment author
              select: { name: true }
            }
          }
        }
      }
    }
  }
});

// ─── select + relation (select দিয়েও relation আনা যায়) ──────────────────────
const users = await prisma.user.findMany({
  select: {
    name: true,
    email: true,
    _count: {          // relation count!
      select: {
        posts: true,   // posts এর count
        followers: true,
      }
    },
    posts: {
      select: { title: true }
    }
  }
});
// users[0]._count.posts → number
```

### 🔍 Documentation-এ Search করুন:
- `"Select fields" → Prisma select`
- `"Include relations" → Prisma include`
- `"Nested reads" → nested include/select`
- `"_count" → Count relation records`

---

## 11. Transactions

### 📖 বাংলা ব্যাখ্যা

Transaction মানে হলো একগুচ্ছ operation **একসাথে সফল হবে অথবা একসাথে fail করবে**। যেমন — টাকা transfer করতে গেলে একটি account থেকে বাদ দেওয়া এবং আরেকটিতে যোগ করা — দুটোই হতে হবে, না হলে একটাও না।

```ts
// ─── Sequential Transaction ($transaction array) ──────────────────────────────
// সহজ, কিন্তু একটির উপর আরেকটি depend করা যায় না
const [post, updatedUser] = await prisma.$transaction([
  prisma.post.create({
    data: { title: "New Post", authorId: 1 }
  }),
  prisma.user.update({
    where: { id: 1 },
    data: { postCount: { increment: 1 } }
  }),
]);

// ─── Interactive Transaction ($transaction callback) ─────────────────────────
// একটির result আরেকটিতে ব্যবহার করতে হলে এটা ব্যবহার করুন
const result = await prisma.$transaction(async (tx) => {
  // tx = transaction-এর prisma client

  // Sender-এর balance check
  const sender = await tx.user.findUnique({
    where: { id: 1 },
    select: { balance: true }
  });

  if (!sender || sender.balance < 1000) {
    throw new Error("অপর্যাপ্ত ব্যালেন্স"); // auto rollback হবে!
  }

  // Sender থেকে বাদ
  const updatedSender = await tx.user.update({
    where: { id: 1 },
    data: { balance: { decrement: 1000 } }
  });

  // Receiver-এ যোগ
  const updatedReceiver = await tx.user.update({
    where: { id: 2 },
    data: { balance: { increment: 1000 } }
  });

  // Transaction log
  const log = await tx.transaction.create({
    data: {
      senderId: 1,
      receiverId: 2,
      amount: 1000,
    }
  });

  return { sender: updatedSender, receiver: updatedReceiver, log };
  // সব ঠিক থাকলে commit হবে
});

// ─── Transaction Options ──────────────────────────────────────────────────────
await prisma.$transaction(
  async (tx) => {
    // operations...
  },
  {
    maxWait: 5000,    // maximum wait time (ms)
    timeout: 10000,   // transaction timeout (ms)
    isolationLevel: "Serializable", // isolation level
  }
);
```

### 🔍 Documentation-এ Search করুন:
- `"Transactions" → Prisma transaction overview`
- `"Interactive transactions" → $transaction callback`
- `"Isolation levels" → Database isolation`

---

## 12. Aggregation ও Grouping

```ts
// ─── Aggregate Functions ──────────────────────────────────────────────────────
const stats = await prisma.product.aggregate({
  _count: { id: true },      // COUNT(id)
  _sum: { price: true },     // SUM(price)
  _avg: { rating: true },    // AVG(rating)
  _min: { price: true },     // MIN(price)
  _max: { price: true },     // MAX(price)
  where: { category: "Electronics" },
});

console.log(stats._count.id);  // মোট product সংখ্যা
console.log(stats._avg.rating); // গড় rating
console.log(stats._sum.price);  // মোট মূল্য

// ─── Count ────────────────────────────────────────────────────────────────────
const totalUsers = await prisma.user.count();
const adminCount = await prisma.user.count({
  where: { role: "ADMIN" }
});

// ─── Group By ────────────────────────────────────────────────────────────────
const postsByCategory = await prisma.post.groupBy({
  by: ["category"],
  _count: { id: true },
  _avg: { views: true },
  where: { published: true },
  having: {
    views: { _avg: { gt: 100 } }  // HAVING: গড় view > 100
  },
  orderBy: {
    _count: { id: "desc" }
  }
});

// Result:
// [
//   { category: "Tech", _count: { id: 45 }, _avg: { views: 230 } },
//   { category: "Food", _count: { id: 30 }, _avg: { views: 150 } },
// ]
```

### 🔍 Documentation-এ Search করুন:
- `"Aggregation" → aggregate, count`
- `"groupBy" → Prisma groupBy`
- `"having" → Filter after grouping`

---

## 13. Raw SQL Queries

### 📖 বাংলা ব্যাখ্যা

কখনো Prisma-র built-in query দিয়ে সব করা সম্ভব হয় না — তখন raw SQL ব্যবহার করুন।

```ts
// ─── $queryRaw: SELECT (result return করে) ───────────────────────────────────
// Template literal (SQL injection থেকে নিরাপদ)
const users = await prisma.$queryRaw<User[]>`
  SELECT id, name, email
  FROM users
  WHERE role = ${role}
  AND created_at > ${new Date("2024-01-01")}
  ORDER BY name ASC
`;

// Complex query যেটা Prisma-তে করা কঠিন:
const topAuthors = await prisma.$queryRaw<{name: string; postCount: number}[]>`
  SELECT u.name, COUNT(p.id)::int AS "postCount"
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
  GROUP BY u.id, u.name
  HAVING COUNT(p.id) > 5
  ORDER BY "postCount" DESC
  LIMIT 10
`;

// ─── $executeRaw: INSERT/UPDATE/DELETE (affected rows count) ─────────────────
const affectedRows = await prisma.$executeRaw`
  UPDATE posts
  SET views = views + 1
  WHERE id = ${postId}
`;
console.log(affectedRows); // কতটা row affected

// ─── Unsafe versions (dynamic query — carefully!) ─────────────────────────────
// ⚠️ SQL injection risk! শুধু trusted input-এ
const tableName = "users";
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM ${tableName} LIMIT 10`
);
```

### 🔍 Documentation-এ Search করুন:
- `"Raw queries" → $queryRaw, $executeRaw`
- `"Raw database access" → Raw SQL in Prisma`

---

## 14. Prisma Middleware

### 📖 বাংলা ব্যাখ্যা

Middleware দিয়ে প্রতিটি Prisma query-র আগে বা পরে কিছু করা যায় — logging, soft delete, audit trail ইত্যাদি।

```ts
// ─── Query Logging Middleware ─────────────────────────────────────────────────
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  console.log(`[Prisma] ${params.model}.${params.action} — ${duration}ms`);
  return result;
});

// ─── Soft Delete Middleware ───────────────────────────────────────────────────
// delete কল করলে আসলে deletedAt set হবে, record থাকবে
prisma.$use(async (params, next) => {
  if (params.model === "User") {
    if (params.action === "delete") {
      // delete → update (soft delete)
      params.action = "update";
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === "deleteMany") {
      params.action = "updateMany";
      if (params.args.data !== undefined) {
        params.args.data.deletedAt = new Date();
      } else {
        params.args.data = { deletedAt: new Date() };
      }
    }

    // findMany থেকে deleted records বাদ দাও
    if (params.action === "findMany" || params.action === "findFirst") {
      if (params.args.where) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      } else {
        params.args.where = { deletedAt: null };
      }
    }
  }

  return next(params);
});
```

> **নোট:** Prisma-র নতুন version-এ `$extends` (Prisma Client Extensions) দিয়ে এই কাজ করুন — middleware deprecated হচ্ছে।

### 🔍 Documentation-এ Search করুন:
- `"Middleware" → Prisma middleware (legacy)`
- `"Client extensions" → $extends (modern approach)`
- `"Soft delete" → Soft delete pattern with Prisma`

---

## 15. Prisma Studio

### 📖 বাংলা ব্যাখ্যা

Prisma Studio হলো একটি **visual database browser** — browser-এ table দেখুন, data edit করুন।

```bash
npx prisma studio
# Browser-এ http://localhost:5555 খুলবে
```

**কী করতে পারবেন:**
- সব table দেখুন
- Data filter ও sort করুন
- Record add/edit/delete করুন
- Relation navigate করুন

---

## 16. Seeding Database

### 📖 বাংলা ব্যাখ্যা

Seed মানে database-এ শুরুতে কিছু default/test data ভরা।

```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Admin user তৈরি
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},  // আগে থেকে থাকলে কিছু করো না
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Categories তৈরি
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Technology" },
      update: {},
      create: { name: "Technology", slug: "technology" },
    }),
    prisma.category.upsert({
      where: { name: "Business" },
      update: {},
      create: { name: "Business", slug: "business" },
    }),
  ]);

  // Sample posts
  await prisma.post.createMany({
    data: [
      { title: "Getting Started with Prisma", authorId: admin.id, published: true },
      { title: "Next.js Best Practices", authorId: admin.id, published: true },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```json
// package.json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
# Seed run করুন:
npx prisma db seed

# Reset করে seed:
npx prisma migrate reset  # (dev only — সব data মুছবে)
```

### 🔍 Documentation-এ Search করুন:
- `"Seeding" → Prisma seeding guide`

---

---

# PART 2 — NEXT.JS CORE CONCEPTS

---

## 17. Next.js কী এবং কেন?

### 📖 বাংলা ব্যাখ্যা

**Next.js** হলো React-এর উপর তৈরি একটি **full-stack framework**। শুধু React দিয়ে শুধু frontend বানানো যায়, কিন্তু Next.js দিয়ে **frontend + backend + database** সব একই project-এ করা যায়।

### Next.js কী দেয়:

| Feature | মানে | কেন দরকার |
|---------|------|-----------|
| **File-based Routing** | ফোল্ডার = Route | Router configure করতে হয় না |
| **Server Components** | Server-এ render | Faster initial load, SEO |
| **Server Actions** | Server-side function | API route ছাড়াই form submit |
| **API Routes** | Built-in API | Separate backend লাগে না |
| **Image Optimization** | Auto-optimize | Performance |
| **SEO Tools** | Metadata API | Search ranking |
| **Caching** | Smart caching | Fast repeat requests |

### Rendering Strategies:
- **SSR (Server-Side Rendering):** প্রতি request-এ server-এ render
- **SSG (Static Site Generation):** Build time-এ একবার render
- **ISR (Incremental Static Regeneration):** Background-এ revalidate
- **CSR (Client-Side Rendering):** Browser-এ render (traditional React)

### 🔍 Documentation-এ Search করুন:
- `"Next.js getting started" → Installation`
- `"Rendering strategies" → SSR, SSG, ISR overview`

---

## 18. App Router vs Pages Router

### 📖 বাংলা ব্যাখ্যা

Next.js-এ দুটো routing system আছে। **App Router (নতুন)** ব্যবহার করুন।

| বিষয় | App Router (`/app`) | Pages Router (`/pages`) |
|-------|---------------------|------------------------|
| Status | ✅ নতুন (Next.js 13+) | পুরনো, এখনো চলে |
| Default | Server Component | Client Component |
| Layouts | Nested layouts | `_app.js` |
| Data fetching | `async/await` directly | `getServerSideProps` etc |
| Server Actions | ✅ হ্যাঁ | ❌ নেই |
| Loading UI | `loading.tsx` | Manual |

**এই গাইড App Router-এর উপর।**

---

## 19. File-based Routing

### 📖 বাংলা ব্যাখ্যা

Next.js-এ **ফাইলের নাম এবং ফোল্ডার মানেই route**। কোনো router configure করতে হয় না।

### বিশেষ ফাইলগুলো:

| ফাইল | কাজ |
|------|-----|
| `page.tsx` | Route-এর UI (এটা না থাকলে route নেই) |
| `layout.tsx` | Shared layout (children wrap করে) |
| `loading.tsx` | Loading skeleton/spinner |
| `error.tsx` | Error UI |
| `not-found.tsx` | 404 page |
| `route.ts` | API endpoint |
| `middleware.ts` | Request interceptor |
| `template.tsx` | layout-এর মতো কিন্তু re-mount হয় |

### Route Structure:

```
app/
├── page.tsx              → /
├── layout.tsx            → root layout (সব page-এ থাকে)
├── loading.tsx           → / এর loading
├── error.tsx             → / এর error
│
├── about/
│   └── page.tsx          → /about
│
├── blog/
│   ├── layout.tsx        → /blog এর shared layout
│   ├── page.tsx          → /blog
│   └── [slug]/           → Dynamic route
│       ├── page.tsx      → /blog/my-post, /blog/another-post
│       └── loading.tsx
│
├── shop/
│   └── [...categories]/  → Catch-all: /shop/a, /shop/a/b, /shop/a/b/c
│       └── page.tsx
│
├── (auth)/               → Route Group (URL-এ আসে না)
│   ├── login/
│   │   └── page.tsx      → /login
│   └── register/
│       └── page.tsx      → /register
│
├── dashboard/
│   ├── layout.tsx        → Dashboard layout
│   ├── page.tsx          → /dashboard
│   ├── settings/
│   │   └── page.tsx      → /dashboard/settings
│   └── @modal/           → Parallel Routes (advanced)
│       └── page.tsx
│
└── api/
    └── users/
        └── route.ts      → /api/users (API endpoint)
```

### Dynamic Routes:

```tsx
// app/blog/[slug]/page.tsx
interface Props {
  params: { slug: string };
  searchParams: { page?: string };  // ?page=2
}

export default function BlogPost({ params, searchParams }: Props) {
  const { slug } = params;
  const page = searchParams.page ?? "1";

  return <div>Post: {slug}, Page: {page}</div>;
}
```

```tsx
// app/shop/[...categories]/page.tsx — Catch-all
interface Props {
  params: { categories: string[] };
}

export default function ShopPage({ params }: Props) {
  // /shop/electronics/phones → ["electronics", "phones"]
  const breadcrumb = params.categories.join(" > ");
  return <div>{breadcrumb}</div>;
}
```

### Link Navigation:
```tsx
import Link from "next/link";
import { useRouter } from "next/navigation"; // Client Component-এ

// Static link
<Link href="/about">About</Link>

// Dynamic link
<Link href={`/blog/${post.slug}`}>Read More</Link>

// Programmatic navigation (Client Component-এ)
const router = useRouter();
router.push("/dashboard");
router.replace("/login");  // history-তে রাখে না
router.back();
router.refresh();  // server data refresh
```

### 🔍 Documentation-এ Search করুন:
- `"Defining Routes" → App Router routing`
- `"Dynamic Routes" → [param] routing`
- `"Route Groups" → (group) syntax`
- `"Link component" → Next.js Link`

---

## 20. Server Components vs Client Components

### 📖 বাংলা ব্যাখ্যা

এটা Next.js App Router-এর **সবচেয়ে গুরুত্বপূর্ণ concept**।

| | Server Component | Client Component |
|-|-----------------|-----------------|
| **Default** | ✅ হ্যাঁ (App Router-এ) | `"use client"` লিখতে হয় |
| **কোথায় render** | Server-এ | Browser-এ |
| **Database access** | ✅ সরাসরি | ❌ নেই (API দিয়ে) |
| **useState, useEffect** | ❌ নেই | ✅ আছে |
| **Event handlers** | ❌ নেই | ✅ onClick etc |
| **Browser APIs** | ❌ নেই | ✅ localStorage etc |
| **Bundle size** | Client bundle-এ যায় না | Client bundle-এ যায় |
| **SEO** | ✅ ভালো | ❌ খারাপ |

### Server Component (Default):

```tsx
// app/users/page.tsx — Server Component (কোনো directive নেই)
import { prisma } from "@/lib/prisma";

// async হতে পারে! সরাসরি await করা যায়
export default async function UsersPage() {
  // সরাসরি database query (API route লাগে না!)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1>Users ({users.length})</h1>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Client Component:

```tsx
// app/components/SearchBox.tsx
"use client";  // এই line দিয়ে শুরু

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/search?q=${query}`);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

### Pattern: Server-এ data fetch, Client-এ interactive:

```tsx
// app/posts/page.tsx — Server Component
import PostList from "@/components/PostList"; // Client Component হতে পারে
import { prisma } from "@/lib/prisma";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({ where: { published: true } });

  // Server data → Client component-এ pass করুন props দিয়ে
  return <PostList initialPosts={posts} />;
}

// components/PostList.tsx — Client Component
"use client";

import { useState } from "react";
import type { Post } from "@prisma/client";

interface Props {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
```

### 🔍 Documentation-এ Search করুন:
- `"Server and Client Components" → When to use which`
- `"use client" → Client component directive`
- `"Composition Patterns" → Server + Client patterns`

---

## 21. Layouts ও Templates

### 📖 বাংলা ব্যাখ্যা

**Layout:** Child route বদলালেও layout re-render হয় না — state maintain থাকে।  
**Template:** Route change হলে নতুন instance তৈরি হয় (re-mount)।

```tsx
// app/layout.tsx — Root Layout (সব page-এ থাকবে)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App",
  description: "My awesome app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={inter.className}>
        <header>Navigation</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx — Nested Layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
```

### 🔍 Documentation-এ Search করুন:
- `"Layouts" → Creating layouts`
- `"Root Layout" → Root layout requirements`
- `"Nesting Layouts" → Nested layout pattern`

---

## 22. Data Fetching

### 📖 বাংলা ব্যাখ্যা

App Router-এ data fetch করার উপায় অনেক পরিবর্তিত হয়েছে।

```tsx
// ─── Server Component-এ সরাসরি (সবচেয়ে সহজ) ────────────────────────────────
export default async function Page() {
  // fetch() — Next.js extend করা (caching built-in)
  const data = await fetch("https://api.example.com/posts");
  const posts = await data.json();

  // অথবা সরাসরি Prisma:
  const users = await prisma.user.findMany();

  return <div>{/* render */}</div>;
}

// ─── Parallel Data Fetching (একসাথে, সময় বাঁচায়) ───────────────────────────
export default async function Dashboard() {
  // ❌ Sequential (ধীরে): প্রথমটা শেষ হলে দ্বিতীয়টা শুরু
  // const users = await prisma.user.count();
  // const posts = await prisma.post.count();

  // ✅ Parallel (দ্রুত): একসাথে চলে
  const [usersCount, postsCount, recentPosts] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <p>Users: {usersCount}</p>
      <p>Posts: {postsCount}</p>
    </div>
  );
}

// ─── fetch() এর Caching Options ───────────────────────────────────────────────
// Static (একবার fetch, cache-এ থাকে — default):
const res = await fetch("https://api.example.com/static-data");

// No cache (প্রতি request-এ fresh):
const res = await fetch("https://api.example.com/live-data", {
  cache: "no-store",
});

// Revalidate (x সেকেন্ড পর stale হলে refetch):
const res = await fetch("https://api.example.com/data", {
  next: { revalidate: 3600 }, // 1 hour
});

// ─── Client-side Fetching (SWR / TanStack Query) ─────────────────────────────
// "use client" component-এ
"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ClientPosts() {
  const { data, error, isLoading } = useSWR("/api/posts", fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{data.posts.length} posts</div>;
}
```

### 🔍 Documentation-এ Search করুন:
- `"Data Fetching" → Next.js data fetching patterns`
- `"fetch" → Extended fetch API in Next.js`
- `"Parallel and Sequential" → Data fetching strategies`

---

## 23. Server Actions

### 📖 বাংলা ব্যাখ্যা

**Server Action** হলো Server-এ run হওয়া function যেটা Client Component থেকে call করা যায় — API route বানাতে হয় না। Form submit, database write ইত্যাদির জন্য।

```tsx
// ─── Server Action (server-এ চলে) ────────────────────────────────────────────
// app/actions/posts.ts
"use server";  // এই file-এর সব function server-এ চলবে

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Validation
  if (!title || title.length < 3) {
    return { error: "Title must be at least 3 characters" };
  }

  // Database write (API route লাগছে না!)
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: 1, // normally session থেকে নেবেন
    },
  });

  // Cache clear করুন
  revalidatePath("/posts");

  // Redirect
  redirect(`/posts/${post.id}`);
}

export async function deletePost(postId: number) {
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/posts");
}

export async function togglePublish(postId: number, published: boolean) {
  await prisma.post.update({
    where: { id: postId },
    data: { published },
  });
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
}
```

```tsx
// ─── Form-এ Server Action ─────────────────────────────────────────────────────
// app/posts/new/page.tsx — Server Component
import { createPost } from "@/actions/posts";

export default function NewPostPage() {
  return (
    <form action={createPost}>  {/* সরাসরি function! */}
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}

// ─── Client Component-এ Server Action ────────────────────────────────────────
"use client";

import { createPost } from "@/actions/posts";
import { useFormState, useFormStatus } from "react-dom";

// Form state management
const initialState = { error: null };

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, initialState);
  const { pending } = useFormStatus(); // submit হচ্ছে কিনা

  return (
    <form action={formAction}>
      {state.error && <p className="error">{state.error}</p>}
      <input name="title" />
      <button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}

// ─── Button-এ Server Action ───────────────────────────────────────────────────
"use client";

import { deletePost } from "@/actions/posts";

export function DeleteButton({ postId }: { postId: number }) {
  return (
    <button
      onClick={() => deletePost(postId)}
    >
      Delete
    </button>
  );
}

// ─── Optimistic Updates সহ ──────────────────────────────────────────────────
"use client";

import { useOptimistic } from "react";
import { toggleLike } from "@/actions/posts";

export function LikeButton({ postId, initialLikes }: { postId: number; initialLikes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, increment: number) => state + increment
  );

  return (
    <button
      onClick={async () => {
        addOptimisticLike(1);  // UI তাৎক্ষণিক update
        await toggleLike(postId);  // Server call
      }}
    >
      ❤️ {optimisticLikes}
    </button>
  );
}
```

### 🔍 Documentation-এ Search করুন:
- `"Server Actions" → Next.js server actions`
- `"Forms" → Form handling with server actions`
- `"useFormState" → Form state with server actions`
- `"revalidatePath" → Cache invalidation`

---

## 24. API Routes (Route Handlers)

### 📖 বাংলা ব্যাখ্যা

App Router-এ API endpoint বানাতে `route.ts` ফাইল ব্যবহার করুন। Mobile app বা third-party service-এর জন্য REST API বানাতে কাজে লাগে।

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        skip: (page - 1) * limit,
        take: limit,
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      posts,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: { title, content, authorId },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// app/api/posts/[id]/route.ts
interface Context {
  params: { id: string };
}

// GET /api/posts/123
export async function GET(request: NextRequest, { params }: Context) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: { author: true, tags: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PATCH /api/posts/123
export async function PATCH(request: NextRequest, { params }: Context) {
  const body = await request.json();

  const post = await prisma.post.update({
    where: { id: parseInt(params.id) },
    data: body,
  });

  return NextResponse.json(post);
}

// DELETE /api/posts/123
export async function DELETE(request: NextRequest, { params }: Context) {
  await prisma.post.delete({
    where: { id: parseInt(params.id) },
  });

  return new NextResponse(null, { status: 204 });
}
```

### Headers ও Cookies:
```ts
import { cookies, headers } from "next/headers";

export async function GET(request: NextRequest) {
  // Headers পড়া
  const authHeader = request.headers.get("Authorization");
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  // Response-এ cookie set
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "value", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return response;
}
```

### 🔍 Documentation-এ Search করুন:
- `"Route Handlers" → API routes in App Router`
- `"NextResponse" → Response helpers`
- `"Cookies" → Cookie handling in Next.js`

---

## 25. Middleware

### 📖 বাংলা ব্যাখ্যা

Middleware প্রতিটি request-এর আগে চলে — authentication check, redirect, header add ইত্যাদির জন্য।

```ts
// middleware.ts (root-এ, app-এর বাইরে)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ─── Authentication Check ──────────────────────────────────────────────────
  const token = request.cookies.get("token")?.value;
  const isProtected = path.startsWith("/dashboard");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ─── Role-based Access ─────────────────────────────────────────────────────
  const isAdminRoute = path.startsWith("/admin");
  const userRole = request.cookies.get("role")?.value;

  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // ─── Custom Headers ───────────────────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Custom-Header", "MyApp");

  // ─── Geo-based Redirect ───────────────────────────────────────────────────
  const country = request.geo?.country;
  if (country === "BD" && !path.startsWith("/bn")) {
    return NextResponse.redirect(new URL(`/bn${path}`, request.url));
  }

  return response;
}

// কোন route-এ middleware চলবে:
export const config = {
  matcher: [
    "/dashboard/:path*",  // /dashboard এবং sub-routes
    "/admin/:path*",
    "/((?!api|_next/static|favicon.ico).*)", // api ও static বাদে সব
  ],
};
```

### 🔍 Documentation-এ Search করুন:
- `"Middleware" → Next.js middleware`
- `"Matcher" → Middleware matcher config`

---

## 26. Image Optimization

### 📖 বাংলা ব্যাখ্যা

`next/image` দিয়ে image automatically optimize হয় — resize, WebP convert, lazy load।

```tsx
import Image from "next/image";

// ─── Local Image ──────────────────────────────────────────────────────────────
import profilePic from "@/public/profile.jpg";

<Image
  src={profilePic}
  alt="Profile picture"
  // width ও height auto (local image থেকে)
  priority  // Above the fold হলে priority দিন (LCP)
/>

// ─── Remote Image ─────────────────────────────────────────────────────────────
<Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={800}     // required for remote
  height={600}    // required for remote
  quality={85}    // 1-100 (default 75)
/>

// ─── Fill (parent container পূরণ) ─────────────────────────────────────────────
<div style={{ position: "relative", width: "100%", height: "400px" }}>
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    style={{ objectFit: "cover" }}
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>

// ─── Responsive Sizes ─────────────────────────────────────────────────────────
<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={500}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

```js
// next.config.js — Remote image domains allow করুন
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
```

### 🔍 Documentation-এ Search করুন:
- `"Image optimization" → next/image component`
- `"Image component" → Props and usage`
- `"Remote patterns" → Allow external images`

---

## 27. Fonts

```tsx
// app/layout.tsx
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";

// Bengali font
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",  // CSS variable
});

// Preload করা হয়, external request নেই, fast
export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className={hindSiliguri.className}>
        {children}
      </body>
    </html>
  );
}

// Local font:
import localFont from "next/font/local";

const myFont = localFont({
  src: [
    { path: "./fonts/MyFont-Regular.woff2", weight: "400" },
    { path: "./fonts/MyFont-Bold.woff2",    weight: "700" },
  ],
  variable: "--font-my",
});
```

### 🔍 Documentation-এ Search করুন:
- `"Font optimization" → next/font`
- `"Google Fonts" → next/font/google`

---

## 28. Metadata ও SEO

```tsx
// ─── Static Metadata ──────────────────────────────────────────────────────────
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | MyApp",
  description: "Learn about our company",
  keywords: ["about", "company", "team"],
  openGraph: {
    title: "About Us",
    description: "Learn about our company",
    images: ["/og-about.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: "Learn about our company",
    images: ["/twitter-about.jpg"],
  },
};

// ─── Dynamic Metadata (route params থেকে) ────────────────────────────────────
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | MyBlog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage ?? "/default-og.jpg"],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

// ─── Root Metadata Template ────────────────────────────────────────────────────
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: "%s | MyApp",  // %s = child page-এর title
    default: "MyApp",
  },
  description: "My awesome app",
  metadataBase: new URL("https://myapp.com"),  // absolute URL-এর জন্য
};
```

### 🔍 Documentation-এ Search করুন:
- `"Metadata" → Metadata API`
- `"generateMetadata" → Dynamic metadata`
- `"Open Graph" → Social sharing metadata`

---

## 29. Environment Variables

```env
# .env (local development)
DATABASE_URL="postgresql://..."

# .env.local (personal, gitignore করুন)
NEXTAUTH_SECRET="my-secret"

# .env.production (production-এ)
DATABASE_URL="postgresql://prod-url..."
```

```ts
// Server-side (API routes, Server Components, Server Actions)
const dbUrl = process.env.DATABASE_URL;        // private
const secret = process.env.NEXTAUTH_SECRET;    // private

// Client-side (Browser-এ expose)
// NEXT_PUBLIC_ prefix লাগবে
const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // public
```

```js
// next.config.js — extra validation
const nextConfig = {
  env: {
    // Custom env vars
    APP_VERSION: process.env.npm_package_version,
  },
};
```

```ts
// lib/env.ts — Type-safe environment validation
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  NEXTAUTH_SECRET: requireEnv("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: requireEnv("NEXTAUTH_URL"),
};
```

### 🔍 Documentation-এ Search করুন:
- `"Environment Variables" → Next.js env vars`
- `"NEXT_PUBLIC" → Client-side environment variables`

---

## 30. Error Handling

```tsx
// app/error.tsx — Global error boundary (Client Component হতে হবে)
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error reporting service (Sentry etc)
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// app/not-found.tsx — 404 page
export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

// Server Component-এ notFound() ব্যবহার:
import { notFound } from "next/navigation";

export default async function PostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) }
  });

  if (!post) notFound(); // → not-found.tsx দেখাবে

  return <div>{post.title}</div>;
}
```

### 🔍 Documentation-এ Search করুন:
- `"Error handling" → error.tsx`
- `"notFound" → 404 handling`
- `"redirect" → Programmatic redirect`

---

## 31. Loading ও Suspense

```tsx
// app/posts/loading.tsx — Instant loading skeleton
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

// Suspense দিয়ে specific section-এর loading:
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Stats দ্রুত আসে */}
      <Suspense fallback={<StatsLoading />}>
        <Stats />  {/* async Server Component */}
      </Suspense>

      {/* Comments ধীরে আসে */}
      <Suspense fallback={<p>Loading comments...</p>}>
        <RecentComments />
      </Suspense>
    </div>
  );
}

async function Stats() {
  const count = await prisma.user.count(); // slow query
  return <div>Users: {count}</div>;
}
```

### 🔍 Documentation-এ Search করুন:
- `"Loading UI" → loading.tsx`
- `"Suspense" → React Suspense in Next.js`
- `"Streaming" → Progressive rendering`

---

## 32. Caching Strategy

### 📖 বাংলা ব্যাখ্যা

Next.js-এ অনেক layer-এ caching হয়। এটা বোঝা performance-এর জন্য গুরুত্বপূর্ণ।

```ts
// ─── fetch() Caching ─────────────────────────────────────────────────────────
// Forever cache (static — default):
fetch("https://api.example.com/config")

// No cache:
fetch("https://api.example.com/live", { cache: "no-store" })

// Time-based revalidation:
fetch("https://api.example.com/data", { next: { revalidate: 3600 } })

// Tag-based revalidation:
fetch("https://api.example.com/posts", { next: { tags: ["posts"] } })

// ─── On-demand Revalidation ───────────────────────────────────────────────────
import { revalidatePath, revalidateTag } from "next/cache";

// Path-based: এই URL-এর cache clear
revalidatePath("/posts");
revalidatePath("/posts/[id]", "page"); // dynamic route

// Tag-based: এই tag-এর সব cache clear
revalidateTag("posts");

// ─── Route Segment Config ─────────────────────────────────────────────────────
// page.tsx বা layout.tsx-এ export করে caching control:

// এই page সম্পূর্ণ dynamic (no cache):
export const dynamic = "force-dynamic";
// default: "auto"
// "force-static" — সব static
// "force-dynamic" — সব dynamic

// Revalidation time:
export const revalidate = 3600; // 1 hour

// Runtime:
export const runtime = "edge"; // "nodejs" বা "edge"

// ─── unstable_cache (Prisma query cache) ─────────────────────────────────────
import { unstable_cache } from "next/cache";

const getCachedPosts = unstable_cache(
  async () => {
    return prisma.post.findMany({ where: { published: true } });
  },
  ["published-posts"],  // cache key
  {
    revalidate: 300,     // 5 minutes
    tags: ["posts"],     // tag-এ revalidate করা যাবে
  }
);

// ব্যবহার:
const posts = await getCachedPosts();
```

### 🔍 Documentation-এ Search করুন:
- `"Caching" → Next.js caching overview`
- `"revalidatePath" → On-demand revalidation`
- `"unstable_cache" → Function-level caching`
- `"Route Segment Config" → dynamic, revalidate export`

---

## 33. Authentication Pattern

### 📖 বাংলা ব্যাখ্যা

Next.js-এ authentication এর জন্য **NextAuth.js (Auth.js)** সবচেয়ে জনপ্রিয়।

```bash
npm install next-auth@beta @auth/prisma-adapter
```

```ts
// auth.ts (root-এ)
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),  // Prisma দিয়ে session store

  providers: [
    // Social Login
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // Email/Password
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        return isValid ? user : null;
      }
    })
  ],

  callbacks: {
    async session({ session, user }) {
      // Session-এ extra data যোগ
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    }
  },

  pages: {
    signIn: "/login",     // Custom login page
    error: "/auth/error",
  }
});

// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from "@/auth";
```

```tsx
// Session ব্যবহার:

// Server Component-এ:
import { auth } from "@/auth";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) redirect("/login");

  return <div>Welcome, {session.user.name}!</div>;
}

// Client Component-এ:
"use client";
import { useSession } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <a href="/login">Login</a>;

  return <div>{session.user.name}</div>;
}

// SignIn/SignOut buttons:
import { signIn, signOut } from "@/auth";

<form action={async () => { "use server"; await signIn("github"); }}>
  <button>Login with GitHub</button>
</form>

<form action={async () => { "use server"; await signOut(); }}>
  <button>Sign Out</button>
</form>
```

### Prisma Schema for Auth:
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Credentials provider-এর জন্য
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 🔍 Documentation-এ Search করুন:
- `"NextAuth.js" → nextjs.org/docs/authentication`
- `"Auth.js" → authjs.dev`
- `"Prisma Adapter" → @auth/prisma-adapter`
- `"auth() function" → Server-side session`

---

## 34. Prisma + Next.js একসাথে

### 📖 বাংলা ব্যাখ্যা

এখানে Prisma এবং Next.js একসাথে কীভাবে ব্যবহার করবেন তার complete pattern দেওয়া আছে।

### Project Structure:
```
my-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── edit/page.tsx
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── layout.tsx
│   └── page.tsx
│
├── actions/               ← Server Actions
│   ├── posts.ts
│   └── users.ts
│
├── lib/
│   ├── prisma.ts         ← Prisma singleton
│   └── auth.ts           ← Auth config
│
├── components/
│   ├── ui/               ← Reusable UI
│   └── forms/            ← Form components
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── .env
├── next.config.js
└── package.json
```

### Complete Example — Blog CRUD:

```prisma
// prisma/schema.prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  content   String?
  excerpt   String?
  published Boolean  @default(false)
  views     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]
}
```

```ts
// actions/posts.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt: content?.substring(0, 160),
      authorId: session.user.id,
    },
  });

  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

export async function publishPost(postId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.post.update({
    where: { id: postId, authorId: session.user.id },
    data: { published: true },
  });

  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
}
```

```tsx
// app/posts/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60; // 1 minute cache

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 10;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  return (
    <div>
      <h1>Blog Posts</h1>
      <Link href="/posts/new">Write New Post</Link>

      {posts.map((post) => (
        <article key={post.id}>
          <Link href={`/posts/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.excerpt}</p>
          <p>By: {post.author.name}</p>
          <p>{post.views} views</p>
        </article>
      ))}

      <div>
        Page {page} of {Math.ceil(total / limit)}
        {page > 1 && <Link href={`?page=${page - 1}`}>Previous</Link>}
        {page * limit < total && <Link href={`?page=${page + 1}`}>Next</Link>}
      </div>
    </div>
  );
}

// app/posts/[id]/page.tsx
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: { author: true, tags: true },
  });

  if (!post || !post.published) notFound();

  // View count increment (fire-and-forget)
  prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(console.error);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By: {post.author.name}</p>
      <div>{post.content}</div>
    </article>
  );
}

// app/posts/new/page.tsx
import { createPost } from "@/actions/posts";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Write your post..." rows={10} />
      <button type="submit">Publish Post</button>
    </form>
  );
}
```

---

## 📋 Quick Reference — সব গুরুত্বপূর্ণ Command

```bash
# ─── Prisma ──────────────────────────────────────────────────────────────────
npx prisma init                          # Setup
npx prisma migrate dev --name [name]     # New migration (dev)
npx prisma migrate deploy                # Apply migrations (prod)
npx prisma migrate reset                 # Reset DB (dev only!)
npx prisma generate                      # Regenerate client
npx prisma db push                       # Push schema (no migration)
npx prisma db pull                       # Pull schema from DB
npx prisma studio                        # Open visual DB browser
npx prisma db seed                       # Run seed file
npx prisma migrate status                # Check migration status

# ─── Next.js ─────────────────────────────────────────────────────────────────
npx create-next-app@latest              # New project
npm run dev                              # Development server
npm run build                            # Production build
npm run start                            # Start production server
npm run lint                             # Lint check
```

---

## 📚 Documentation লিংক — Topic অনুযায়ী

### Prisma Documentation (prisma.io/docs):
| Topic | Search Query |
|-------|-------------|
| Schema | `"Schema" → Data modeling` |
| Relations | `"Relations" → One-to-many, Many-to-many` |
| CRUD | `"CRUD" → Client API reference` |
| Filtering | `"Filtering and sorting"` |
| Pagination | `"Pagination" → Offset, Cursor` |
| Transactions | `"Transactions and batch queries"` |
| Migrations | `"Prisma Migrate"` |
| Raw SQL | `"Raw database access"` |
| Seeding | `"Seeding your database"` |
| Studio | `"Prisma Studio"` |

### Next.js Documentation (nextjs.org/docs):
| Topic | Search Query |
|-------|-------------|
| Routing | `"Routing Fundamentals"` |
| Server Components | `"Server and Client Components"` |
| Data Fetching | `"Data Fetching, Caching, Revalidating"` |
| Server Actions | `"Server Actions and Mutations"` |
| API Routes | `"Route Handlers"` |
| Middleware | `"Middleware"` |
| Image | `"Image Optimization"` |
| Metadata | `"Metadata"` |
| Caching | `"Caching"` |
| Authentication | `"Authentication"` |

---

> 📌 **মনে রাখুন:**  
> ১. Prisma Client সবসময় Singleton হিসেবে ব্যবহার করুন (`lib/prisma.ts`)।  
> ২. Next.js App Router-এ default Server Component — শুধু interactive হলে `"use client"` দিন।  
> ৩. Server Action ব্যবহার করুন form submit-এ — API route লাগবে না।  
> ৪. Database query-র পর `revalidatePath()` অথবা `revalidateTag()` দিন।  
> ৫. Production-এ `prisma migrate deploy` — কখনো `migrate dev` নয়।  
> ৬. `.env` file কখনো git-এ push করবেন না।