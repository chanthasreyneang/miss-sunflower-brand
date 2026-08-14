import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import Modal from "../common/Modal";
import StarRating from "./StarRating";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useCatalog } from "../../context/CatalogContext";
import "./QuickViewModal.css";

export default function QuickViewModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { currentUser, wishlist, toggleWishlist } = useAuth();
  const { showToast } = useToast();
  const { categories } = useCatalog();

  if (!product) return null;

  const categoryName = categories.find((c) => c.slug === product.category)?.name || product.category;
  const outOfStock = product.stock <= 0;
  const inWishlist = wishlist.includes(product.id);

  function handleAdd() {
    addToCart(product, qty);
    showToast(`${product.name} added to cart`);
    onClose();
  }

  function handleWishlist() {
    if (!currentUser) {
      showToast("Sign in to save items to your wishlist", "error");
      return;
    }
    toggleWishlist(product.id);
  }

  return (
    <Modal open={Boolean(product)} onClose={onClose} title="Quick View" width={720}>
      <div className="quick-view">
        <div className="quick-view-media">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="quick-view-info">
          <span className="product-card-category">{categoryName}</span>
          <h3>{product.name}</h3>
          <StarRating rating={product.rating || 0} />
          <p className="quick-view-price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
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
            <button className="btn btn-primary" disabled={outOfStock} onClick={handleAdd}>
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

          <Link to={`/products/${product.id}`} className="quick-view-link" onClick={onClose}>
            View full details →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
