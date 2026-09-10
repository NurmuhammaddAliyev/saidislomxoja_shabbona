/**
 * Har bir bo'lim atrofiga gul-naqshli burchak ramkasi qo'shadi
 * (chungdoi.com uslubidagi Baroque/Boho Floral shablonlariga o'xshab).
 * Bitta SVG motiv <symbol> orqali belgilanadi, 4 burchakka oyna (mirror)
 * transformatsiyalar bilan joylashtiriladi — shuning uchun yengil va tez ishlaydi.
 */
export default function FloralFrame() {
  return (
    <div className="floral-frame" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <symbol id="floral-motif" viewBox="0 0 100 100">
          <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6 C 26 8, 40 18, 46 38 C 49 48, 55 55, 66 58" />
            <path d="M12 10 C 18 24, 28 32, 44 35" />
            <path d="M8 20 C 16 22, 20 30, 18 40" />
            <circle cx="16" cy="12" r="3.4" />
            <circle cx="25" cy="19" r="4.6" />
            <circle cx="36" cy="28" r="3.6" />
            <circle cx="10" cy="24" r="2.6" />
            <path d="M20 15 q5 -7 11 -2.5" />
            <path d="M30 24 q6 -6 12 -1.5" />
            <path d="M7 15 q7 1 6 11" />
            <path d="M14 30 q7 1 8 11" />
            <path d="M22 40 q8 0 10 9" />
          </g>
        </symbol>
      </svg>
      <svg className="floral-corner tl"><use href="#floral-motif" /></svg>
      <svg className="floral-corner tr"><use href="#floral-motif" /></svg>
      <svg className="floral-corner bl"><use href="#floral-motif" /></svg>
      <svg className="floral-corner br"><use href="#floral-motif" /></svg>
    </div>
  );
}
