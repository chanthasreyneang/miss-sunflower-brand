import { FiGrid } from "react-icons/fi";
import { CategoryIcon } from "./categoryIcons";
import "./CategoryFilter.css";

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="category-filter" role="tablist" aria-label="Filter by category">
      <button
        role="tab"
        aria-selected={active === "all"}
        className={`category-pill ${active === "all" ? "is-active" : ""}`}
        onClick={() => onChange("all")}
      >
        <FiGrid /> All Products
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug || cat.id}
          role="tab"
          aria-selected={active === cat.slug}
          className={`category-pill ${active === cat.slug ? "is-active" : ""}`}
          onClick={() => onChange(cat.slug)}
        >
          <CategoryIcon icon={cat.icon} /> {cat.name}
        </button>
      ))}
    </div>
  );
}
