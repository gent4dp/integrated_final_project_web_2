<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =====================
        // USERS
        // =====================
        DB::table('users')->insert([
            [
                'nim'       => '2024000',
                'name'      => 'Budi Santoso',
                'email'     => 'admin@uin-alauddin.ac.id',
                'password'  => 'admin123', // Plain text sesuai AuthController
                'role'      => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nim'       => '70100120001',
                'name'      => 'Andi Setiawan',
                'email'     => 'andi.setiawan@uin-alauddin.ac.id',
                'password'  => 'password123',
                'role'      => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nim'       => '20100122003',
                'name'      => 'Siti Rahma Dewi',
                'email'     => 'siti.rahma@uin-alauddin.ac.id',
                'password'  => 'password123',
                'role'      => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nim'       => '60700121045',
                'name'      => 'Rizky Kurniawan',
                'email'     => 'rizky.kurniawan@uin-alauddin.ac.id',
                'password'  => 'password123',
                'role'      => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nim'       => '10500122078',
                'name'      => 'Nur Ainun Fitria',
                'email'     => 'nur.ainun@uin-alauddin.ac.id',
                'password'  => 'password123',
                'role'      => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $adminId  = DB::table('users')->where('email', 'admin@uin-alauddin.ac.id')->value('id');
        $andiId   = DB::table('users')->where('email', 'andi.setiawan@uin-alauddin.ac.id')->value('id');
        $sitiId   = DB::table('users')->where('email', 'siti.rahma@uin-alauddin.ac.id')->value('id');
        $rizkyId  = DB::table('users')->where('email', 'rizky.kurniawan@uin-alauddin.ac.id')->value('id');
        $nurId    = DB::table('users')->where('email', 'nur.ainun@uin-alauddin.ac.id')->value('id');

        // =====================
        // REPORTS
        // =====================
        DB::table('reports')->insert([
            [
                'user_id'             => $andiId,
                'judul_laporan'       => 'AC Ruang Lab 204 Mati Total',
                'kategori'            => 'ac',
                'prioritas'           => 'darurat',
                'fakultas'            => 'Fakultas Sains & Teknologi',
                'lokasi_fasilitas'    => 'Gedung B, Laboratorium Komputer Lt. 2',
                'deskripsi_kerusakan' => 'Sudah 3 hari AC di Lab Komputer 204 tidak berfungsi sama sekali. Ruangan menjadi sangat panas terutama saat praktikum berlangsung. Suhu mencapai 35°C lebih dan membuat mahasiswa tidak nyaman serta komputer berisiko overheating. Mohon segera diperbaiki karena jadwal praktikum padat setiap hari.',
                'foto_bukti'          => null,
                'status'              => 'diproses',
                'catatan_admin'       => 'Teknisi AC sudah dihubungi dan dijadwalkan perbaikan hari Kamis, 5 Oktober 2023.',
                'created_at'          => Carbon::now()->subDays(3),
                'updated_at'          => Carbon::now()->subDays(1),
            ],
            [
                'user_id'             => $sitiId,
                'judul_laporan'       => 'Proyektor Ruang Kuliah 302 Tidak Menyala',
                'kategori'            => 'proyektor',
                'prioritas'           => 'sedang',
                'fakultas'            => 'Fakultas Tarbiyah & Keguruan',
                'lokasi_fasilitas'    => 'Gedung A, Ruang Kelas 302 Lt. 3',
                'deskripsi_kerusakan' => 'Proyektor di Ruang 302 tidak dapat menyala sejak minggu lalu. Kabel sudah dicoba diganti namun tetap tidak merespons. Ini sangat menghambat proses perkuliahan karena dosen tidak dapat menampilkan materi presentasi. Beberapa mata kuliah sudah terganggu akibat masalah ini.',
                'foto_bukti'          => null,
                'status'              => 'pending',
                'catatan_admin'       => null,
                'created_at'          => Carbon::now()->subDays(7),
                'updated_at'          => Carbon::now()->subDays(7),
            ],
            [
                'user_id'             => $rizkyId,
                'judul_laporan'       => 'Toilet Lantai 2 Perpustakaan Banjir & Tersumbat',
                'kategori'            => 'toilet',
                'prioritas'           => 'darurat',
                'fakultas'            => 'Perpustakaan Pusat Syekh Yusuf',
                'lokasi_fasilitas'    => 'Gedung Perpustakaan Pusat, Toilet Lt. 2',
                'deskripsi_kerusakan' => 'Toilet di lantai 2 perpustakaan pusat sudah dalam kondisi darurat. Kloset tersumbat dan air meluber ke lantai. Kondisi ini sangat tidak higienis dan berpotensi menimbulkan penyakit. Sudah berlangsung 2 hari dan belum ada penanganan. Banyak pengunjung perpustakaan yang mengeluhkan kondisi ini.',
                'foto_bukti'          => null,
                'status'              => 'pending',
                'catatan_admin'       => null,
                'created_at'          => Carbon::now()->subDays(2),
                'updated_at'          => Carbon::now()->subDays(2),
            ],
            [
                'user_id'             => $nurId,
                'judul_laporan'       => 'Sinyal Wi-Fi Masjid Kampus Sangat Lemah',
                'kategori'            => 'wifi',
                'prioritas'           => 'rendah',
                'fakultas'            => 'Masjid Kampus',
                'lokasi_fasilitas'    => 'Masjid Kampus UIN Alauddin, Area Dalam & Selasar',
                'deskripsi_kerusakan' => 'Sinyal Wi-Fi kampus di area masjid sangat lemah bahkan tidak terdeteksi di beberapa titik. Hal ini menyulitkan mahasiswa yang ingin belajar mandiri atau mengakses e-learning di area masjid. Padahal banyak mahasiswa yang memanfaatkan waktu istirahat sholat untuk belajar di sini.',
                'foto_bukti'          => null,
                'status'              => 'selesai',
                'catatan_admin'       => 'Access point baru sudah dipasang di area masjid pada tanggal 20 September 2023. Sinyal sudah kuat hingga area selasar.',
                'created_at'          => Carbon::now()->subDays(30),
                'updated_at'          => Carbon::now()->subDays(5),
            ],
            [
                'user_id'             => $andiId,
                'judul_laporan'       => 'Lampu Koridor Gedung Rektorat Lantai 1 Mati',
                'kategori'            => 'lampu',
                'prioritas'           => 'sedang',
                'fakultas'            => 'Gedung Rektorat',
                'lokasi_fasilitas'    => 'Gedung Rektorat, Koridor Lt. 1 Sisi Timur',
                'deskripsi_kerusakan' => 'Lampu-lampu di koridor timur lantai 1 Gedung Rektorat sudah padam selama lebih dari seminggu. Kondisi gelap cukup berbahaya terutama di malam hari dan sore hari. Beberapa mahasiswa sudah hampir tersandung di area tersebut. Ada sekitar 5 titik lampu yang mati.',
                'foto_bukti'          => null,
                'status'              => 'diproses',
                'catatan_admin'       => 'Tim listrik kampus sedang menginventarisir kebutuhan penggantian lampu. Estimasi selesai 3 hari kerja.',
                'created_at'          => Carbon::now()->subDays(10),
                'updated_at'          => Carbon::now()->subDays(3),
            ],
            [
                'user_id'             => $sitiId,
                'judul_laporan'       => 'Kursi Ruang Seminar Banyak yang Patah',
                'kategori'            => 'lainnya',
                'prioritas'           => 'sedang',
                'fakultas'            => 'Fakultas Dakwah & Komunikasi',
                'lokasi_fasilitas'    => 'Gedung Dakwah, Ruang Seminar Lt. 2',
                'deskripsi_kerusakan' => 'Terdapat sekitar 15 kursi di ruang seminar Fakultas Dakwah yang sudah rusak dan patah. Beberapa kursi goyang berbahaya saat diduduki. Kondisi ini sangat mengganggu kenyamanan acara seminar dan diskusi ilmiah yang sering diadakan di ruangan tersebut.',
                'foto_bukti'          => null,
                'status'              => 'pending',
                'catatan_admin'       => null,
                'created_at'          => Carbon::now()->subDays(5),
                'updated_at'          => Carbon::now()->subDays(5),
            ],
            [
                'user_id'             => $rizkyId,
                'judul_laporan'       => 'Wastafel Kamar Mandi Rusak & Bocor',
                'kategori'            => 'toilet',
                'prioritas'           => 'sedang',
                'fakultas'            => 'Fakultas Syariah & Hukum',
                'lokasi_fasilitas'    => 'Gedung Syariah, Kamar Mandi Lt. 1',
                'deskripsi_kerusakan' => 'Wastafel di kamar mandi lantai 1 Gedung Syariah bocor parah. Air terus mengalir keluar dari bagian bawah wastafel bahkan saat kran sudah ditutup. Lantai selalu basah dan licin sehingga membahayakan. Sudah dilaporkan ke satpam seminggu lalu namun belum ada tindak lanjut.',
                'foto_bukti'          => null,
                'status'              => 'selesai',
                'catatan_admin'       => 'Perbaikan wastafel selesai dilakukan oleh tim plumber pada 28 September 2023.',
                'created_at'          => Carbon::now()->subDays(14),
                'updated_at'          => Carbon::now()->subDays(2),
            ],
        ]);

        // =====================
        // VOTES (Sample upvotes)
        // =====================
        $report1Id = DB::table('reports')->where('judul_laporan', 'AC Ruang Lab 204 Mati Total')->value('id');
        $report2Id = DB::table('reports')->where('judul_laporan', 'Proyektor Ruang Kuliah 302 Tidak Menyala')->value('id');
        $report3Id = DB::table('reports')->where('judul_laporan', 'Toilet Lantai 2 Perpustakaan Banjir & Tersumbat')->value('id');
        $report5Id = DB::table('reports')->where('judul_laporan', 'Lampu Koridor Gedung Rektorat Lantai 1 Mati')->value('id');

        DB::table('report_votes')->insert([
            ['report_id' => $report1Id, 'user_id' => $sitiId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report1Id, 'user_id' => $rizkyId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report1Id, 'user_id' => $nurId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report1Id, 'user_id' => $adminId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report2Id, 'user_id' => $andiId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report2Id, 'user_id' => $rizkyId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report3Id, 'user_id' => $andiId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report3Id, 'user_id' => $sitiId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report3Id, 'user_id' => $adminId, 'created_at' => now(), 'updated_at' => now()],
            ['report_id' => $report5Id, 'user_id' => $sitiId, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // =====================
        // COMMENTS (Sample)
        // =====================
        DB::table('report_comments')->insert([
            [
                'report_id'         => $report1Id,
                'user_id'           => $sitiId,
                'parent_comment_id' => null,
                'komentar'          => 'Saya juga merasakan hal yang sama waktu praktikum Senin kemarin, ruangan sangat pengap dan panas!',
                'created_at'        => Carbon::now()->subDays(2),
                'updated_at'        => Carbon::now()->subDays(2),
            ],
            [
                'report_id'         => $report1Id,
                'user_id'           => $rizkyId,
                'parent_comment_id' => null,
                'komentar'          => 'Sudah lapor ke Kaprodi tapi katanya harus melalui jalur resmi KampusFix ini. Semoga cepat ditangani.',
                'created_at'        => Carbon::now()->subDays(1),
                'updated_at'        => Carbon::now()->subDays(1),
            ],
            [
                'report_id'         => $report2Id,
                'user_id'           => $andiId,
                'parent_comment_id' => null,
                'komentar'          => 'Kemarin dosen kami terpaksa menggunakan papan tulis karena proyektor tidak bisa dipakai. Sangat mengganggu.',
                'created_at'        => Carbon::now()->subDays(5),
                'updated_at'        => Carbon::now()->subDays(5),
            ],
            [
                'report_id'         => $report3Id,
                'user_id'           => $nurId,
                'parent_comment_id' => null,
                'komentar'          => 'Kondisinya sudah sangat parah. Tolong segera diperbaiki sebelum menimbulkan masalah kesehatan yang lebih serius.',
                'created_at'        => Carbon::now()->subDays(1),
                'updated_at'        => Carbon::now()->subDays(1),
            ],
        ]);
    }
}
