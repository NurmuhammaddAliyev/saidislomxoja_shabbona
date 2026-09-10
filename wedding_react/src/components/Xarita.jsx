import Reveal from "./Reveal";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function Xarita({ wedding, lang }) {
  const tr = t("xarita", lang);
  const lat = wedding?.location_lat;
  const lng = wedding?.location_lng;
  const mapSrc =
    lat && lng
      ? `https://www.google.com/maps?q=${lat},${lng}&output=embed`
      : "https://www.google.com/maps?q=Toshkent&output=embed";

  return (
    <section className="section xarita" id="xarita">
      <FloralFrame />
      <Reveal className="eyebrow">{tr.eyebrow}</Reveal>
      <Reveal delay={0.1} className="tagline">{tr.tagline}</Reveal>
      <Reveal delay={0.2} className="map-box">
        <iframe title="Xarita" loading="lazy" src={mapSrc}></iframe>
        <div className="map-cta">📍 {tr.mapCta}</div>
      </Reveal>
    </section>
  );
}
