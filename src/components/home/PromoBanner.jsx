import { Link } from "react-router-dom";
import Reveal from "../common/Reveal";
import "./PromoBanner.css";

export default function PromoBanner({ title, subtitle, ctaText, ctaLink = "/products" }) {
  return (
    <section className="promo-banner">
      <Reveal className="container text-center">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <Link to={ctaLink} className="btn btn-primary btn-lg-custom">
          {ctaText}
        </Link>
      </Reveal>
    </section>
  );
}
