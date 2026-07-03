<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'report_id',
        'parent_comment_id',
        'komentar',
    ];

    protected $hidden = [
        'deleted_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function parent()
    {
        return $this->belongsTo(ReportComment::class, 'parent_comment_id');
    }

    public function replies()
    {
        return $this->hasMany(ReportComment::class, 'parent_comment_id');
    }
}
