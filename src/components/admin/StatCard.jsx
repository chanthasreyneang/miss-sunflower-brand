import "./StatCard.css";

export default function StatCard({ icon, label, value, loading }) {
  return (
    <div className="stat-tile card">
      <div className="stat-tile-icon">{icon}</div>
      <div>
        <p className="stat-tile-value">{loading ? "—" : value}</p>
        <p className="stat-tile-label">{label}</p>
      </div>
    </div>
  );
}
