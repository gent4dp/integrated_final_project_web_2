<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReportCommentResource;
use App\Models\Report;
use App\Models\ReportComment;
use Illuminate\Http\Request;

class ReportCommentController extends Controller
{
    public function index(Request $request, $reportId)
    {
        $report = Report::findOrFail($reportId);
        $perPage = $request->input('per_page', 15);

        $rootComments = $report->rootComments()
                              ->withoutTrashed()
                              ->with(['user', 'replies.user', 'replies.replies.user'])
                              ->orderByDesc('created_at')
                              ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Comments retrieved',
            'data' => ReportCommentResource::collection($rootComments),
            'pagination' => [
                'total' => $rootComments->total(),
                'per_page' => $rootComments->perPage(),
                'current_page' => $rootComments->currentPage(),
                'last_page' => $rootComments->lastPage(),
                'from' => $rootComments->firstItem(),
                'to' => $rootComments->lastItem(),
            ],
        ]);
    }

    public function store(Request $request, $reportId)
    {
        $report = Report::findOrFail($reportId);

        $request->validate([
            'komentar' => 'required|string|min:1|max:2000',
            'parent_comment_id' => 'nullable|exists:report_comments,id',
        ]);

        if ($request->parent_comment_id) {
            $parentComment = ReportComment::find($request->parent_comment_id);
            if ($parentComment->report_id !== $report->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Parent comment does not belong to this report',
                ], 422);
            }
        }

        $comment = $report->comments()->create([
            'user_id' => $request->user()->id,
            'parent_comment_id' => $request->parent_comment_id,
            'komentar' => $request->komentar,
        ]);

        if ($request->user()->role === 'admin') {
            $report->update(['catatan_admin' => $request->komentar]);
        }

        $comment->load('user', 'replies.user');

        return response()->json([
            'success' => true,
            'message' => 'Comment created successfully',
            'data' => new ReportCommentResource($comment),
        ], 201);
    }

    public function update(Request $request, $commentId)
    {
        $comment = ReportComment::findOrFail($commentId);

        if ($comment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'komentar' => 'required|string|min:5',
        ]);

        $comment->update(['komentar' => $request->komentar]);
        $comment->load('user', 'replies.user');

        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'data' => new ReportCommentResource($comment),
        ]);
    }

    public function destroy(Request $request, $commentId)
    {
        $comment = ReportComment::findOrFail($commentId);

        if ($comment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
            'data' => [],
        ]);
    }
}
