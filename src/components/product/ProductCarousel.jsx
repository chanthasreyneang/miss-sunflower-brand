import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "./ProductCard";
import EmptyState from "../common/EmptyState";
import "./ProductCarousel.css";

export default function ProductCarousel({ title, subtitle, products, onQuickView }) {
  const trackRef = useRef(null);

  function scroll(direction) {
    const node = trackRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.8 * direction;
    node.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="product-carousel">
      {(title || subtitle) && (
        <div className="product-carousel-header">
          <div>
            {title && <h2 className="section-title" style={{ textAlign: "left", marginBottom: 4 }}>{title}</h2>}
            {subtitle && <p style={{ margin: 0 }}>{subtitle}</p>}
          </div>
          <div className="product-carousel-arrows">
            <button aria-label="Scroll left" onClick={() => scroll(-1)}>
              <FiChevronLeft />
            </button>
            <button aria-label="Scroll right" onClick={() => scroll(1)}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <EmptyState title="No products yet" message="Check back soon for new arrivals." />
      ) : (
        <div className="hscroll" ref={trackRef}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  );
}
