#!/usr/bin/env bash
# Render "Build Command" sifatida shu faylni ishlatadi.
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Admin foydalanuvchini yaratish.
# Render'ning BEPUL tarifida Shell/SSH yo'q, shuning uchun createsuperuser'ni
# qo'lda ishga tushirib bo'lmaydi — u shu yerda, muhit o'zgaruvchilari asosida
# yaratiladi. Ikkinchi deployda "allaqachon mavjud" xatosi build'ni to'xtatmasligi
# uchun natija e'tiborsiz qoldiriladi.
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput 2>/dev/null \
    && echo "Admin foydalanuvchi yaratildi: $DJANGO_SUPERUSER_USERNAME" \
    || echo "Admin foydalanuvchi allaqachon mavjud — o'tkazib yuborildi"
fi
