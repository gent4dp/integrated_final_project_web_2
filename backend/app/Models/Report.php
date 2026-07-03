<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'judul_laporan',
        'kategori',
        'prioritas',
        'fakultas',
        'lokasi_fasilitas',
        'deskripsi_kerusakan',
        'foto_bukti',
        'status',
        'catatan_admin',
    ];

    protected $hidden = [
        'deleted_at',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->hasMany(ReportVote::class);
    }

    public function comments()
    {
        return $this->hasMany(ReportComment::class);
    }

    public function rootComments()
    {
        return $this->hasMany(ReportComment::class)->whereNull('parent_comment_id');
    }

    public function votesCount()
    {
        return $this->votes()->count();
    }
}
