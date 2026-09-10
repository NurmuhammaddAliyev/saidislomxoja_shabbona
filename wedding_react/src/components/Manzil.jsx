import Reveal from "./Reveal";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function Manzil({ wedding, lang }) {
  const tr = t("manzil", lang);
  const name = wedding?.location_name || '"Baxtiyor" restorani';
  const address = wedding?.location_address || "Toshkent viloyati, Qibray tumani, Olmazor ko'chasi, 72";
  const gmaps = wedding?.google_maps_url || "#";
  const ymaps = wedding?.yandex_maps_url || "#";

  return (
    <section className="section manzil">
      <FloralFrame />
      <Reveal className="addr-card">
        <div className="r-name">{name}</div>
        <div className="addr-row">
          <span className="pin-sm">📍</span>
          <p>{address}</p>
        </div>
        <a className="map-link" href={gmaps} target="_blank" rel="noreferrer">📍 {tr.gmaps}</a>
        <a className="map-link" href={ymaps} target="_blank" rel="noreferrer">🌐 {tr.ymaps}</a>
        <div className="welcome">{tr.welcome}</div>
      </Reveal>
    </section>
  );
}
