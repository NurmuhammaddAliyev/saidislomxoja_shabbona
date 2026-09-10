"""Birinchi deployda saytni tayyorlash: admin foydalanuvchi + to'y ma'lumoti.

Render'ning bepul tarifida Shell yo'q, shuning uchun `createsuperuser` yoki
`loaddata` ni qo'lda ishga tushirib bo'lmaydi — ular build.sh orqali shu
buyruq bilan bajariladi.
"""
import os
import secrets
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management import BaseCommand, call_command

from weddings.models import Wedding

# True bo'lsa har deployda admin'ga YANGI tasodifiy parol beriladi va deploy
# log'iga yoziladi — parol unutilganda uni tiklash uchun vaqtincha yoqiladi.
# False bo'lsa mavjud admin'ning paroliga tegilmaydi (admin umuman bo'lmasa
# baribir yaratiladi va paroli log'ga yoziladi).
RESET_ADMIN_PASSWORD_ON_DEPLOY = False

WEDDING_SLUG = "saidislomxoja_shabbona"
FIXTURE = Path(__file__).resolve().parents[2] / "fixtures" / "initial_wedding.json"

# Telefonda qo'lda terish oson bo'lishi uchun o'xshash belgilarsiz (0/O, 1/l/I).
_ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def _generate_password(length=14):
    return "".join(secrets.choice(_ALPHABET) for _ in range(length))


class Command(BaseCommand):
    help = "Admin foydalanuvchini tayyorlaydi va bo'sh bazaga to'y ma'lumotini yuklaydi."

    def handle(self, *args, **options):
        # Tartib muhim: fixture'dagi to'y egasi "admin" nomi orqali bog'langan.
        self._ensure_admin()
        self._load_wedding()

    def _ensure_admin(self):
        username = os.environ.get("DJANGO_ADMIN_USERNAME") or "admin"
        env_password = os.environ.get("DJANGO_ADMIN_PASSWORD")

        user, created = get_user_model().objects.get_or_create(username=username)
        user.is_staff = True
        user.is_superuser = True

        if env_password:
            # Muhit o'zgaruvchisidagi parol log'ga yozilmaydi.
            user.set_password(env_password)
            self.stdout.write(f"Admin paroli DJANGO_ADMIN_PASSWORD dan olindi: {username}")
        elif created or RESET_ADMIN_PASSWORD_ON_DEPLOY:
            password = _generate_password()
            user.set_password(password)
            self.stdout.write("=" * 50)
            self.stdout.write(f"ADMIN LOGIN:  {username}")
            self.stdout.write(f"ADMIN PAROLI: {password}")
            self.stdout.write("=" * 50)
        else:
            self.stdout.write(f"Admin mavjud, paroli o'zgartirilmadi: {username}")
        user.save()

    def _load_wedding(self):
        # Faqat to'y yozuvi yo'q bo'lsagina yuklanadi — aks holda admin'da
        # qilingan o'zgarishlar har deployda fayldagi eski qiymatlar bilan
        # almashib ketardi.
        if Wedding.objects.filter(slug=WEDDING_SLUG).exists():
            self.stdout.write("To'y ma'lumoti bazada bor — yuklash o'tkazib yuborildi")
            return
        call_command("loaddata", str(FIXTURE))
        self.stdout.write("To'y ma'lumoti yuklandi")
