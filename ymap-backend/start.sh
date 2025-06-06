#!/bin/bash

# Убедимся, что Laravel готов
composer install --no-interaction --prefer-dist --optimize-autoloader

# Кэш и ключ
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Миграции (если нужно)
php artisan migrate --force

# Запуск Laravel-сервера
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
