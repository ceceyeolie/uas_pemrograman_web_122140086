# Portal Berita 

## Deskripsi Aplikasi Web

Portal Berita Digital adalah sebuah platform web untuk mempublikasikan, mengelola, dan membaca artikel berita secara online. Aplikasi ini menyediakan fitur CRUD untuk entitas Artikel dan Kategori, serta autentikasi dasar untuk proteksi endpoint backend. Frontend dibangun menggunakan React.js dengan antarmuka responsif.

## Dependensi Paket

### Backend (Python Pyramid + PostgreSQL)

* Python 3.8+
* Pyramid
* SQLAlchemy
* psycopg2-binary
* pytest
* coverage

> Install dengan:
>
> ```bash
> pip install -r backend/requirements.txt
> ```

### Frontend (React.js)

* Node.js 14+
* react
* react-dom
* react-router-dom
* axios
* Redux Toolkit (atau Context API)
* Bootstrap

> Install dengan:
>
> ```bash
> cd frontend
> npm install
> ```

## Fitur Aplikasi

1. **Manajemen Artikel (CRUD)**

   * Create: Menambah artikel baru dengan judul, konten, penulis, kategori, tanggal publikasi, dan status (draft/published).
   * Read: Melihat daftar artikel dan detail artikel.
   * Update: Mengubah konten atau status artikel.
   * Delete: Menghapus artikel.

2. **Manajemen Kategori (CRUD)**

   * Create: Menambah kategori baru (nama dan deskripsi).
   * Read: Melihat daftar kategori.
   * Update: Mengubah nama atau deskripsi kategori.
   * Delete: Menghapus kategori (dengan validasi penggunaan).

3. **Autentikasi Dasar**

   * Proteksi endpoint CRUD backend menggunakan Basic Auth.

4. **Frontend Responsif**

   * Dibangun dengan React.js, functional components, dan hooks.
   * Routing menggunakan React Router DOM.
   * State management via Redux Toolkit atau Context API.
   * Styling responsif dengan Bootstrap

5. **Integrasi API**

   * Komunikasi frontend-backend menggunakan Axios atau Fetch API.

---

