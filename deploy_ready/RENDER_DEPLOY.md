# Render'ga (bepul tarif) joylashtirish — to'liq qo'llanma

Loyiha tuzilishi:
```
taklifnoma/
├── render.yaml            ← Blueprint: ikkala xizmat + baza shu yerda tavsiflangan
├── deploy_ready/config/   ← Django backend (manage.py, requirements.txt, build.sh)
└── wedding_react/         ← React (Vite) sayt
```

Nima yaratiladi (hammasi **bepul**):
| Xizmat | Nomi | Vazifasi |
|---|---|---|
| Static Site | `taklifnoma` | Mehmonlar ochadigan sayt. **Hech qachon uxlamaydi** |
| Web Service | `taklifnoma-api` | Django API. 15 daqiqa harakatsiz tursa uxlaydi (4-bosqichga qarang) |
| PostgreSQL | `taklifnoma-db` | Baza. ⚠️ **30 kundan keyin o'chadi** (6-bosqichga qarang) |

Sayt `/api/...` so'rovlarini o'z domenidan yuboradi, Render esa ularni backendga
uzatadi — shuning uchun CORS sozlash umuman kerak emas.

---

## 1. GitHub'ga yuklash

Loyiha ildizida (`taklifnoma/` papkasida):
```bash
git init
git add .
git commit -m "Taklifnoma sayti"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```
`.gitignore` tayyor — `.venv`, `node_modules`, `db.sqlite3` GitHub'ga ketmaydi.

## 2. Blueprint orqali yaratish

1. [render.com](https://render.com) → GitHub bilan kiring
2. **"New +"** → **"Blueprint"** → repo'ni tanlang
3. Render `render.yaml` ni o'qib, uchala narsani o'zi yaratadi → **"Apply"**

Birinchi build 5-10 daqiqa oladi.

## 3. ⚠️ Backend manzilini tekshirish (eng ko'p xato shu yerda)

`taklifnoma-api` nomi band bo'lsa Render manzilga qo'shimcha qo'shadi
(masalan `taklifnoma-api-x7k2.onrender.com`). Bunday bo'lsa:

1. Render'da `taklifnoma-api` xizmatini ochib, haqiqiy manzilini nusxalang
2. `render.yaml` dagi qatorni shunga moslang:
   ```yaml
   destination: https://<haqiqiy-manzil>.onrender.com/api/*
   ```
3. `git commit` + `git push` → static site qayta build bo'ladi

**Tekshirish:** `https://<sayt>.onrender.com/api/weddings/saidislomxoja_shabbona/`
ochilganda JSON chiqishi kerak. Chiqmasa — rewrite manzili noto'g'ri.

## 4. Saytni uyquda qolmasligi uchun (ping)

Bepul backend 15 daqiqa harakatsiz tursa uxlaydi va keyingi mehmon 50+ soniya kutadi.

1. [uptimerobot.com](https://uptimerobot.com) da bepul ro'yxatdan o'ting
2. **"Add New Monitor"** → tur: **HTTP(s)**
3. URL: `https://<backend-manzili>.onrender.com/api/weddings/saidislomxoja_shabbona/`
4. Interval: **10 daqiqa** → saqlang

Bepul limit (750 soat/oy) bitta doim uyg'oq xizmatni qoplaydi.

## 5. Ma'lumotlarni kiritish

Render'da `taklifnoma-api` → **"Shell"** tabida:
```bash
python manage.py createsuperuser
```
Keyin `https://<backend>.onrender.com/admin/` ga kirib **To'y taklifnomasi** qo'shing.

⚠️ **`slug` aynan `saidislomxoja_shabbona` bo'lishi shart** — sayt shu nom bilan
so'rov yuboradi. Boshqacha yozsangiz sayt bo'sh chiqadi.
(Slug'ni o'zgartirmoqchi bo'lsangiz `wedding_react/src/lib/api.js:2` ni ham yangilang.)

Admin panel parolini oddiy matnda yozasiz — tizim uni o'zi shifrlaydi.

**Yoki lokal bazadagini ko'chirish** (parol va mavjud javoblar ham saqlanadi):
```bash
# Lokalda:
python manage.py dumpdata weddings --indent 2 -o wedding_data.json
# push qilgach, Render Shell'da:
python manage.py loaddata wedding_data.json
```

## 6. ⚠️ Baza 30 kundan keyin o'chadi

Render'ning bepul PostgreSQL bazasi yaratilgandan **30 kun** keyin muddati
tugaydi (keyin 14 kun muhlat), **zaxira nusxa yo'q**. To'y 01.10.2026 bo'lgani
uchun muddat yetadi, lekin **mehmonlar ro'yxatini yo'qotmaslik uchun**
to'ydan keyin darhol saqlab oling — Render Shell'da:
```bash
python manage.py dumpdata weddings.Guest --indent 2
```
Chiqqan matnni nusxalab, kompyuteringizga faylga saqlang.

Uzoq muddat kerak bo'lsa: muddati tugamaydigan bepul Postgres (Neon, Supabase)
olib, uning `DATABASE_URL` ini Render'ning "Environment" bo'limiga qo'ying —
kodda hech narsa o'zgartirilmaydi.

---

## Eslatmalar

- **Rasmlar:** sayt rasmlari `wedding_react/public/images/` da — ular sayt bilan
  birga ketadi, xavfsiz. Admin orqali *yuklangan* rasmlar esa bepul tarifda
  har deployda o'chadi — shuning uchun rasmlarni `public/images/` da saqlagan
  ma'qul.
- **Musiqa:** `wedding_react/public/music/song.mp3` — faylni almashtirsangiz
  ham nomi `song.mp3` bo'lib qolishi kerak.
- Har `git push` da Render avtomatik qayta deploy qiladi.
- Lokalda ishlash o'zgarmagan: `python manage.py runserver` + `npm run dev`.
  `/api` so'rovlarini Vite o'zi Django'ga uzatadi (`vite.config.js`).
