// Nisbiy manzil: lokalda Vite dev-proxy, Render'da esa static site'ning
// "/api/* -> backend" rewrite qoidasi so'rovni backendga uzatadi.
// Shu sabab frontend va backend bir xil domenda ko'rinadi va CORS kerak emas.
// Zaxira variant: VITE_API_BASE muhit o'zgaruvchisiga to'liq manzil berish.
function resolveApiBase() {
  const raw = import.meta.env.VITE_API_BASE;
  if (!raw) return "/api"; // odatiy holat: bir domen (Render rewrite)
  // Zaxira holat: to'liq manzil berilgan. Foydalanuvchi "https://" yoki "/api"
  // qismini yozishni unutsa ham ishlashi uchun to'ldirib qo'yamiz.
  let base = raw.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(base)) base = "https://" + base;
  if (!base.endsWith("/api")) base += "/api";
  return base;
}

const API_BASE = resolveApiBase();
export const WEDDING_SLUG = "saidislomxoja_shabbona"; // o'z loyihangdagi slug bilan almashtir

export async function fetchWedding() {
  const res = await fetch(`${API_BASE}/weddings/${WEDDING_SLUG}/`);
  if (!res.ok) throw new Error("Wedding ma'lumoti topilmadi");
  return res.json();
}

export async function submitRsvp(payload) {
  const res = await fetch(`${API_BASE}/weddings/${WEDDING_SLUG}/rsvp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "RSVP yuborishda xatolik yuz berdi");
  }
  return res.json();
}

export async function fetchWishes() {
  const res = await fetch(`${API_BASE}/weddings/${WEDDING_SLUG}/wishes/`);
  if (!res.ok) throw new Error("Tilaklarni yuklab bo'lmadi");
  return res.json(); // [{ name, wish }, ...]
}

export async function dashboardLogin(password) {
  const res = await fetch(`${API_BASE}/weddings/${WEDDING_SLUG}/dashboard/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Parol noto'g'ri");
  return res.json(); // { token }
}

export async function fetchDashboardStats(token) {
  const res = await fetch(`${API_BASE}/weddings/${WEDDING_SLUG}/dashboard/stats/`, {
    headers: { "X-Dashboard-Token": token },
  });
  if (!res.ok) throw new Error("Statistikani yuklab bo'lmadi");
  return res.json();
}

export async function fetchDashboardGuests(token) {
  const res = await fetch(`${API_BASE}/weddings/${WEDDING_SLUG}/dashboard/guests/`, {
    headers: { "X-Dashboard-Token": token },
  });
  if (!res.ok) throw new Error("Mehmonlar ro'yxatini yuklab bo'lmadi");
  return res.json();
}
