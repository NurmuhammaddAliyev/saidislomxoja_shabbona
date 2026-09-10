import { useEffect, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import EnvelopeIntro from "./components/EnvelopeIntro";
import Cover from "./components/Cover";
import Biz from "./components/Biz";
import Sana from "./components/Sana";
import Dastur from "./components/Dastur";
import VenuePhotos from "./components/VenuePhotos";
import Xarita from "./components/Xarita";
import Manzil from "./components/Manzil";
import Rsvp from "./components/Rsvp";
import WishesWall from "./components/WishesWall";
import Thanks from "./components/Thanks";
import LoginModal from "./components/LoginModal";
import Dashboard from "./components/Dashboard";
import { fetchWedding } from "./lib/api";
import { useAutoScroll } from "./lib/useAutoScroll";

// ---- QO'SHIQ SHU YERDA SOZLANADI ----
// Qaysi qo'shiqni tanlasang ham, faylni har doim shu nom bilan saqla:
//   wedding_react/public/music/song.mp3
// (nomi o'zgarmaydi — faqat fayl mazmuni almashadi, kodga tegish shart emas)
const AUDIO_SRC = "/music/song.mp3";

export default function App() {
  const [wedding, setWedding] = useState(null);
  const [lang, setLang] = useState("UZ"); // UZ / RU / KZ — TopBar shu yerdan boshqaradi
  const [loginOpen, setLoginOpen] = useState(false);
  const [dashboardToken, setDashboardToken] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const [wishesRefresh, setWishesRefresh] = useState(0);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    fetchWedding()
      .then(setWedding)
      .catch((e) => console.warn("Backendga ulanib bo'lmadi, statik matn ko'rsatiladi.", e));
  }, []);

  // Sayt konvert ochilgach avtomatik pastga qarab asta-sekin aylanadi.
  // Mehmon o'zi barmog'i bilan sursa — vaqtincha to'xtaydi, keyin davom etadi.
  // Admin dashboard ochiq bo'lganda ishlamaydi.
  useAutoScroll(introDone && !dashboardToken);

  // Konvert muhriga bosilgan zahoti chaqiriladi — bu haqiqiy foydalanuvchi
  // harakati bo'lgani uchun brauzer musiqani avtomatik ijro etishga ruxsat beradi.
  function handleEnvelopeOpenTap() {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        console.warn("Musiqani avtomatik ishga tushirib bo'lmadi — public/music/ papkasini tekshiring.");
      });
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying((p) => !p);
  }

  function handleRsvpSubmitted() {
    setWishesRefresh((n) => n + 1);
    document.querySelector(".wishes-wall")?.scrollIntoView({ behavior: "smooth" });
  }

  if (dashboardToken) {
    return <Dashboard token={dashboardToken} onClose={() => setDashboardToken(null)} />;
  }

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />

      {!introDone && (
        <EnvelopeIntro
          groomName={wedding?.groom_name}
          brideName={wedding?.bride_name}
          onOpenTap={handleEnvelopeOpenTap}
          onDone={() => setIntroDone(true)}
        />
      )}

      <div className="phone">
        <TopBar lang={lang} onLangChange={setLang} playing={playing} onTogglePlay={toggleMusic} />
        <Cover wedding={wedding} lang={lang} />
        <Biz wedding={wedding} lang={lang} />
        <Sana wedding={wedding} lang={lang} />
        <Dastur wedding={wedding} lang={lang} />
        <VenuePhotos wedding={wedding} lang={lang} />
        <Xarita wedding={wedding} lang={lang} />
        <Manzil wedding={wedding} lang={lang} />
        <Rsvp lang={lang} onSubmitted={handleRsvpSubmitted} />
        <WishesWall lang={lang} refreshKey={wishesRefresh} />
        <Thanks lang={lang} />

        <div className="admin-fab" title="To'y egasi uchun" onClick={() => setLoginOpen(true)}>🔒</div>
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={(token) => {
            setLoginOpen(false);
            setDashboardToken(token);
          }}
        />
      </div>
    </>
  );
}
