import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiMinus, FiPlus, FiHeart, FiChevronRight } from "react-icons/fi";
import { useCatalog } from "../context/CatalogContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StarRating from "../components/product/StarRating";
import ProductCarousel from "../components/product/ProductCarousel";
import QuickViewModal from "../components/product/QuickViewModal";
import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, categories, loading } = useCatalog();
  const { addToCart } = useCart();
  const { currentUser, wishlist, toggleWishlist } = useAuth();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const product = products.find((p) => p.id === id);

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [products, product]);

  if (loading) return <Loading full label="Loading product..." />;

  if (!product) {
    return (
      <div className="container section-tight">
        <EmptyState
          title="Product not found"
          message="This product may have been removed or is no longer available."
          action={<Link to="/products" className="btn btn-primary btn-sm">Back to Products</Link>}
        />
      </div>
    );
  }

  const categoryName = categories.find((c) => c.slug === product.category)?.name || product.category;
  const outOfStock = product.stock <= 0;
  const inWishlist = wishlist.includes(product.id);

  function handleAddToCart() {
    addToCart(product, qty);
    showToast(`${product.name} added to cart`);
  }

  function handleWishlist() {
    if (!currentUser) {
      showToast("Sign in to save items to your wishlist", "error");
      return;
    }
    toggleWishlist(product.id);
  }

  return (
    <div className="container section-tight">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> <FiChevronRight />
        <Link to="/products">Products</Link> <FiChevronRight />
        <span>{product.name}</span>
      </nav>

      <div className="product-details">
        <div className="product-details-media">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <span className="product-card-category">{categoryName}</span>
          <h1>{product.name}</h1>
          <StarRating rating={product.rating || 0} />
          <p className="product-details-price">${product.price.toFixed(2)}</p>
          <p className="product-details-desc">{product.description}</p>
          <p className={`quick-view-stock ${outOfStock ? "out" : ""}`}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>

          <div className="quick-view-actions">
            <div className="qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <FiMinus />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                <FiPlus />
              </button>
            </div>
            <button className="btn btn-primary" disabled={outOfStock} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className={`btn btn-outline btn-icon ${inWishlist ? "is-wishlisted" : ""}`}
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
            >
              <FiHeart />
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="section-tight">
          <ProductCarousel title="Related Products" products={related} onQuickView={setQuickViewProduct} />
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
