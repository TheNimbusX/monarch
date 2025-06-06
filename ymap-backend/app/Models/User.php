<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Разрешённые для массового заполнения поля.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'password',
        'name',
    ];

    /**
     * Скрытые поля в JSON-ответах (например, пароль).
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Кастинг полей.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Связь с точками на карте (MapPoints).
     */
    public function mapPoints()
    {
        return $this->hasMany(MapPoint::class);
    }
}
