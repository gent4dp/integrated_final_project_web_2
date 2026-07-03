<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'komentar' => $this->komentar,
            'user' => [
                'id' => $this->user->id,
                'nim' => $this->user->nim,
                'name' => $this->user->name,
            ],
            'nested_comments' => ReportCommentResource::collection($this->whenLoaded('replies')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
