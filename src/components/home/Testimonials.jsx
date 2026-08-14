import { FaStar } from "react-icons/fa";
import Reveal from "../common/Reveal";
import f1 from "../../assets/images/f1.png";
import f2 from "../../assets/images/f2.png";
import f3 from "../../assets/images/f3.png";
import "./Testimonials.css";

const feedback = [
  { image: f1, name: "Verified Customer" },
  { image: f2, name: "Verified Customer" },
  { image: f3, name: "Verified Customer" },
];

export default function Testimonials() {
  return (
    <div className="grid grid-3 testimonials-grid">
      {feedback.map((item, i) => (
        <Reveal key={item.image} className="testimonial-card" style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="testimonial-stars">
            {Array.from({ length: 5 }).map((_, s) => <FaStar key={s} />)}
          </div>
          <img src={item.image} alt={`Customer feedback ${i + 1}`} />
          <p className="testimonial-name">{item.name}</p>
        </Reveal>
      ))}
    </div>
  );
}
