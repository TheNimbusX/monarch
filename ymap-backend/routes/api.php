<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MapPointController;

// Регистрация и логин
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Публичный доступ — просмотр точек
Route::get('/points', [MapPointController::class, 'index']);

// Защищённые маршруты — только для авторизованных пользователей
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/points', [MapPointController::class, 'store']);
    Route::put('/points/{id}', [MapPointController::class, 'update']);
    Route::delete('/points/{id}', [MapPointController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 👇 Новый маршрут для получения данных текущего пользователя
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
