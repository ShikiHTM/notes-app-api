#!/bin/sh
set -e

escape() {
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

API_URL_ESC=$(escape "${API_URL:-}")
YJS_URL_ESC=$(escape "${YJS_URL:-}")

cat > /usr/share/nginx/html/config.js <<EOF
window.__CONFIG__ = {
  API_URL: "${API_URL_ESC}",
  YJS_URL: "${YJS_URL_ESC}"
};
EOF
