import Reveal from "./Reveal";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function Thanks({ lang }) {
  const tr = t("thanks", lang);
  return (
    <section className="section thanks">
      <FloralFrame />
      <Reveal className="l1">{tr.l1}</Reveal>
      <Reveal delay={0.15} className="l2" as="div">{tr.l2}</Reveal>
      <Reveal delay={0.3} className="l3">{tr.l3}</Reveal>
      <Reveal delay={0.45} className="heart">♡</Reveal>
    </section>
  );
}
