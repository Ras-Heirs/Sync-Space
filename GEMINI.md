ADD GEMINI.md to gitignore

# SyncSpace Development Plan & Architecture Context
**Sistem Pencarian dan Manajemen Ruang Aktivitas Sosial**

Dokumen ini berisi konteks arsitektur dan skenario database untuk proyek SyncSpace. Gunakan instruksi dan struktur di bawah ini sebagai panduan utama dalam meng-generate kode backend.

## 1. Tech Stack & Infrastructure (Optimized for Node.js)
* **Framework:** Node.js (Express.js) - REST API.
* **Database:** PostgreSQL Serverless (Neon.tech).
* **ORM / Query Builder:** Drizzle ORM.
* **Real-time Engine:** Pusher Channels (Vercel serverless friendly).
* **Authentication:** JWT with email/password (Bcrypt) and Google OAuth 2.0.
* **Validation:** Joi (Schema-based request validation).

---

## Required Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
PUSHER_APP_ID="your_app_id"
PUSHER_KEY="your_key"
PUSHER_SECRET="your_secret"
PUSHER_CLUSTER="your_cluster"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key"
NEXT_PUBLIC_PUSHER_KEY="your_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
```

## 2. Database Schema (PostgreSQL)
Sistem menggunakan relasi SQL dengan pemanfaatan tipe data `JSONB` for flexibility.

### Table `users`
* `id` (UUID, Primary Key)
* `name` (String)
* `email` (String, Unique)
* `password` (Text, hashed with Bcrypt)
* `image` (String, URL)
* `domicile` (String)
* `hobbies` (String[])

### Table `rooms`
* `id` (UUID, Primary Key)
* `master_id` (FK to users)
* `category_id` (FK to categories)
* `title` (String)
* `description` (Text)
* `region` (String)
* `max_capacity` (Int)
* `is_private` (Boolean)
* `status` (Enum: 'OPEN', 'FULL', 'CLOSED')
* `activity_details` (JSONB)

### Table `participants`
* `id` (UUID, Primary Key)
* `room_id` (FK to rooms)
* `user_id` (FK to users)
* `status` (Enum: 'PENDING', 'JOINED', 'REJECTED')

---

## 3. Core Logic & Queries

### A. Suggested Rooms (Priority Sorting)
1. Filter `region` same as user's `domicile`.
2. Check if `category_name` matches user's `hobbies` array.
3. Ranking Logic: Match = 1, No Match = 0. Sort by `rank DESC`, then `created_at DESC`.
4. Supports `categoryId` override for users wanting to explore outside their hobbies.

### B. Real-time Lobby Updates (Pusher)
1. Trigger `new-room` event on `lobby-[region]` channel.
2. Trigger `request-update` on `user-[master_id]` channel for join requests.

---

## 4. Validation & Security Strategy

### Why Joi for Validation?
We use **Joi** as our validation engine to maintain high code quality and security:
*   **Declarative Schema:** Validation rules are defined in a central schema, making the code readable and easy to maintain compared to manual `if/else` checks.
*   **Fail-Fast Feedback:** It validates input *before* it reaches the controller or database, protecting our resources from malformed data.
*   **Detailed Error Reporting:** Provides clear, specific messages to the frontend (e.g., "Email must be a valid email string") which improves user experience and developer productivity.
*   **Sanitization:** Automatically handles type casting and defaults (e.g., converting a string "true" to a boolean `true`).

---

## 5. SQL Schema (PostgreSQL/Neon)
Copy and paste this into your Neon SQL Editor.

### Step 1: Cleanup
```sql
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS room_status;
DROP TYPE IF EXISTS participant_status;
```

### Step 2: Initialize Schema
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE room_status AS ENUM ('OPEN', 'FULL', 'CLOSED');
CREATE TYPE participant_status AS ENUM ('PENDING', 'JOINED', 'REJECTED');

-- Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    image TEXT,
    domicile VARCHAR(100),
    hobbies TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    region VARCHAR(100) NOT NULL,
    max_capacity INT NOT NULL CHECK (max_capacity > 0),
    is_private BOOLEAN DEFAULT FALSE,
    status room_status DEFAULT 'OPEN',
    activity_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status participant_status DEFAULT 'PENDING',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_room_user UNIQUE(room_id, user_id)
);

-- Indices
CREATE INDEX idx_rooms_region ON rooms(region);
CREATE INDEX idx_rooms_category ON rooms(category_id);
```

### Initial Data Seed
```sql
INSERT INTO categories (name) VALUES
('Sports'), ('Gaming'), ('Education'), ('Social'), ('Music'), ('Hobbies');
```