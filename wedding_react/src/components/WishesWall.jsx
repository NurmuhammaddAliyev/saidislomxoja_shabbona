import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import FloralFrame from "./FloralFrame";
import { fetchWishes } from "../lib/api";
import { t } from "../lib/i18n";

export default function WishesWall({ lang, refreshKey }) {
  const tr = t("wishes", lang);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchWishes()
      .then((data) => active && setWishes(data))
      .catch(() => active && setWishes([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [refreshKey]);

  return (
    <section className="section dark wishes-wall">
      <FloralFrame />
      <Reveal className="eyebrow">{tr.eyebrow}</Reveal>
      <Reveal delay={0.1} className="wishes-title">{tr.title}</Reveal>
      <Reveal delay={0.15} className="heart" as="div">♡</Reveal>

      <div className="wishes-list">
        {!loading && wishes.length === 0 && (
          <div className="wishes-empty">{tr.empty}</div>
        )}
        {wishes.map((w, i) => (
          <motion.div
            key={i}
            className="wish-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: Math.min(i * 0.06, 0.5) }}
          >
            <div className="wish-text">"{w.wish}"</div>
            <div className="wish-name">— {w.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
