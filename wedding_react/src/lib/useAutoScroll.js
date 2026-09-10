import { useEffect } from "react";

/**
 * Sahifani asta-sekin, o'zi pastga qarab aylantirib turadi (avto-scroll).
 * Mehmon barmog'i bilan sursa — to'xtaydi va resumeDelay dan keyin o'sha
 * joydan davom etadi. Formaga yozayotganda umuman qimirlamaydi.
 *
 * Oldingi versiya nega ishlamasdi: har kadrda window.scrollBy(0, 0.35)
 * chaqirilardi. html'dagi `scroll-behavior: smooth` har bir chaqiruvni
 * silliq animatsiyaga aylantirib oldingisini bekor qilar, 1 pikseldan kichik
 * qadam esa yaxlitlanib yo'qolardi — sahifa umuman siljimasdi.
 *
 * @param enabled      avto-scroll yoqilgan-yoqilmaganligi
 * @param speed        tezlik, piksel/soniya (kadr tezligiga bog'liq emas)
 * @param startDelay   yoqilgandan keyin boshlashdan oldin kutish (ms)
 * @param resumeDelay  mehmon tegishni to'xtatgach qayta boshlashgacha (ms)
 */
export function useAutoScroll(enabled, { speed = 30, startDelay = 2500, resumeDelay = 4500 } = {}) {
  useEffect(() => {
    if (!enabled) return;
    // Harakatni kamaytirishni so'ragan foydalanuvchilarga (tizim sozlamasi) tegmaymiz.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Avto-scroll paytida CSS'dagi silliq skrollni o'chiramiz, aks holda har bir
    // kichik qadam animatsiyaga aylanib yo'qoladi. Aniq `behavior: "smooth"`
    // bilan chaqirilgan skrollar (masalan tilaklar devoriga o'tish) baribir silliq.
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let frameId;
    let last = null;
    let pos = window.scrollY; // kasr qismini yo'qotmaslik uchun o'zimiz saqlaymiz
    let lastSet = pos;
    let pausedUntil = performance.now() + startDelay;

    function isTyping() {
      const el = document.activeElement;
      return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
    }

    function step(now) {
      const dt = last === null ? 0 : Math.min(now - last, 100); // fon tabdan qaytganda sakramasin
      last = now;

      // Sahifani boshqa narsa surgan bo'lsa (barmoq inersiyasi, skroll paneli,
      // "tilaklarga o'tish" kabi) — unga qarshilik qilmay, o'sha joydan davom etamiz.
      if (Math.abs(window.scrollY - lastSet) > 2) {
        pausedUntil = Math.max(pausedUntil, now + resumeDelay);
      }

      const maxScroll = root.scrollHeight - window.innerHeight;
      if (now < pausedUntil || isTyping()) {
        pos = window.scrollY;
      } else if (pos < maxScroll - 1) {
        pos = Math.min(pos + (speed * dt) / 1000, maxScroll);
        window.scrollTo(0, pos);
      }
      lastSet = window.scrollY;
      frameId = requestAnimationFrame(step);
    }
    frameId = requestAnimationFrame(step);

    function pause() {
      pausedUntil = performance.now() + resumeDelay;
    }

    const passive = { passive: true };
    window.addEventListener("wheel", pause, passive);
    window.addEventListener("touchstart", pause, passive);
    window.addEventListener("touchmove", pause, passive);
    window.addEventListener("keydown", pause);

    return () => {
      cancelAnimationFrame(frameId);
      root.style.scrollBehavior = prevBehavior;
      window.removeEventListener("wheel", pause, passive);
      window.removeEventListener("touchstart", pause, passive);
      window.removeEventListener("touchmove", pause, passive);
      window.removeEventListener("keydown", pause);
    };
  }, [enabled, speed, startDelay, resumeDelay]);
}
