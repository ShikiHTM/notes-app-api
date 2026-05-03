FROM nginx:alpine

COPY ./backend/docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www
COPY ./backend/public ./public