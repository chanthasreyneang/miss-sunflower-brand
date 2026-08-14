import { useNavigate } from "react-router-dom";
import { CategoryIcon } from "../common/categoryIcons";
import EmptyState from "../common/EmptyState";
import Reveal from "../common/Reveal";
import "./CategoryGrid.css";

export default function CategoryGrid({ categories }) {
  const navigate = useNavigate();

  if (categories.length === 0) {
    return <EmptyState title="Categories coming soon" message="Once products are added, browse by category here." />;
  }

  return (
    <div className="category-grid">
      {categories.map((cat, i) => (
        <Reveal
          key={cat.id}
          as="button"
          className="category-card"
          style={{ transitionDelay: `${i * 60}ms` }}
          onClick={() => navigate(`/products?category=${cat.slug}`)}
        >
          <span className="category-card-icon">
            <CategoryIcon icon={cat.icon} />
          </span>
          <span className="category-card-name">{cat.name}</span>
        </Reveal>
      ))}
    </div>
  );
}
