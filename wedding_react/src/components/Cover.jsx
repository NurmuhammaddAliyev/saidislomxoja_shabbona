import { motion } from "framer-motion";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function Cover({ wedding, lang }) {
  const tr = t("cover", lang);
  // Ma'lumot kelmaguncha ism va sana ko'rsatilmaydi — aks holda mehmon
  // bir zum boshqa odamning ismini va noto'g'ri sanani ko'radi.
  const groom = wedding?.groom_name;
  const bride = wedding?.bride_name;
  const date = wedding ? new Date(wedding.event_date) : null;
  const dateStr = date
    ? `${String(date.getDate()).padStart(2, "0")} • ${String(
        date.getMonth() + 1
      ).padStart(2, "0")} • ${date.getFullYear()}`
    : "";

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="section cover"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <FloralFrame />
      <motion.div className="eyebrow" variants={item}>{tr.eyebrow}</motion.div>
      <motion.div className="names" variants={item}>
        {groom && bride && (
          <>
            <span>{groom}</span>
            <span className="amp">&amp;</span>
            <span>{bride}</span>
          </>
        )}
      </motion.div>
      <motion.div className="divider" variants={item}></motion.div>
      <motion.div className="date" variants={item}>{dateStr}</motion.div>
      <motion.div className="quote-ar" variants={item}>وَأَلَّفَ بَيْنَ قُلُوبِهِمْ</motion.div>
      <motion.div className="quote-txt" variants={item}>
        "{wedding?.quote_text || tr.quoteDefault}"
      </motion.div>
      <motion.div className="quote-src" variants={item}>{wedding?.quote_source || "Al-Anfol, 63"}</motion.div>
      <motion.div className="heart" variants={item}>♡</motion.div>
    </motion.section>
  );
}
