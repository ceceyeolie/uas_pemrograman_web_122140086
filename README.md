# Portal Berita 

## Deskripsi Aplikasi Web

Portal Berita adalah sebuah platform web untuk mempublikasikan, mengelola, dan membaca artikel berita secara online. Aplikasi ini menyediakan fitur CRUD untuk entitas Artikel dan Kategori, serta autentikasi dasar untuk proteksi endpoint backend. Frontend dibangun menggunakan React.js dan backend dengan Pyramid + PostgreSQL juga dengan antarmuka responsif.

## Dependensi Paket

### Backend (Python Pyramid + PostgreSQL)

* Python 3.8+
* Pyramid
* SQLAlchemy
* psycopg2-binary
* pytest
* coverage


### Frontend (React.js)

* Node.js 14+
* react
* react-dom
* react-router-dom
* axios
* Redux Toolkit (atau Context API)
* Tailwind

## Fitur Aplikasi

1. **Manajemen Artikel (CRUD)**

   * Create: Menambah artikel baru dengan judul, konten, penulis, kategori, dan status (draft/published).
   * Read: Melihat daftar artikel dan detail artikel.
   * Update: Mengubah konten atau status artikel.
   * Delete: Menghapus artikel.

2. **Manajemen Kategori (CRUD)**

   * Create: Menambah kategori baru (nama dan deskripsi).
   * Read: Melihat daftar kategori.
   * Update: Mengubah nama atau deskripsi kategori.
   * Delete: Menghapus kategori.

3. **Autentikasi Dasar**

   * Proteksi endpoint CRUD backend menggunakan Basic Auth.

4. **Frontend Responsif**

   * Dibangun dengan React.js, functional components, dan hooks.
   * Routing menggunakan React Router DOM.
   * State management via Redux Toolkit atau Context API.
   * Styling responsif dengan Tailwind css

5. **Integrasi API**

   * Komunikasi frontend-backend menggunakan Axios atau Fetch API.
   
6. **Login Admin & Autentikasi**
   * Halaman login untuk admin dengan form input username dan password.
   * Proses login akan mengirim kredensial ke backend dan mendapatkan token autentikasi (jika menggunakan JWT) atau header Basic Auth.
   * Hanya admin yang berhasil login yang dapat mengakses halaman manajemen artikel dan kategori (CRUD).
   * Implementasi proteksi rute di frontend menggunakan mekanisme Protected Route.

## Cara Menjalankan Portal Berita

### 1. Clone Repository

```bash
git clone https://github.com/ceceyeolie/uas_pemrograman_web_122140086.git
cd uas_pemrograman_web_122140086/backend
```

---

### 2. Setup Lingkungan Virtual Python

Buat dan aktifkan environment virtual:

```bash
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows
venv\Scripts\activate
```

---

### 3. Instalasi Dependensi Backend

```bash
pip install -e .
```

---

### 4. Konfigurasi & Inisialisasi Database

> Pastikan PostgreSQL telah terinstal.

Ubah `development.ini` sesuai konfigurasi database Anda:

```ini
sqlalchemy.url = postgresql://username:password@localhost:5432/nama_database
```

Inisialisasi database:

```bash
alembic -c development.ini revision --autogenerate -m "initial"
alembic -c development.ini upgrade head
initialize_backend_db development.ini
```

---

### 5. Jalankan Backend

```bash
pserve development.ini --reload
```

Aplikasi backend akan berjalan di: [http://localhost:6543](http://localhost:6543)

---

## 💻 Menjalankan Frontend (React)

### 1. Masuk ke Folder Frontend

```bash
cd ../frontend
```

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Frontend akan berjalan di: [http://localhost:5173](http://localhost:5173)

---

## 📁 Struktur Proyek

```
uas_pemrograman_web_122140086/
│
├── backend/                   # Aplikasi backend dengan Python
│   ├── models/                # SQLAlchemy Models
│   ├── schemas/               # Schema (jika digunakan Marshmallow)
│   ├── views/                 # Endpoint API
│   ├── services/              # Logika aplikasi
│   └── scripts/               # Script inisialisasi database
│
├── development.ini            # File konfigurasi backend
│
├── frontend/                  # Aplikasi frontend React
│   ├── src/
│   │   ├── pages/             # Komponen halaman
│   │   ├── components/        # Komponen UI reusable
│   │   ├── hooks/             # Custom hooks
│   │   └── lib/utils.js       # Fungsi utilitas
│   └── public/                # Aset statis
```

---

## 🧪 Testing Backend

Jalankan pengujian backend dari direktori `backend/`:

```bash
pytest
```

---

---

