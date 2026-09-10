import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------------------------------------------------------------------
   Taklifnoma kartasining grafikasi.
   Koordinata maydoni: kartaning o'zi 220 x 300, chapga/o'ngga chiqib ketadigan
   iplar uchun umumiy viewBox "-22 0 352 300".
--------------------------------------------------------------------------- */

// Har safar bir xil natija beradigan "tasodifiy" son — barglarga tabiiy
// tartibsizlik berish uchun (Math.random ishlatilsa har renderda sakraydi).
function rnd(i) {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// Bitta barg — ikki tomonlama egri (linza) shakl: biriktirish nuqtasidan uchiga.
function leafD(x, y, len, wid, ang) {
  const ux = Math.cos(ang);
  const uy = Math.sin(ang);
  const px = -uy;
  const py = ux;
  const tx = x + ux * len;
  const ty = y + uy * len;
  const ax = x + ux * len * 0.42 + px * wid;
  const ay = y + uy * len * 0.42 + py * wid;
  const bx = x + ux * len * 0.42 - px * wid;
  const by = y + uy * len * 0.42 - py * wid;
  return `M${x.toFixed(1)},${y.toFixed(1)} Q${ax.toFixed(1)},${ay.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${bx.toFixed(1)},${by.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}Z`;
}

// Bargli shoxcha: egri poya + poya bo'ylab ikki tomonga joylashgan barglar.
function Branch({
  base,
  tip,
  bow = 0,
  spacing = 4.6,
  leafLen = 9.5,
  leafAngle = 42,
  startAt = 0.14,
  taper = 0.42,
  seed = 0,
  main = "#b8ab5c",
  shade = "#9d904a",
  stem = "#a2954a",
  stemW = 1,
}) {
  const [bx, by] = base;
  const [tx, ty] = tip;
  const dx = tx - bx;
  const dy = ty - by;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (bx + tx) / 2 + (-dy / len) * bow;
  const cy = (by + ty) / 2 + (dx / len) * bow;

  const nodes = Math.max(4, Math.round(len / spacing));
  const leaves = [];
  for (let i = 0; i <= nodes; i++) {
    const t = i / nodes;
    if (t < startAt) continue;
    const it = 1 - t;
    const x = it * it * bx + 2 * it * t * cx + t * t * tx;
    const y = it * it * by + 2 * it * t * cy + t * t * ty;
    const tanA = Math.atan2(
      2 * it * (cy - by) + 2 * t * (ty - cy),
      2 * it * (cx - bx) + 2 * t * (tx - cx)
    );
    const scale = (1 - taper * t) * (0.84 + 0.32 * rnd(seed + i));
    for (const side of [1, -1]) {
      const jitter = (rnd(seed + i * 3 + (side > 0 ? 7 : 19)) - 0.5) * 18;
      const a = tanA + (side * leafAngle + jitter) * (Math.PI / 180);
      const L = leafLen * scale;
      leaves.push(
        <path key={`${i}-${side}`} d={leafD(x, y, L, L * 0.42, a)} fill={i % 3 === 0 ? shade : main} />
      );
    }
  }
  const tipA = Math.atan2(ty - cy, tx - cx);

  return (
    <g>
      <path
        d={`M${bx},${by} Q${cx.toFixed(1)},${cy.toFixed(1)} ${tx},${ty}`}
        fill="none"
        stroke={stem}
        strokeWidth={stemW}
        strokeLinecap="round"
      />
      {leaves}
      <path d={leafD(tx, ty, leafLen * 0.66, leafLen * 0.28, tipA)} fill={main} />
    </g>
  );
}

// Muhr ortidan yuqoriga ko'tariladigan bargli shoxchalar buketi.
const BOUQUET = [
  { base: [55, 172], tip: [20, 104], bow: -7, leafLen: 8.8, spacing: 4.4, seed: 3 },
  { base: [55, 171], tip: [31, 84], bow: -4, leafLen: 9.4, spacing: 4.6, seed: 11 },
  { base: [55, 170], tip: [44, 70], bow: -2, leafLen: 9.8, spacing: 4.7, seed: 23 },
  { base: [56, 170], tip: [58, 64], bow: 0, leafLen: 10.2, spacing: 4.8, seed: 31, main: "#c6b96a" },
  { base: [56, 170], tip: [72, 72], bow: 2, leafLen: 9.6, spacing: 4.6, seed: 41 },
  { base: [57, 171], tip: [80, 88], bow: 5, leafLen: 9.0, spacing: 4.4, seed: 53 },
  { base: [57, 172], tip: [86, 112], bow: 7, leafLen: 8.4, spacing: 4.2, seed: 67 },
  // ichki qisqa novdalar — buketni zichlashtiradi
  { base: [50, 152], tip: [36, 122], bow: -3, leafLen: 7.6, spacing: 4.0, seed: 71, main: "#ada04f" },
  { base: [62, 150], tip: [78, 126], bow: 3, leafLen: 7.6, spacing: 4.0, seed: 83, main: "#ada04f" },
  { base: [54, 136], tip: [46, 106], bow: -2, leafLen: 7.4, spacing: 3.9, seed: 97 },
  { base: [60, 134], tip: [70, 108], bow: 2, leafLen: 7.4, spacing: 3.9, seed: 101 },
];

// Oltin iplar — muhr ortidan chapga va o'ngga o'tadi (kartani bog'lab turgandek).
const CORDS = [
  "M55,184 Q150,163 330,146",
  "M55,184 Q160,176 330,164",
  "M55,184 Q150,190 330,180",
  "M55,184 Q22,180 -22,177",
  "M55,184 Q20,184 -22,183",
  "M55,184 Q22,189 -22,190",
];

// Muhr ichidagi bo'rtma naqsh — o'sha buketning kichraytirilgan varianti.
const SEAL_SPRIGS = [
  { base: [50, 76], tip: [28, 42], bow: -4, leafLen: 7.2, spacing: 3.6, seed: 5, stemW: 0.9 },
  { base: [50, 76], tip: [41, 26], bow: -2, leafLen: 7.6, spacing: 3.7, seed: 17, stemW: 0.9 },
  { base: [50, 76], tip: [59, 25], bow: 2, leafLen: 7.6, spacing: 3.7, seed: 29, stemW: 0.9 },
  { base: [50, 76], tip: [72, 44], bow: 4, leafLen: 7.2, spacing: 3.6, seed: 37, stemW: 0.9 },
  { base: [50, 74], tip: [33, 58], bow: -2, leafLen: 6.2, spacing: 3.3, seed: 43, stemW: 0.8 },
  { base: [50, 74], tip: [68, 59], bow: 2, leafLen: 6.2, spacing: 3.3, seed: 59, stemW: 0.8 },
];

// Mumning notekis chekkasi — doira radiusini bir necha to'lqin bilan buzish.
function blobPath(cx, cy, r, amp = 0.02, phase = 0) {
  const pts = [];
  const N = 72;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k =
      1 +
      amp * Math.sin(3 * a + 1 + phase) +
      amp * 0.6 * Math.sin(5 * a + 2.2 + phase) +
      amp * 0.4 * Math.sin(8 * a + 0.7 + phase);
    pts.push(`${(cx + Math.cos(a) * r * k).toFixed(2)},${(cy + Math.sin(a) * r * k).toFixed(2)}`);
  }
  return "M" + pts.join("L") + "Z";
}

const SEAL_R = 46;

function SealRelief({ main, shade, stem }) {
  return (
    <>
      {SEAL_SPRIGS.map((s, i) => (
        <Branch key={i} {...s} main={main} shade={shade} stem={stem} />
      ))}
    </>
  );
}

/**
 * Sayt ochilganda birinchi ko'rinadigan ekran: to'q ko'k qog'oz karta, uning
 * ustida oltin folga bargli buket, buketni bog'lab turgan uchta ingichka oltin
 * ip va ular ustidagi bronza mum muhr (ichida bo'rtma barg naqshi bilan).
 * Muhrga bosilganda karta yumshoq tarqalib, asosiy sayt ko'rinadi.
 */
export default function EnvelopeIntro({ groomName, brideName, onDone, onOpenTap }) {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(true);

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    onOpenTap?.(); // haqiqiy foydalanuvchi bosishi — musiqa shu yerda ishga tushadi
    setTimeout(() => setVisible(false), 1500);
    setTimeout(() => onDone?.(), 1900);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="envelope-intro" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <motion.div
            className="envelope-names"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {groomName && brideName ? (
              <>
                {groomName} <span className="amp">&amp;</span> {brideName}
              </>
            ) : null}
          </motion.div>

          <motion.div
            className="envelope-card-v2"
            animate={
              opened
                ? { opacity: 0, scale: 1.06, y: -20 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 1.0, ease: [0.16, 0.8, 0.3, 1] }}
          >
            <svg className="card-art" viewBox="-22 0 352 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cordGold" x1="0%" y1="0%" x2="100%" y2="30%">
                  <stop offset="0%" stopColor="#e7bd67" />
                  <stop offset="45%" stopColor="#c9922f" />
                  <stop offset="100%" stopColor="#9a6d22" />
                </linearGradient>
              </defs>

              {/* kartaning buklanish chizig'i */}
              <line x1="92.4" y1="0" x2="92.4" y2="300" stroke="rgba(0,0,0,0.45)" strokeWidth="1.1" />
              <line x1="93.6" y1="0" x2="93.6" y2="300" stroke="rgba(255,255,255,0.05)" strokeWidth="0.9" />

              {/* oltin bargli buket */}
              {BOUQUET.map((b, i) => (
                <Branch key={i} {...b} />
              ))}

              {/* iplar: soya → oltin → eshilgan ip yolqini */}
              <g fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth="2.4" strokeLinecap="round" transform="translate(0,1.4)">
                {CORDS.map((d, i) => <path key={i} d={d} />)}
              </g>
              <g fill="none" stroke="url(#cordGold)" strokeWidth="1.7" strokeLinecap="round">
                {CORDS.map((d, i) => <path key={i} d={d} />)}
              </g>
              <g fill="none" stroke="#f2d692" strokeWidth="0.7" strokeDasharray="0.9 2.3" opacity="0.75">
                {CORDS.map((d, i) => <path key={i} d={d} />)}
              </g>

              {/* muhr ostidan chiqib turgan kesilgan poya uchlari */}
              <g stroke="#a2954a" strokeWidth="2.1" strokeLinecap="round" fill="none">
                <path d="M48,194 Q45,206 43,215" />
                <path d="M55,196 Q55,208 54,218" />
                <path d="M62,194 Q65,205 67,213" />
              </g>
            </svg>

            {/* Bronza mum muhr */}
            <motion.div
              className="card-seal"
              onClick={handleOpen}
              animate={opened ? { scale: 0, opacity: 0, rotate: 25 } : { scale: 1, opacity: 1, rotate: 0 }}
              whileHover={!opened ? { scale: 1.06 } : {}}
              whileTap={!opened ? { scale: 0.92 } : {}}
              transition={{ duration: 0.5 }}
            >
              <svg viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="waxRim" cx="34%" cy="26%" r="82%">
                    <stop offset="0%" stopColor="#d9ae66" />
                    <stop offset="42%" stopColor="#c0904a" />
                    <stop offset="100%" stopColor="#8f632a" />
                  </radialGradient>
                  <linearGradient id="waxWell" x1="0" y1="0" x2="0.15" y2="1">
                    <stop offset="0%" stopColor="#9c6f2f" />
                    <stop offset="55%" stopColor="#b58540" />
                    <stop offset="100%" stopColor="#c99a55" />
                  </linearGradient>
                </defs>

                {/* mum tomchisi: tashqi bo'rtiq → botiq ichki maydon */}
                <path d={blobPath(50, 50, SEAL_R)} fill="url(#waxRim)" />
                <path d={blobPath(50, 50, SEAL_R * 0.995)} fill="none" stroke="rgba(255,232,180,0.30)" strokeWidth="1.1" />
                <path d={blobPath(50, 50.6, SEAL_R * 0.79, 0.022, 1.3)} fill="url(#waxWell)" />
                <path d={blobPath(50, 50.2, SEAL_R * 0.79, 0.022, 1.3)} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.3" />

                {/* bo'rtma naqsh: pastda soya nusxasi, ustida yorug' nusxasi */}
                <g transform="translate(0,0.9)" opacity="0.55">
                  <SealRelief main="#6f4c1c" shade="#63431a" stem="#63431a" />
                </g>
                <SealRelief main="#cfa460" shade="#c1954f" stem="#bb8f4b" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.div
            className="envelope-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: opened ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Ochish uchun muhrga bosing
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
