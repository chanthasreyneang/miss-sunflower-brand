import "./Loading.css";

export default function Loading({ label = "Loading...", full = false }) {
  return (
    <div className={`loading-wrap ${full ? "loading-full" : ""}`}>
      <span className="loading-spinner" />
      <p>{label}</p>
    </div>
  );
}
