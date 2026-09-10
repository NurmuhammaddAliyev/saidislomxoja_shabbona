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
| Static Site | `saidislomxoja-shabbona` | Mehmonlar ochadigan sayt. **Hech qachon uxlamaydi** |
| Web Service | `saidislomxoja-shabbona-api` | Django API. 15 daqiqa harakatsiz tursa uxlaydi (4-bosqichga qarang) |
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

> ⚠️ **Baza nomini hech qachon o'zgartirmang.** Bepul tarifda akkauntda faqat
> bitta bepul PostgreSQL bo'lishi mumkin. `render.yaml` dagi baza nomi o'zgarsa,
> Render eskisini saqlab qolib YANGI baza yaratmoqchi bo'ladi va butun deploy
> shu xato bilan to'xtaydi:
> ```
> cannot have more than one active free tier database
> (canceled: another action failed)
> ```
> Bu holatda bazani **o'chirmang** — `render.yaml` dagi nomni mavjud bazaning
> nomiga qaytarish kifoya, shunda Blueprint uni qayta ishlatadi.
>
> Haqiqatan boshqa loyihadan qolgan ortiqcha baza bo'lsa: uni o'chirishdan
> oldin Blueprint'dan chiqaring, aks holda Render uni qaytadan yaratadi.

1. [render.com](https://render.com) → GitHub bilan kiring
2. **"New +"** → **"Blueprint"** → repo'ni tanlang
3. Render `render.yaml` ni o'qib, uchala narsani o'zi yaratadi → **"Apply"**

Birinchi build 5-10 daqiqa oladi.

## 3. ⚠️ Backend manzilini tekshirish

Xizmat nomlari `onrender.com` da **global noyob** bo'lishi kerak. Nom band
bo'lsa Render tasodifiy qo'shimcha qo'shadi, masalan:
`saidislomxoja-shabbona-api-3a3h.onrender.com`.

Render'da `saidislomxoja-shabbona-api` xizmatini oching va yuqoridagi manzilni
qo'shimchasiz ekaniga ishonch hosil qiling.

**Agar qo'shimcha chiqqan bo'lsa** — ikki yo'ldan biri:

**A) `render.yaml` ni tuzatish** (tavsiya):
```yaml
destination: https://<haqiqiy-manzil>.onrender.com/api/*
```
so'ng `git commit` + `git push` → static site qayta build bo'ladi.

**B) Muhit o'zgaruvchisi orqali** (push qilmasdan):
- `saidislomxoja-shabbona` (static site) → Environment → `VITE_API_BASE` =
  backend manzili (`https://` ni yozmasangiz ham bo'ladi)
- `saidislomxoja-shabbona-api` → Environment → `CORS_ALLOWED_ORIGINS` =
  sayt manzili
- ikkalasini ham qayta deploy qiling

**Tekshirish:** `https://<sayt-manzili>.onrender.com/api/weddings/saidislomxoja_shabbona/`
ochilganda JSON chiqishi kerak. Chiqmasa — manzil noto'g'ri.

## 4. Saytni uyquda qolmasligi uchun (ping)

Bepul backend 15 daqiqa harakatsiz tursa uxlaydi va keyingi mehmon 50+ soniya kutadi.

1. [uptimerobot.com](https://uptimerobot.com) da bepul ro'yxatdan o'ting
2. **"Add New Monitor"** → tur: **HTTP(s)**
3. URL: `https://<backend-manzili>.onrender.com/api/weddings/saidislomxoja_shabbona/`
4. Interval: **10 daqiqa** → saqlang

Bepul limit (750 soat/oy) bitta doim uyg'oq xizmatni qoplaydi.

## 5. Ma'lumotlarni kiritish

> ⚠️ **Bepul tarifda Render'da "Shell" tabi YO'Q** (SSH ham yo'q). Shuning uchun
> `createsuperuser` kabi buyruqlarni u yerda qo'lda yozib bo'lmaydi.
> Buning o'rniga admin foydalanuvchi **build paytida avtomatik yaratiladi**.

### 5.1. Admin foydalanuvchi

Blueprint yaratilayotganda Render sizdan uchta qiymatni so'raydi:

| O'zgaruvchi | Nima yozasiz |
|---|---|
| `DJANGO_SUPERUSER_USERNAME` | masalan `admin` |
| `DJANGO_SUPERUSER_EMAIL` | pochtangiz |
| `DJANGO_SUPERUSER_PASSWORD` | **kuchli parol** — buni eslab qoling |

So'ramasa: `saidislomxoja-shabbona-api` → **Environment** → **"Add Environment Variable"**
orqali uchalasini qo'shing va **"Manual Deploy"** bosing.

Build log'ida `Admin foydalanuvchi yaratildi: admin` yozuvi chiqadi.

### 5.2. To'y ma'lumotini kiritish (brauzerda)

`https://<backend-manzili>.onrender.com/admin/` → yuqoridagi login/parol bilan
kiring → **To'y taklifnomalari** → **"Add"**:

- ⚠️ **`slug` aynan `saidislomxoja_shabbona`** — sayt shu nom bilan so'rov
  yuboradi. Boshqacha yozsangiz sayt bo'sh chiqadi.
  (O'zgartirmoqchi bo'lsangiz `wedding_react/src/lib/api.js:2` ni ham yangilang.)
- Kuyov/kelin ismi, to'y sanasi va vaqti
- **Admin panel paroli** — mehmonlar ro'yxatini ko'rish uchun (oddiy matnda
  yozasiz, tizim o'zi shifrlaydi). Bu 5.1 dagi paroldan boshqa narsa.
- Pastda **Dastur** qatorlarini (18:00 — Mehmonlar yig'ilishi va h.k.) qo'shasiz

Saqlagach sayt darhol shu ma'lumot bilan ishlaydi.

## 6. ⚠️ Baza 30 kundan keyin o'chadi

Render'ning bepul PostgreSQL bazasi yaratilgandan **30 kun** keyin muddati
tugaydi (keyin 14 kun muhlat), **zaxira nusxa yo'q**. To'y 01.10.2026 bo'lgani
uchun muddat yetadi, lekin **mehmonlar ro'yxatini yo'qotmaslik uchun**
to'ydan keyin darhol saqlab oling. Bepul tarifda Shell yo'q, shuning uchun
brauzer orqali:

- `https://<backend>.onrender.com/admin/weddings/guest/` — barcha javoblar
  jadvali. Nusxalab olib, Excel/Word'ga saqlang yoki skrinshot qiling.
- Yoki saytdagi 🔒 tugmasi orqali admin panelni ochib, jadvalni saqlang.

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
