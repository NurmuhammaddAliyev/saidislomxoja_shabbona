import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchDashboardStats, fetchDashboardGuests } from "../lib/api";

const STATUS_LABEL = { coming: "Keladi", not_coming: "Kela olmaydi", pending: "Kutilmoqda" };

export default function Dashboard({ token, onClose }) {
  const [stats, setStats] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, g] = await Promise.all([
          fetchDashboardStats(token),
          fetchDashboardGuests(token),
        ]);
        setStats(s);
        setGuests(g);
      } catch (e) {
        // Xatoni yashirmaymiz: aks holda bo'sh jadval "mehmon yo'q" kabi
        // ko'rinadi va aslida ulanish uzilganini bilib bo'lmaydi.
        console.warn("Dashboard ma'lumotini yuklab bo'lmadi", e);
        setError("Ma'lumotni yuklab bo'lmadi. Server bilan aloqani tekshiring.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dash-header">
        <div className="eyebrow">✦ Mehmonlar ro'yxati ✦</div>
        <h2>Ishtirokchilar<br />jadvali</h2>
      </div>

      {loading ? (
        <div className="dash-msg">Yuklanmoqda...</div>
      ) : error ? (
        <div className="dash-msg err">{error}</div>
      ) : (
        <>
          <div className="stat-cards">
            <motion.div className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="n">{stats?.total_guests ?? 0}</div>
              <div className="l">Jami mehmonlar</div>
            </motion.div>
            <motion.div className="stat-card ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="n">{stats?.confirmed ?? 0}</div>
              <div className="l">Tasdiqlangan</div>
            </motion.div>
            <motion.div className="stat-card no" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="n">{stats?.declined ?? 0}</div>
              <div className="l">Kela olmaydi</div>
            </motion.div>
          </div>

          <table className="guest-table">
            <thead>
              <tr>
                <th>№</th><th>Mehmon ismi</th><th>Soni</th><th>Holat</th><th>Izoh</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g, i) => (
                <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>{i + 1}</td>
                  <td>{g.name}</td>
                  <td>{g.guest_count}</td>
                  <td><span className={"status-pill " + g.status}>{STATUS_LABEL[g.status] || g.status}</span></td>
                  <td>{g.wish || "—"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {guests.length === 0 && (
            <div className="dash-msg">Hozircha birorta mehmon javob yubormagan.</div>
          )}
        </>
      )}

      <button className="dash-close" onClick={onClose}>← Saytga qaytish</button>
    </motion.div>
  );
}
