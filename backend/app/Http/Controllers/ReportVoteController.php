<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportVoteController extends Controller
{
    public function toggleVote(Request $request, $reportId)
    {
        $report = Report::findOrFail($reportId);
        $userId = $request->user()->id;

        $existingVote = $report->votes()
                              ->where('user_id', $userId)
                              ->first();

        if ($existingVote) {
            $existingVote->delete();
            $voted = false;
        } else {
            $report->votes()->create(['user_id' => $userId]);
            $voted = true;
        }

        $votesCount = $report->votes()->count();

        return response()->json([
            'success' => true,
            'message' => 'Vote toggled successfully',
            'data' => [
                'voted' => $voted,
                'votes_count' => $votesCount,
            ],
        ]);
    }
}
