<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Регистрация пользователя
    public function register(Request $request)
    {
        $fields = $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'username' => $fields['username'],
            'password' => bcrypt($fields['password']),
            'name' => 'Anonymous',
        ]);

        return response()->json([
            'message' => 'Пользователь зарегистрирован'
        ], 201);
    }

    // Авторизация пользователя и выдача токена
    public function login(Request $request)
{
    $fields = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    $user = User::where('username', $fields['username'])->first();

    if (!$user || !Hash::check($fields['password'], $user->password)) {
        throw ValidationException::withMessages([
            'username' => ['Неверное имя пользователя или пароль.'],
        ]);
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'id' => $user->id,
        'username' => $user->username,
    ], 200);
}


    // Выход (удаление токена)
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Вы вышли из системы'
        ]);
    }
}
