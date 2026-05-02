#!/bin/sh

echo "Waiting for database..."
while ! nc -z db 3306; do
  sleep 1
done

echo "Waiting for Meilisearch..."
while ! nc -z meilisearch 7700; do
  sleep 1
done

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

php artisan scout:sync-index-settings

php artisan route:clear
php artisan scribe:generate

exec "$@"
