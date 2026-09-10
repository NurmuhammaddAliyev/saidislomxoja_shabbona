import { useEffect, useRef } from "react";

/**
 * Sahifani asta-sekin, o'zi pastga qarab aylantirib turadi (avto-scroll).
 * Mehmon barmog'i bilan sursa (touch/wheel) — avto-scroll darhol to'xtaydi,
 * bir muncha vaqt (resumeDelay) hech narsaga tegmasa — yana o'zi davom etadi.
 *
 * @param enabled  avto-scroll yoqilgan-yoqilmaganini boshqaradi (masalan
 *                 konvert ochilmaguncha ishlamasin desak shu yerdan o'chiramiz)
 * @param speed    har kadrda necha piksel siljishi (kichikroq = sekinroq)
 * @param resumeDelay  foydalanuvchi tegishni to'xtatgach necha ms dan keyin
 *                     avto-scroll qayta boshlanishi
 */
export function useAutoScroll(enabled, { speed = 0.35, resumeDelay = 4500 } = {}) {
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    let frameId;
    let cancelled = false;

    function step() {
      if (!pausedRef.current) {
        // Sahifa oxiriga yetgan bo'lsa avto-scroll o'zi to'xtaydi
        const atBottom =
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
        if (!atBottom) {
          window.scrollBy(0, speed);
        }
      }
      if (!cancelled) frameId = requestAnimationFrame(step);
    }
    frameId = requestAnimationFrame(step);

    function pauseForAWhile() {
      pausedRef.current = true;
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, resumeDelay);
    }

    window.addEventListener("wheel", pauseForAWhile, { passive: true });
    window.addEventListener("touchstart", pauseForAWhile, { passive: true });
    window.addEventListener("touchmove", pauseForAWhile, { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      clearTimeout(resumeTimerRef.current);
      window.removeEventListener("wheel", pauseForAWhile);
      window.removeEventListener("touchstart", pauseForAWhile);
      window.removeEventListener("touchmove", pauseForAWhile);
    };
  }, [enabled, speed, resumeDelay]);
}
