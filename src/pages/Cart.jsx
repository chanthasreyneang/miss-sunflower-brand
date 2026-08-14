import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiCreditCard, FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../services/orderService";
import EmptyState from "../components/common/EmptyState";
import qr from "../assets/images/qr.png";
import "./Cart.css";

const PAYMENT_METHODS = ["ABA Bank", "ACLEDA Bank", "Wing Money", "Cash On Delivery"];
const EMPTY_FORM = { name: "", phone: "", address: "", paymentMethod: PAYMENT_METHODS[0] };

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, subtotal } = useCart();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      await createOrder({
        userId: currentUser.uid,
        items: items.map(({ id, name, price, qty }) => ({ productId: id, name, price, qty })),
        total: subtotal,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      setOrderPlaced(true);
      showToast("Order placed successfully!");
    } catch {
      showToast("Couldn't place your order. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="container section-tight">
        <EmptyState
          icon={<FiCheckCircle />}
          title="Order placed successfully!"
          message="Thank you for shopping with Miss Sunflower. We'll be in touch to confirm your delivery."
          action={<Link to="/products" className="btn btn-primary btn-sm">Continue Shopping</Link>}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container section-tight">
        <EmptyState
          icon={<FiShoppingBag />}
          title="Your cart is empty"
          message="Browse our products and add your favorites to the cart."
          action={<Link to="/products" className="btn btn-primary btn-sm">Shop Now</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container section-tight">
      <h1><FiShoppingBag /> Shopping Cart</h1>

      <div className="cart-layout">
        <div className="card cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h5>{item.name}</h5>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="qty-stepper">
                <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                  <FiMinus />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                  <FiPlus />
                </button>
              </div>
              <p className="cart-item-line-total">${(item.price * item.qty).toFixed(2)}</p>
              <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="card cart-checkout">
          <h3>Checkout</h3>

          {!currentUser ? (
            <div className="cart-login-prompt">
              <p>Please sign in to place your order.</p>
              <Link to="/login" className="btn btn-primary btn-block">Sign In</Link>
              <Link to="/register" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                Create Account
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="012 345 678" />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-control" required rows={3} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Enter your address" />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-control" value={form.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)}>
                  {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div className="cart-qr text-center">
                <h5>Scan To Pay</h5>
                <img src={qr} width={150} alt="QR code to pay" />
              </div>

              <hr />
              <div className="cart-total-row">
                <span>Total</span>
                <span className="cart-total-value">${subtotal.toFixed(2)}</span>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                <FiCreditCard /> {submitting ? "Placing order..." : "Place Order"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
