#!/usr/bin/env bash
# Render "Build Command" sifatida shu faylni ishlatadi.
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Admin foydalanuvchi va to'y ma'lumoti.
# Bepul tarifda Shell yo'q, shuning uchun ular shu yerda, build paytida
# tayyorlanadi (weddings/management/commands/bootstrap_site.py).
# Admin paroli shu deployning log'ida "ADMIN PAROLI:" qatorida chiqadi.
python manage.py bootstrap_site
