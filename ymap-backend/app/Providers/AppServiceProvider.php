<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Здесь можно регистрировать сервисы (обычно оставляем пустым)
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Установка длины строки по умолчанию для старых версий MySQL
        Schema::defaultStringLength(191);
    }
}
