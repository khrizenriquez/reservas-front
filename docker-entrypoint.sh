#!/bin/sh
set -eu

api_base_url="${NEXT_PUBLIC_API_BASE_URL:-https://umg-api-django.onrender.com}"
mkdir -p public
printf 'window.__RESERVAS_RUNTIME_CONFIG__ = Object.freeze({ apiBaseUrl: %s });\n' "$(printf '%s' "$api_base_url" | node -p 'JSON.stringify(require("fs").readFileSync(0, "utf8"))')" > public/runtime-config.js

exec node server.js
