#!/usr/bin/env bash
# Render "Build Command" sifatida shu faylni ishlatadi.
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Admin foydalanuvchi: yaratish yoki parolini yangilash.
#
# Render'ning BEPUL tarifida Shell/SSH yo'q, shuning uchun `createsuperuser` ni
# qo'lda ishga tushirib bo'lmaydi — hammasi shu yerda bajariladi.
#
# DJANGO_ADMIN_PASSWORD berilsa:
#   - bunday foydalanuvchi bo'lmasa  -> yaratiladi
#   - bo'lsa                         -> paroli yangilanadi
# Foydalanuvchi nomi DJANGO_ADMIN_USERNAME dan olinadi (berilmasa: admin).
#
# Kirib olgach, bu o'zgaruvchini Render'dan O'CHIRIB TASHLANG — aks holda
# parol har deployda o'sha qiymatga qaytaveradi.
if [ -n "$DJANGO_ADMIN_PASSWORD" ]; then
  python manage.py shell -c "
import os
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get('DJANGO_ADMIN_USERNAME') or 'admin'
email = os.environ.get('DJANGO_ADMIN_EMAIL') or ''
password = os.environ['DJANGO_ADMIN_PASSWORD']

user, created = User.objects.get_or_create(
    username=username,
    defaults={'email': email, 'is_staff': True, 'is_superuser': True},
)
user.is_staff = True
user.is_superuser = True
user.set_password(password)
user.save()
print('Admin YARATILDI:' if created else 'Admin paroli YANGILANDI:', username)
"
fi

# Eski nomlar bilan ham ishlashi uchun (oldingi sozlamalardan qolgan bo'lsa).
if [ -z "$DJANGO_ADMIN_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput 2>/dev/null     && echo "Admin foydalanuvchi yaratildi: $DJANGO_SUPERUSER_USERNAME"     || echo "Admin foydalanuvchi allaqachon mavjud — o'tkazib yuborildi"
fi
