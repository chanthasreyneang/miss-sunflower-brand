import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { addNewsletterSignup } from "../../services/messageService";
import { useToast } from "../../context/ToastContext";
import Reveal from "../common/Reveal";
import "./Newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await addNewsletterSignup(email.trim());
      showToast("You're subscribed! Watch your inbox for skincare tips & offers.");
      setEmail("");
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="newsletter">
      <Reveal className="container newsletter-inner">
        <div>
          <h2>Join the Miss Sunflower Circle</h2>
          <p>Get skincare tips, new arrivals, and member-only offers straight to your inbox.</p>
        </div>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button className="btn btn-dark" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : <>Subscribe <FiSend /></>}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
