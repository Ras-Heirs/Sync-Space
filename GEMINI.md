# Project: SBD Store & MatchIt!

This workspace contains two primary components: a robust Express.js backend (SBD Store) and a modern Next.js frontend (MatchIt! - Social Activity Matching).

## ⚠️ Critical Note: Next.js Version
The frontend uses **Next.js 16.2.6**, which contains breaking changes and different conventions compared to standard Next.js versions. 
- Refer to `@frontend/AGENTS.md` for specific rules.
- Check `node_modules/next/dist/docs/` for relevant documentation.

## Project Overview

### Backend
ADD GEMINI.md to gitignore

# SyncSpace Development Plan & Architecture Context
**Sistem Pencarian dan Manajemen Ruang Aktivitas Sosial**

Dokumen ini berisi konteks arsitektur dan skenario database untuk proyek SyncSpace. Gunakan instruksi dan struktur di bawah ini sebagai panduan utama dalam meng-generate kode backend.

## 1. Tech Stack & Infrastructure (Zero-Cost / Vercel Optimized)
* **Framework (Fullstack):** Next.js (App Router) - di-deploy ke Vercel.
* **Database:** PostgreSQL Serverless (Neon.tech).
* **ORM / Query Builder:** Prisma ORM atau Drizzle ORM.
* **Real-time Engine:** Pusher Channels (Karena Vercel serverless, tidak bisa pakai WebSocket native seperti Socket.io).
* **Authentication:** NextAuth.js (Google OAuth 2.0).

---

## 2. Database Schema (PostgreSQL)
Sistem menggunakan relasi SQL dengan pemanfaatan tipe data `JSONB` untuk fleksibilitas.

### Tabel `users`
Menyimpan data autentikasi dan profil, termasuk array hobi untuk sistem rekomendasi.
* `id` (String/UUID, Primary Key)
* `name` (String)
* `email` (String, Unique)
* `image` (String, URL gambar dari Google)
* `domisili` (String, misal: 'Depok', 'Jakarta Selatan')
* `hobbies` (String[], array of text untuk mencocokkan dengan kategori room)

### Tabel `rooms`
Entitas utama aktivitas/ruangan.
* `id` (String/UUID, Primary Key)
* `master_id` (String, FK ke users.id)
* `category_id` (String, FK ke master categories)
* `title` (String, judul kegiatan)
* `description` (Text)
* `lokasi_wilayah` (String, untuk filter area)
* `kuota_maksimal` (Int)
* `is_private` (Boolean, true jika butuh approval untuk join)
* `status` (String, Enum: 'OPEN', 'FULL', 'CLOSED')
* `activity_details` (JSONB, menyimpan detail spesifik. Contoh Gaming: `{"game": "Valorant", "rank": "Gold"}`, Contoh Hangout: `{"venue": "Kopi Nako", "agenda": "Skripsian"}`)
* `created_at` (DateTime)

### Tabel `participants`
Pivot table untuk user yang join ke room dan status request.
* `id` (String/UUID, Primary Key)
* `room_id` (String, FK ke rooms.id)
* `user_id` (String, FK ke users.id)
* `status` (String, Enum: 'PENDING' (menunggu approval), 'JOINED' (sudah masuk), 'REJECTED')
* `joined_at` (DateTime)

---

## 3. Core Logic & Queries

### A. Suggested Rooms (Priority Sorting)
Saat melakukan fetch daftar room untuk user, gunakan logic SQL/ORM ini untuk memprioritaskan room yang kategorinya cocok dengan hobi user:
1. Filter `lokasi_wilayah` yang sama dengan `domisili` user.
2. Cek apakah `category_id` dari room tersebut ada di dalam array `hobbies` milik user.
3. Jika YA (Match), beri nilai/bobot `is_suggested = true`.
4. Urutkan berdasarkan `is_suggested DESC`, lalu `created_at DESC`.

### B. Real-time Lobby Updates (Pusher)
Karena berjalan di Vercel (Serverless):
1. Setiap kali ada endpoint `POST /api/rooms` yang berhasil membuat room baru di DB, server wajib melakukan **trigger event** ke Pusher.
2. Channel: `lobby-[lokasi_wilayah]` (contoh: `lobby-depok`).
3. Event: `new-room`.
4. Payload: Data room baru tersebut. Frontend akan listen ke channel ini untuk update UI tanpa refresh.

### C. Join Request Flow (Private Rooms)
1. Jika `room.is_private == true`, user yang klik join akan masuk ke tabel `participants` dengan status `PENDING`.
2. Trigger Pusher event ke channel khusus Room Master (`user-[master_id]`) untuk notifikasi live.
3. Master Room melakukan `PATCH /api/participants/[id]` untuk mengubah status menjadi `JOINED`.
---

## 4. SQL Schema (PostgreSQL/Neon)
Copy and paste this into your Neon SQL Editor to initialize the database.

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
    image TEXT,
    domisili VARCHAR(100),
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
    lokasi_wilayah VARCHAR(100) NOT NULL,
    kuota_maksimal INT NOT NULL CHECK (kuota_maksimal > 0),
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
CREATE INDEX idx_rooms_lokasi ON rooms(lokasi_wilayah);
CREATE INDEX idx_rooms_category ON rooms(category_id);
```

### Initial Data Seed
```sql
INSERT INTO categories (name) VALUES 
('Gaming'), ('Sports'), ('Study Group'), ('Hangout'), ('Music');
```


### Frontend (MatchIt!)
- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS v4 with custom Glassmorphism utilities (`glass`, `neon-text`).
- **Animations:** Framer Motion 12.
- **Auth & Backend-as-a-Service:** Supabase (Auth, Storage for avatars, Database).
- **State Management:** Mix of local state (`useState`), Supabase real-time, and LocalStorage (for dummy auth/prototyping).
- **Dynamic Routing:** Room-based interaction via `src/app/room/[id]`.

## Building and Running

### Backend
1. **Setup:**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   ```
2. **Database:** Initialize your PostgreSQL instance using `seed.sql`.
3. **Run:**
   - Dev: `npm run dev` (uses nodemon)
   - Prod: `npm start`

### Frontend
1. **Setup:**
   ```bash
   cd frontend
   npm install
   ```
2. **Env:** Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
3. **Run:**
   - Dev: `npm run dev`
   - Build: `npm run build`
   - Start: `npm start`

## Development Conventions

### Styling & UI (Frontend)
- **Tailwind v4:** Uses `@import "tailwindcss"` in `globals.css`.
- **Glassmorphism:** Use the `.glass` class for translucent backgrounds and `.neon-text` for gradient text effects.
- **Icons:** Favor `@phosphor-icons/react` and `lucide-react`.

### API & Logic (Backend)
- **Error Handling:** Centralized middleware in `src/middleware/errorHandler.js`. All responses follow a standard `{ success, message, payload }` format.
- **Validation:** Define validation rules in routes and handle results in controllers.

## Directory Structure Highlights
- `Backend/src/controllers/`: Request handling logic.
- `Backend/src/models/`: Database query logic (Raw SQL).
- `frontend/src/app/`: Next.js App Router pages and layouts.
- `frontend/src/components/`: Reusable UI components (Navbar, RoomCard, etc.).
- `frontend/src/lib/`: Supabase client and other utility libraries.
