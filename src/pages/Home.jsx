import { useMemo, useState } from "react";
import { FiFeather, FiDollarSign, FiShield } from "react-icons/fi";
import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/CategoryGrid";
import PromoBanner from "../components/home/PromoBanner";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import ProductCarousel from "../components/product/ProductCarousel";
import QuickViewModal from "../components/product/QuickViewModal";
import Loading from "../components/common/Loading";
import Reveal from "../components/common/Reveal";
import { useCatalog } from "../context/CatalogContext";
import jy from "../assets/images/jy.png";
import "./Home.css";

const WHY_CHOOSE_US = [
  { icon: FiFeather, title: "Natural Ingredients", text: "Safe and healthy for all skin types." },
  { icon: FiDollarSign, title: "Affordable Price", text: "High quality but budget friendly." },
  { icon: FiShield, title: "Trusted Brand", text: "Used by many happy customers across Cambodia." },
];

export default function Home() {
  const { products, categories, loading } = useCatalog();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [readMore, setReadMore] = useState(false);

  const bestSellers = useMemo(() => products.filter((p) => p.bestSeller), [products]);
  const featured = useMemo(() => products.filter((p) => p.featured), [products]);

  return (
    <div>
      <Hero />

      <PromoBanner
        title="Miss Sunflower is a ritual of beauty inspired by nature."
        subtitle="Discover gentle skincare designed to bring out your natural glow, every single day."
        ctaText="Start Your Journey"
      />

      <section className="section container">
        <Reveal as="h2" className="section-title">Shop by Category</Reveal>
        <Reveal className="section-subtitle" style={{ transitionDelay: "60ms" }}>
          Find exactly what your skin needs.
        </Reveal>
        {loading ? <Loading label="Loading categories..." /> : <CategoryGrid categories={categories} />}
      </section>

      <section className="section container">
        {loading ? (
          <Loading label="Loading featured products..." />
        ) : (
          <ProductCarousel
            title="Featured Products"
            subtitle="Hand-picked favorites from our collection."
            products={featured}
            onQuickView={setQuickViewProduct}
          />
        )}
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        {loading ? (
          <Loading label="Loading best sellers..." />
        ) : (
          <ProductCarousel
            title="Best Sellers"
            subtitle="Customer favorites, loved again and again."
            products={bestSellers}
            onQuickView={setQuickViewProduct}
          />
        )}
      </section>

      <section className="section container">
        <div className="about-teaser card">
          <div className="about-teaser-media">
            <img src={jy} alt="Miss Sunflower founder" />
          </div>
          <div className="about-teaser-body">
            <h2>About Miss Sunflower</h2>
            <p>
              Miss Sunflower is a Cambodian skincare brand founded by CEO Lai Souyiek. The
              brand offers quality beauty and personal care products
              {!readMore && "..."}
              {readMore && (
                <>
                  {" "}focused on using natural ingredients that are safe and effective for all
                  skin types. The brand is committed to helping customers achieve healthy,
                  radiant skin while maintaining affordability.
                  <br /><br />
                  Over the years, Miss Sunflower has gained the trust of many customers across
                  Cambodia. With a passion for beauty and self-care, the company continues to
                  innovate and expand its product line to meet modern skincare needs.
                  <br /><br />
                  Our mission is to empower confidence through high-quality skincare products
                  that deliver real results.
                </>
              )}
            </p>
            <button className="btn btn-dark" onClick={() => setReadMore((v) => !v)}>
              {readMore ? "Read Less" : "Read More"}
            </button>
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal as="h2" className="section-title">Why Choose Us?</Reveal>
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {WHY_CHOOSE_US.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} className="why-card" style={{ transitionDelay: `${i * 80}ms` }}>
              <Icon />
              <h5>{title}</h5>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal as="h2" className="section-title">Feedback From Customers</Reveal>
        <Reveal className="section-subtitle" style={{ transitionDelay: "60ms" }}>
          Real experiences from our Miss Sunflower community.
        </Reveal>
        <Testimonials />
      </section>

      <PromoBanner
        title="Ready to transform your skincare routine?"
        subtitle="Discover natural beauty products made for healthy and glowing skin."
        ctaText="Shop Now"
      />

      <Newsletter />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
