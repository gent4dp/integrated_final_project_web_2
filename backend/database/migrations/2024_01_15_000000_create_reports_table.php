<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('judul_laporan');
            $table->string('lokasi_fasilitas');
            $table->text('deskripsi_kerusakan');
            $table->string('foto_bukti')->nullable();
            $table->enum('status', ['pending', 'diproses', 'selesai'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
