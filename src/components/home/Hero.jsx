import { Link } from "react-router-dom";
import hbanner from "../../assets/images/hbanner.png";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-media">
        <img src={hbanner} alt="Miss Sunflower skincare" />
        <div className="hero-media-overlay" />
      </div>

      <div className="container hero-content">
        <span className="badge hero-eyebrow">Natural Cambodian Skincare</span>
        <h1>
          Welcome to <span>Miss Sunflower</span>
        </h1>
        <p>Natural skincare for healthy and glowing skin — made with love, care, and quality ingredients.</p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
          <Link to="/products" className="btn btn-outline">Explore Products</Link>
        </div>
      </div>
    </section>
  );
}
