<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson()) {
            if ($exception instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $exception->errors(),
                ], 422);
            }

            if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                    'data' => [],
                ], 401);
            }

            if ($exception instanceof \Illuminate\Auth\Access\AuthorizationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                    'data' => [],
                ], 403);
            }

            if ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not found',
                    'data' => [],
                ], 404);
            }

            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'data' => [],
            ], 500);
        }

        return parent::render($request, $exception);
    }
}

