// Til tugmalari — mijoz talabiga ko'ra faqat 3 til: O'zbek, Rus, Qozoq
const LANGS = [
  { code: "UZ", label: "UZ" },
  { code: "RU", label: "RU" },
  { code: "KZ", label: "ҚАЗ" },
];

/**
 * Musiqa endi shu komponentda emas — App.jsx da boshqariladi, chunki
 * konvert muhriga bosilganda ham xuddi shu audio ishga tushishi kerak
 * (ikkalasi bitta <audio> elementini ulashadi).
 */
export default function TopBar({ lang, onLangChange, playing, onTogglePlay }) {
  return (
    <div className="topbar">
      <div className="langs">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={"lang-btn" + (lang === l.code ? " active" : "")}
            onClick={() => onLangChange(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Yuqori o'ng burchakdagi musiqa tugmasi — faqat to'xtatish/davom ettirish uchun */}
      <div className="play-btn" onClick={onTogglePlay} title="Fon musiqasi">
        {playing ? "❚❚" : "▶"}
      </div>
    </div>
  );
}
