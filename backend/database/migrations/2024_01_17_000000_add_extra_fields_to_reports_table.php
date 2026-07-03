<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->string('kategori')->nullable()->after('judul_laporan');
            $table->enum('prioritas', ['rendah', 'sedang', 'darurat'])->default('sedang')->after('kategori');
            $table->string('fakultas')->nullable()->after('prioritas');
            $table->text('catatan_admin')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['kategori', 'prioritas', 'fakultas', 'catatan_admin']);
        });
    }
};
