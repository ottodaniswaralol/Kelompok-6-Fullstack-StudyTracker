# 📚 StudyTracker

Aplikasi web manajemen tugas akademis untuk mahasiswa Universitas Bakrie.  
Dibuat sebagai proyek mata kuliah **IT Project Management**.

---

## 👥 Tim Kelompok 6

| Nama | Role |
|------|------|
| Satrio Keanu Wicaksono | Project Manager |
| Yurfa Apridelia | System Analyst |
| Muhammad Adrian Maulana | UI/UX |
| Otto Daniswara | Developer |
| Muhammad Rio Darmawan | Quality Analyst |

---

## 🚀 Fitur

- **Login & Register** — Autentikasi dengan JWT, password di-hash dengan bcrypt
- **Lupa Password** — Reset password dengan verifikasi email dari database
- **Dashboard** — Ringkasan tugas aktif, deadline terdekat, progress belajar
- **Rekomendasi AI** — Saran prioritas tugas menggunakan Claude AI (Anthropic)
- **Daftar Tugas** — CRUD tugas, filter Semua / Belum Selesai / Selesai, checklist
- **Kalender** — Visualisasi deadline tugas per bulan, navigasi bulan
- **Focus Mode** — Timer Pomodoro (25m), Short Break (5m), Long Break (15m) dengan pilihan tugas
- **Rencana Harian** — Checklist aktivitas harian, tambah & hapus aktivitas
- **Statistik** — Total tugas selesai, total jam belajar, rata-rata fokus, grafik 7 hari
- **Notifikasi** — Alert tugas dengan deadline dalam 24 jam

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML5, Tailwind CSS, Vanilla JS |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Auth | JWT + bcrypt |
| AI | Anthropic Claude API |
| Hosting Frontend | Netlify |
| Hosting Backend | Railway |
| Database Tool | DBeaver |

---

## 📁 Struktur Folder

```
studytracker/
├── client/                    # Frontend
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   ├── api.js         # API helper & auth guard
│   │   │   └── main.js
│   │   └── images/
│   │       └── logo.png
│   ├── index.html             # Dashboard
│   ├── login.html
│   ├── register.html
│   ├── add-task.html
│   ├── task.html
│   ├── calendar.html
│   ├── focus.html
│   └── stats.html
│
├── server/                    # Backend API
│   ├── routes/
│   │   ├── auth.js            # Login, register, reset password
│   │   ├── tasks.js           # CRUD tugas
│   │   ├── dailyplan.js       # Rencana harian
│   │   ├── focus.js           # Sesi fokus & statistik
│   │   └── ai.js              # Rekomendasi AI
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── db.js                  # MySQL connection pool
│   ├── index.js               # Entry point Express
│   ├── .env.example
│   └── package.json
│
├── database/
│   └── studytracker.sql       # Schema + seed data
│
└── README.md
```

---

## ⚙️ Setup & Instalasi

### 1. Clone Repository

```bash
git clone <repo-url>
cd studytracker
```

### 2. Setup Database (Railway / phpMyAdmin)

1. Buat database MySQL baru bernama `studytracker`
2. Import file `database/studytracker.sql`
3. Koneksikan via DBeaver untuk management

### 3. Setup Backend (Server)

```bash
cd server
npm install
cp .env.example .env
```

Edit file `.env`:
```
DB_HOST=your_railway_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=studytracker
JWT_SECRET=ganti_dengan_string_random_panjang
PORT=5000
CLIENT_URL=https://your-netlify-app.netlify.app
ANTHROPIC_API_KEY=sk-ant-...  # Optional, untuk fitur AI
```

Jalankan server:
```bash
npm start
```

### 4. Setup Frontend (Client)

Edit `client/assets/js/api.js`, ganti `BASE_URL`:
```javascript
const BASE_URL = 'https://your-railway-server.up.railway.app';
```

Deploy ke Netlify:
- Upload folder `client/` ke Netlify
- Atau gunakan Netlify CLI: `netlify deploy --prod --dir=client`

---

## 🚀 Deploy ke Railway (Backend)

1. Push folder `server/` ke GitHub
2. Buat project baru di [railway.app](https://railway.app)
3. Connect GitHub repo
4. Tambah **MySQL** plugin di Railway
5. Set Environment Variables dari `.env.example`
6. Railway otomatis deploy saat push

## 🌐 Deploy ke Netlify (Frontend)

1. Buka [netlify.com](https://netlify.com)
2. Drag & drop folder `client/`
3. Atau: `New site from Git` → pilih repo
4. Set Build command: (kosong)
5. Set Publish directory: `client`

---

## 🔐 Akun Default

Password semua akun: `123456789`

| Email | Nama |
|-------|------|
| Satrio@student.bakrie.ac.id | Satrio |
| Otto@student.bakrie.ac.id | Otto |
| Adrian@student.bakrie.ac.id | Adrian |
| Yurfa@student.bakrie.ac.id | Yurfa |
| Rio@student.bakrie.ac.id | Rio |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/check-email` | Validasi email (lupa password) |
| POST | `/api/auth/reset-password` | Reset password |

### Tasks (Butuh Token)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/tasks` | Ambil semua tugas |
| GET | `/api/tasks?status=pending` | Filter tugas belum selesai |
| GET | `/api/tasks/dashboard` | Data ringkasan dashboard |
| POST | `/api/tasks` | Buat tugas baru |
| PATCH | `/api/tasks/:id/status` | Update status tugas |
| DELETE | `/api/tasks/:id` | Hapus tugas |

### Daily Plans (Butuh Token)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/daily-plans` | Ambil rencana hari ini |
| POST | `/api/daily-plans` | Tambah aktivitas |
| PATCH | `/api/daily-plans/:id` | Toggle is_done |
| DELETE | `/api/daily-plans/:id` | Hapus aktivitas |

### Focus & Statistik (Butuh Token)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/focus` | Simpan sesi fokus |
| GET | `/api/focus/stats` | Ambil statistik |

### AI (Butuh Token)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/ai/rekomendasi` | Minta rekomendasi AI |

---

## 📝 Catatan Pengembangan

- **ANTHROPIC_API_KEY** bersifat opsional. Jika tidak diisi, fitur AI akan menampilkan pesan fallback.
- Password disimpan menggunakan **bcrypt** dengan 10 rounds.
- Token JWT berlaku selama **7 hari**.
- Semua endpoint selain auth membutuhkan header `Authorization: Bearer <token>`.
