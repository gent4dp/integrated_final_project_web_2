<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('report_id')->constrained('reports')->onDelete('cascade');
            $table->unsignedBigInteger('parent_comment_id')->nullable();
            $table->text('komentar');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('parent_comment_id')
                  ->references('id')
                  ->on('report_comments')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_comments');
    }
};
