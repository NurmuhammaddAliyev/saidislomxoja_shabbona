import { motion } from "framer-motion";

/**
 * Bo'lim ekranga kirganda pastdan yumshoq chiqadigan animatsiya wrapper.
 * Har bir section shu bilan o'raladi — takroriy kod yozmaslik uchun.
 */
/**
 * Bo'lim ekranga kirganda yumshoq paydo bo'ladigan (faqat fade) wrapper.
 * Harakat manbai endi FAQAT butun sahifaning avto-scroll bilan asta-sekin
 * pastga tushishi — shuning uchun bu yerda qo'shimcha "pastdan chiqish"
 * yoki "kattalashish" animatsiyasi qo'shilmaydi, aks holda ikkita harakat
 * bir-biriga qo'shilib "bo'lim-bo'lim sakrab tushayotgandek" ko'rinadi.
 */
export default function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
