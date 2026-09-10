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

# Admin parolini tiklash.
# Render'ning bepul tarifida Shell yo'q, shuning uchun parol unutilsa uni
# tiklashning yagona yo'li shu. Render panelida DJANGO_ADMIN_RESET_PASSWORD
# o'zgaruvchisini qo'shasiz, deploy tugagach uni O'CHIRIB TASHLANG — aks holda
# parol har deployda o'sha qiymatga qaytaveradi.
if [ -n "$DJANGO_ADMIN_RESET_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py shell -c "
import os
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.filter(username=os.environ['DJANGO_SUPERUSER_USERNAME']).first()
if user:
    user.set_password(os.environ['DJANGO_ADMIN_RESET_PASSWORD'])
    user.save()
    print('Admin paroli yangilandi:', user.username)
else:
    print('Bunday foydalanuvchi topilmadi — parol tiklanmadi')
"
fi
