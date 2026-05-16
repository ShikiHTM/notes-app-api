FROM nginx:alpine

COPY ./backend/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./backend/docker/nginx-yjs.conf /etc/nginx/conf.d/yjs.conf