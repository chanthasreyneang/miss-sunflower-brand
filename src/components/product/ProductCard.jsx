import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useCatalog } from "../../context/CatalogContext";
import StarRating from "./StarRating";
import "./ProductCard.css";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { currentUser, wishlist, toggleWishlist } = useAuth();
  const { showToast } = useToast();
  const { categories } = useCatalog();
  const navigate = useNavigate();

  const categoryName = categories.find((c) => c.slug === product.category)?.name || product.category;
  const inWishlist = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;

  function handleAddToCart(e) {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product, 1);
    showToast(`${product.name} added to cart`);
  }

  function handleWishlist(e) {
    e.preventDefault();
    if (!currentUser) {
      showToast("Sign in to save items to your wishlist", "error");
      navigate("/login");
      return;
    }
    toggleWishlist(product.id);
    showToast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  }

  function handleQuickView(e) {
    e.preventDefault();
    onQuickView?.(product);
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        {outOfStock && <span className="product-card-tag out">Out of Stock</span>}
        {!outOfStock && product.bestSeller && <span className="product-card-tag best">Best Seller</span>}
        <div className="product-card-hover-actions">
          <button aria-label="Quick view" onClick={handleQuickView}>
            <FiEye />
          </button>
          <button
            aria-label="Add to wishlist"
            className={inWishlist ? "is-active" : ""}
            onClick={handleWishlist}
          >
            <FiHeart />
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{categoryName}</span>
        <h4>{product.name}</h4>
        <StarRating rating={product.rating || 0} />
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button
            className="product-card-add"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label="Add to cart"
          >
            <FiShoppingBag />
          </button>
        </div>
      </div>
    </Link>
  );
}
