<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ReportCommentResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $userHasVoted = false;
        if ($request->user()) {
            $userHasVoted = $this->votes()
                                  ->where('user_id', $request->user()->id)
                                  ->exists();
        }

        $userName = $this->user->name ?? 'Unknown';
        $userNim  = $this->user->nim ?? '-';

        return [
            'id'                  => $this->id,
            'judul_laporan'       => $this->judul_laporan,
            'kategori'            => $this->kategori,
            'prioritas'           => $this->prioritas,
            'fakultas'            => $this->fakultas,
            'lokasi_fasilitas'    => $this->lokasi_fasilitas,
            'deskripsi_kerusakan' => $this->deskripsi_kerusakan,
            'foto_bukti'          => $this->foto_bukti 
                ? (is_array(json_decode($this->foto_bukti, true)) 
                    ? array_map(fn($path) => asset('storage/' . $path), json_decode($this->foto_bukti, true)) 
                    : [asset('storage/' . $this->foto_bukti)])
                : [],
            'status'              => $this->status,
            'catatan_admin'       => $this->catatan_admin,
            'user'                => [
                'id'    => $this->user->id ?? null,
                'nim'   => $userNim,
                'name'  => $userName,
                'email' => $this->user->email ?? null,
            ],
            'votes_count'    => $this->votes()->count(),
            'user_vote'      => $userHasVoted,
            'comments_count' => $this->comments()->count(),
            'comments'       => ReportCommentResource::collection($this->whenLoaded('comments')),
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
