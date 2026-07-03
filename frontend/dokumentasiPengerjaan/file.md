# 🛠️ Web Laporan Kerusakan Fasilitas Kampus (Front-End)

Proyek ini adalah sistem informasi berbasis web untuk melaporkan kerusakan fasilitas kampus. Sisi Front-End dibangun menggunakan **React.js (Vite)** dan **Tailwind CSS**.

---

## 👥 Tim Front-End & Pembagian Tugas

Proyek ini dikerjakan secara kolaboratif oleh 2 orang developer Front-End dengan pembagian komponen global dan halaman (*pages*) sebagai berikut:

### Tugas FE 1
#### Components (Global)
- [ ] `AdminDrawer.jsx`: Menu samping (*sidebar*) khusus navigasi halaman admin.
- [ ] `Navbar.jsx`: Navigasi atas untuk mahasiswa/tamu (Logo, Nama Web, Bantuan, Tombol Login).
- [ ] `LayoutMhs.jsx`: Pembungkus struktur halaman mahasiswa (`Navbar` + `Footer` + Konten).

#### 📄 Pages (Halaman Utama)
- [ ] `LandingPage.jsx`: Tampilan awal web sebelum login (Informasi umum & statistik aduan).
- [ ] `Login.jsx`: Form masuk untuk Mahasiswa dan Admin.
- [ ] `BerandaMhs.jsx`: Dashboard utama mahasiswa setelah login (Tombol lapor & ringkasan aduan terbaru).
- [ ] `Bantuan.jsx`: Halaman FAQ / panduan teknis penggunaan sistem.
- [ ] `admin/AdminDashboard.jsx`: Dashboard utama admin (Grafik/statistik kondisi fasilitas & cuplikan laporan masuk).

---

### Tugas FE 2
#### Components (Global)
- [ ] `Footer.jsx`: Bagian bawah web (Hak cipta, kontak aduan, info medsos).
- [ ] `CardLaporan.jsx`: Kartu ringkasan satu laporan dengan badge status dinamis (🟡 Pending, 🔵 Proses, 🟢 Selesai, 🔴 Ditolak).
- [ ] `Button.jsx`: Komponen tombol universal agar desain tombol di semua halaman konsisten.

#### 📄 Pages (Halaman Utama)
- [ ] `BuatLaporan.jsx`: Form input laporan kerusakan (Judul, Kategori, Lokasi, Deskripsi, Upload Foto).
- [ ] `RiwayatProfil.jsx`: Halaman profil singkat mahasiswa beserta daftar seluruh riwayat laporan yang pernah dikirim.
- [ ] `admin/KelolaLaporan.jsx`: Tabel data besar khusus admin untuk mengelola status seluruh laporan secara lengkap.

---

## 📁 Struktur Folder Proyek

```text
final-proyek-web2/
├── public/
│   └── logo-kampus.png
├── src/
│   ├── assets/                # Aset gambar internal (.jpg/.png)
│   ├── components/            # KOMPONEN KECIL (REUSABLE)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── LayoutMhs.jsx
│   │   ├── AdminDrawer.jsx
│   │   ├── CardLaporan.jsx
│   │   └── Button.jsx
│   ├── pages/                 # HALAMAN UTAMA WEB
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── BerandaMhs.jsx
│   │   ├── Bantuan.jsx
│   │   ├── BuatLaporan.jsx
│   │   ├── RiwayatProfil.jsx
│   │   └── admin/             # Sub-folder khusus Admin
│   │       ├── AdminDashboard.jsx
│   │       └── KelolaLaporan.jsx
│   ├── App.css
│   ├── App.jsx                # Peta Jalan / React Router
│   ├── index.css              # Setup Tailwind CSS
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js