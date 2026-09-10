import Reveal from "./Reveal";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function Manzil({ wedding, lang }) {
  const tr = t("manzil", lang);
  // Shablondan qolgan soxta nom/manzil ko'rsatilmaydi — ma'lumot yo'q bo'lsa
  // qator umuman chiqmaydi (mehmon boshqa manzilga borib qolmasin).
  const name = wedding?.location_name;
  const address = wedding?.location_address;
  const gmaps = wedding?.google_maps_url;
  const ymaps = wedding?.yandex_maps_url;

  return (
    <section className="section manzil">
      <FloralFrame />
      <Reveal className="addr-card">
        {name && <div className="r-name">{name}</div>}
        {address && (
          <div className="addr-row">
            <span className="pin-sm">📍</span>
            <p>{address}</p>
          </div>
        )}
        {gmaps && <a className="map-link" href={gmaps} target="_blank" rel="noreferrer">📍 {tr.gmaps}</a>}
        {ymaps && <a className="map-link" href={ymaps} target="_blank" rel="noreferrer">🌐 {tr.ymaps}</a>}
        <div className="welcome">{tr.welcome}</div>
      </Reveal>
    </section>
  );
}
