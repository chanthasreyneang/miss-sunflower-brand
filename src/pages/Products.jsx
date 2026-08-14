import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import SearchBar from "../components/common/SearchBar";
import CategoryFilter from "../components/common/CategoryFilter";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/product/QuickViewModal";
import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";
import Reveal from "../components/common/Reveal";
import { useCatalog } from "../context/CatalogContext";
import "./Products.css";

const PRICE_RANGES = [
  { value: "all", label: "All Prices" },
  { value: "0-5", label: "Under $5" },
  { value: "5-10", label: "$5 – $10" },
  { value: "10-20", label: "$10 – $20" },
  { value: "20-999", label: "$20+" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
];

export default function Products() {
  const { products, categories, loading } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const next = {};
    if (search) next.q = search;
    if (category !== "all") next.category = category;
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      list = list.filter((p) => p.price >= min && p.price <= max);
    }

    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, search, category, priceRange, sortBy]);

  const hasActiveFilters = search || category !== "all" || priceRange !== "all";

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setPriceRange("all");
    setSortBy("newest");
  }

  return (
    <div className="container section-tight">
      <Reveal as="h1" className="section-title">Our Products</Reveal>
      <Reveal className="section-subtitle" style={{ transitionDelay: "60ms" }}>
        Discover quality skincare products designed for healthy and glowing skin.
      </Reveal>

      <div className="products-toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <div className="products-toolbar-selects">
          <select className="form-control" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            {PRICE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <select className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              <FiX /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="products-category-row">
        <CategoryFilter categories={categories} active={category} onChange={setCategory} />
      </div>

      <p className="products-result-count">
        {loading ? "Loading..." : `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`}
      </p>

      {loading ? (
        <Loading label="Loading products..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products match your search"
          message="Try a different keyword, category, or price range."
          action={
            <button className="btn btn-primary btn-sm" onClick={resetFilters}>
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
