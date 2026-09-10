import Reveal from "./Reveal";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function Biz({ wedding, lang }) {
  const tr = t("biz", lang);
  return (
    <section className="section biz" id="biz">
      <FloralFrame />
      <Reveal className="greet">{wedding?.intro_greeting || tr.greet}</Reveal>
      <Reveal delay={0.1}>
        <h2>Biz</h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p>{wedding?.intro_text || tr.text}</p>
      </Reveal>
      <Reveal delay={0.3} className="heart">♡</Reveal>
    </section>
  );
}
