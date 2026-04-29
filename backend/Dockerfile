FROM php:8.4-fpm-alpine as builder

RUN apk add --no-cache \
    git curl zip unzip libpng-dev libzip-dev oniguruma-dev libxml2-dev icu-dev

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

RUN apk add --no-cache $PHPIZE_DEPS && pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN composer install --no-interaction --optimize-autoloader --no-dev

FROM php:8.4-fpm-alpine

RUN apk add --no-cache libpng libzip libintl icu-libs

COPY --from=builder /usr/local/lib/php/extensions /usr/local/lib/php/extensions
COPY --from=builder /usr/local/etc/php/conf.d /usr/local/etc/php/conf.d
COPY --from=builder /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
