<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportVoteController;
use App\Http\Controllers\ReportCommentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    // Stats endpoint (public for all authenticated)
    Route::get('/reports/stats', [ReportController::class, 'stats']);

    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'index']);
        Route::get('/{id}', [ReportController::class, 'show']);
        Route::post('/', [ReportController::class, 'store']);
        Route::put('/{id}', [ReportController::class, 'update']);

        Route::prefix('{reportId}')->group(function () {
            Route::post('/votes', [ReportVoteController::class, 'toggleVote']);
            Route::get('/comments', [ReportCommentController::class, 'index']);
            Route::post('/comments', [ReportCommentController::class, 'store'])->middleware('throttle:comments');
        });

        Route::middleware('checkRole:admin')->group(function () {
            Route::put('/{id}/status', [ReportController::class, 'updateStatus']);
            Route::delete('/{id}', [ReportController::class, 'destroy']);
        });
    });

    Route::prefix('comments')->group(function () {
        Route::put('/{commentId}', [ReportCommentController::class, 'update']);
        Route::delete('/{commentId}', [ReportCommentController::class, 'destroy']);
    });
});
