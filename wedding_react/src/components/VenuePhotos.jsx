import Reveal from "./Reveal";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function VenuePhotos({ wedding, lang }) {
  const tr = t("venue", lang);
  const photos = wedding?.location_photos || [];
  const name = wedding?.location_name || '"Baxtiyor" restorani';

  function scrollToMap() {
    document.getElementById("xarita")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="section venue-photos">
      <FloralFrame />
      <Reveal className="eyebrow">{tr.eyebrow}</Reveal>

      <Reveal delay={0.1} className="frame">
        {photos.length ? (
          photos.slice(0, 2).map((p, i) => (
            <div className="ph" key={i}>
              <img src={p.image} alt={name} />
            </div>
          ))
        ) : (
          <>
            <div className="ph">
              <img src="/images/venue-1.jpg" alt={tr.photoOutside} />
            </div>
            <div className="ph">
              <img src="/images/venue-2.jpg" alt={tr.photoInside} />
            </div>
          </>
        )}
      </Reveal>

      <Reveal delay={0.2} className="venue-name" as="div">{name}</Reveal>

      <Reveal
        delay={0.3}
        className="pin"
        onClick={scrollToMap}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        📍
      </Reveal>
    </section>
  );
}
