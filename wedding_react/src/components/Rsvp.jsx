import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { submitRsvp } from "../lib/api";
import { t } from "../lib/i18n";
import FloralFrame from "./FloralFrame";

export default function Rsvp({ onSubmitted, lang }) {
  const tr = t("rsvp", lang);
  const [name, setName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState("coming");
  const [wish, setWish] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  function stepGuest(delta) {
    setGuestCount((c) => Math.min(5, Math.max(1, c + delta)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await submitRsvp({ name, guest_count: guestCount, status, wish });
      setMsg({ ok: true, text: tr.success });
      setName("");
      setGuestCount(1);
      setWish("");
      onSubmitted?.();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section light rsvp" id="rsvp">
      <FloralFrame />
      <Reveal className="rsvp-badge">{tr.badge}</Reveal>
      <Reveal delay={0.1}>
        <h2>{tr.title1}<br />{tr.title2}</h2>
      </Reveal>
      <Reveal delay={0.15} className="sub">{tr.sub}</Reveal>
      <Reveal delay={0.2} className="heart" as="div">♡</Reveal>

      <Reveal delay={0.25} as="form" className="rsvp-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>{tr.nameLabel}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>{tr.countLabel}</label>
          <div className="stepper">
            <button type="button" onClick={() => stepGuest(-1)}>−</button>
            <motion.div key={guestCount} className="val"
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {guestCount}
            </motion.div>
            <button type="button" onClick={() => stepGuest(1)}>+</button>
          </div>
          <div className="stepper-hint">{tr.countHint}</div>
        </div>

        <div className="field">
          <label>{tr.comingQuestion}</label>
          <div
            className={"radio-row" + (status === "coming" ? " checked" : "")}
            onClick={() => setStatus("coming")}
          >
            <div className="dot-outline"></div>
            <span>{tr.coming}</span>
          </div>
          <div
            className={"radio-row" + (status === "not_coming" ? " checked" : "")}
            onClick={() => setStatus("not_coming")}
          >
            <div className="dot-outline"></div>
            <span>{tr.notComing}</span>
          </div>
        </div>

        <div className="field">
          <label>{tr.wishLabel}</label>
          <textarea
            rows={3}
            placeholder={tr.wishPlaceholder}
            value={wish}
            onChange={(e) => setWish(e.target.value)}
          ></textarea>
        </div>

        <motion.button
          type="submit"
          className="submit-btn"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? tr.submitting : tr.submit}
        </motion.button>

        {msg && (
          <motion.div
            className="form-msg"
            style={{ color: msg.ok ? "#3a8f6b" : "#c0392b" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {msg.text}
          </motion.div>
        )}
      </Reveal>
    </section>
  );
}
