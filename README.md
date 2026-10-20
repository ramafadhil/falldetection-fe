# Elderly Fall Detection System

Dashboard pemantauan *real-time* untuk sistem deteksi jatuh lansia, dibangun menggunakan **Next.js**, **React**, dan **Tailwind CSS**.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Icons & UI:** Lucide React / Shadcn UI
* **HTTP Client:** Fetch API / Axios

## Quickstart & Local Setup

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/ramafadhil/falldetection-fe.git
cd falldetection-fe

# Install paket node
npm install
```

### 2. Environment Setup

Buat file `.env.local` di root folder dan sesuaikan URL backend FastAPI kamu:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Cara Menjalankan

Jalankan server pengembangan lokal:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat dashboard pemantauan. Pastikan service backend FastAPI sudah berjalan di `http://localhost:8000`.
