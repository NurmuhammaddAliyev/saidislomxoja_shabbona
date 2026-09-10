import Reveal from "./Reveal";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

const ICONS = { drink: "🍸", rings: "💍", food: "🍽", fireworks: "🎆" };

const DEFAULT_PROGRAM = [
  { time: "18:00", title: "MEHMONLAR YIG'ILISHI", icon: "drink" },
  { time: "19:00", title: "MAROSIM", icon: "rings" },
  { time: "20:00", title: "BAYRAM DASTURXONI", icon: "food" },
  { time: "23:00", title: "YAKUNI", icon: "fireworks", is_final: true },
];

export default function Dastur({ wedding, lang }) {
  const tr = t("dastur", lang);
  const items = wedding?.program?.length ? wedding.program : DEFAULT_PROGRAM;

  return (
    <section className="section light dastur">
      <FloralFrame />
      <Reveal className="eyebrow" as="div" style={{ alignSelf: "center", width: "100%", textAlign: "center" }}>
        {tr.eyebrow}
      </Reveal>

      <div className="timeline">
        {items.map((item, idx) => (
          <Reveal key={idx} delay={idx * 0.08} className={"t-item" + (item.is_final ? " final" : "")}>
            <div className="icon">{ICONS[item.icon] || "✦"}</div>
            <div className="line"></div>
            <div className="dot"></div>
            <div>
              <div className="time">{item.time?.slice(0, 5)}</div>
              <div className="title">{item.title}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="heart" style={{ alignSelf: "center", width: "100%" }}>♡</div>
    </section>
  );
}
