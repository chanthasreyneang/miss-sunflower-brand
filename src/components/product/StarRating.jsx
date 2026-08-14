import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ rating = 0, showValue = true, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-primary-dark)" }}>
      <span style={{ display: "inline-flex", gap: 1, fontSize: size }}>
        {Array.from({ length: full }).map((_, i) => <FaStar key={`f${i}`} />)}
        {half && <FaStarHalfAlt />}
        {Array.from({ length: empty }).map((_, i) => <FaRegStar key={`e${i}`} />)}
      </span>
      {showValue && <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{rating.toFixed(1)}</span>}
    </span>
  );
}
