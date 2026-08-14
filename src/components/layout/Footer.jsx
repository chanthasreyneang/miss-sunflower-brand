import { NavLink } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiSend } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">Miss Sunflower</h3>
          <p>
            Natural skincare products made with love and care. We help your skin glow
            naturally and safely.
          </p>
        </div>

        <div>
          <h5>Quick Links</h5>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>

        <div>
          <h5>Contact Us</h5>
          <div className="footer-contact-item"><FiPhone /> 012 345 678</div>
          <div className="footer-contact-item"><FiMail /> info@misssunflower.com</div>
          <div className="footer-contact-item"><FiMapPin /> Phnom Penh, Cambodia</div>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Telegram"><FiSend /></a>
          </div>
        </div>
      </div>

      <div className="container">
        <hr />
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Miss Sunflower | All rights reserved</p>
          <small>Developed by Chantha Sreyneang</small>
        </div>
      </div>
    </footer>
  );
}
