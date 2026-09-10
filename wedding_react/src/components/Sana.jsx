import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import { useCountdown } from "../lib/useCountdown";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

const DOWS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function CountUnit({ value, label }) {
  return (
    <div className="cell">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          className="num"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {String(value).padStart(2, "0")}
        </motion.div>
      </AnimatePresence>
      <div className="unit">{label}</div>
    </div>
  );
}

function Calendar({ dateObj }) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  DOWS.forEach((d) => cells.push({ type: "dow", label: d }));
  for (let i = 0; i < startOffset; i++) cells.push({ type: "blank" });
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ type: "day", day, isToday: day === dateObj.getDate() });
  }

  const monthName = dateObj.toLocaleDateString("uz-UZ", { month: "long" }).toUpperCase();

  return (
    <div className="calendar">
      <h3>{monthName} {year}</h3>
      <div className="cal-grid">
        {cells.map((c, i) => {
          if (c.type === "dow") return <div key={i} className="dow">{c.label}</div>;
          if (c.type === "blank") return <div key={i}></div>;
          return (
            <div key={i} className={"day" + (c.isToday ? " today" : "")}>
              {c.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Sana({ wedding, lang }) {
  const tr = t("sana", lang);
  // Ma'lumot kelmaguncha sana ko'rsatilmaydi (new Date(null) 1970-yilni beradi).
  const eventDate = wedding?.event_date || null;
  const dateObj = eventDate ? new Date(eventDate) : null;
  const { d, h, m, s } = useCountdown(eventDate);

  const dateStr = dateObj
    ? `${String(dateObj.getDate()).padStart(2, "0")} ${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")} ${dateObj.getFullYear()}`
    : "";
  const timeStr = dateObj
    ? dateObj.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <section className="section light sana" id="sana">
      <FloralFrame />
      <Reveal className="eyebrow">{tr.eyebrow}</Reveal>
      <Reveal delay={0.1} className="big-date">{dateStr}</Reveal>
      <Reveal delay={0.15} className="heart" as="div">♡</Reveal>
      <Reveal delay={0.2} className="countdown-label">{tr.countdownLabel}</Reveal>

      <Reveal delay={0.25} className="countdown">
        <CountUnit value={d} label={tr.d} />
        <CountUnit value={h} label={tr.h} />
        <CountUnit value={m} label={tr.m} />
        <CountUnit value={s} label={tr.s} />
      </Reveal>

      {dateObj && (
        <>
          <Reveal delay={0.35}>
            <Calendar dateObj={dateObj} />
          </Reveal>

          <Reveal delay={0.4} className="cal-note">{tr.startsAt} {timeStr}{tr.at}</Reveal>
        </>
      )}
    </section>
  );
}
