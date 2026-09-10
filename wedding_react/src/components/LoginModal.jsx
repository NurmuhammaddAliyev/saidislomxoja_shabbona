import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardLogin } from "../lib/api";

export default function LoginModal({ open, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(false);
    try {
      const data = await dashboardLogin(password);
      setPassword("");
      onSuccess(data.token);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-box"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h3>Admin panelga kirish</h3>
            <div className="sub">To'y egasi uchun — parolni kiriting</div>
            <input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />
            {error && <div className="modal-err">Parol noto'g'ri</div>}
            <div className="modal-actions">
              <span className="cancel" onClick={onClose}>Bekor qilish</span>
              <span className="ok" onClick={handleLogin}>
                {loading ? "..." : "Kirish"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
