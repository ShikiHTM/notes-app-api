#!/bin/sh

echo "Waiting for database..."

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

php artisan route:clear

php artisan scribe:generate

exec "$@"
