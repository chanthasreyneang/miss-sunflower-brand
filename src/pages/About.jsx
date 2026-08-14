import { FiTarget, FiEye, FiAward, FiHeart, FiFeather } from "react-icons/fi";
import Reveal from "../components/common/Reveal";
import PromoBanner from "../components/home/PromoBanner";
import ceo2 from "../assets/images/ceo2.png";
import "./About.css";

const CORE_VALUES = [
  { icon: FiAward, title: "Quality", text: "Providing products that meet high standards." },
  { icon: FiHeart, title: "Customer Care", text: "Putting customer satisfaction at the center of everything." },
  { icon: FiFeather, title: "Natural Beauty", text: "Promoting healthy and confident beauty naturally." },
];

const STATS = [
  { value: "5000+", label: "Happy Customers" },
  { value: "20+", label: "Beauty Products" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Customer Satisfaction" },
];

export default function About() {
  return (
    <div>
      <section className="section-tight text-center container">
        <Reveal as="h1">About Miss Sunflower</Reveal>
        <Reveal className="section-subtitle" style={{ transitionDelay: "60ms" }}>
          Discover the story behind our commitment to healthy and glowing skin.
        </Reveal>
      </section>

      <section className="container section-tight">
        <div className="card about-story">
          <div className="about-story-media">
            <img src={ceo2} alt="Miss Sunflower CEO" />
          </div>
          <div className="about-story-body">
            <h2>Our Story</h2>
            <p>
              Miss Sunflower is a Cambodian skincare brand founded by CEO Lai Souyiek. The
              company was created with a passion for beauty, self-care, and confidence.
            </p>
            <p>
              We believe everyone deserves healthy and radiant skin. Our products are carefully
              selected and designed to help customers achieve their skincare goals safely and
              effectively.
            </p>
            <p>
              Today, Miss Sunflower continues to grow and gain the trust of customers across
              Cambodia through quality products and excellent customer service.
            </p>
            <p>
              Miss Sunflower is dedicated to empowering individuals through effective skincare
              solutions. By combining quality ingredients, innovation, and customer care, we
              strive to help people feel confident in their natural beauty every day.
            </p>
          </div>
        </div>
      </section>

      <section className="container section-tight">
        <div className="grid grid-2">
          <Reveal className="card mission-card">
            <FiTarget />
            <h3>Our Mission</h3>
            <p>
              To provide safe, affordable, and effective skincare products that help customers
              feel confident and beautiful.
            </p>
          </Reveal>
          <Reveal className="card mission-card" style={{ transitionDelay: "100ms" }}>
            <FiEye />
            <h3>Our Vision</h3>
            <p>
              To become one of Cambodia's most trusted skincare brands and inspire confidence
              through natural beauty.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container section-tight">
        <Reveal as="h2" className="section-title">Our Core Values</Reveal>
        <div className="grid grid-3" style={{ marginTop: 32 }}>
          {CORE_VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} className="card why-card" style={{ transitionDelay: `${i * 80}ms` }}>
              <Icon />
              <h5>{title}</h5>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section-tight">
        <Reveal as="h2" className="section-title">Why Choose Miss Sunflower?</Reveal>
        <div className="grid grid-4" style={{ marginTop: 32 }}>
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} className="card stat-card" style={{ transitionDelay: `${i * 80}ms` }}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <PromoBanner
        title="Ready to discover your natural beauty?"
        subtitle="Explore our skincare collection and find the perfect products for you."
        ctaText="Explore Products"
      />
    </div>
  );
}
