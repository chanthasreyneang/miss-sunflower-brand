import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import Reveal from "../components/common/Reveal";
import { addContactMessage } from "../services/messageService";
import { useToast } from "../context/ToastContext";
import "./Contact.css";

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addContactMessage(form);
      showToast("Message sent! We'll get back to you soon.");
      setForm(EMPTY_FORM);
    } catch {
      showToast("Couldn't send your message. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="section-tight text-center container">
        <Reveal as="h1">Contact Us</Reveal>
        <Reveal className="section-subtitle" style={{ transitionDelay: "60ms" }}>
          We'd love to hear from you. Place your order or contact our team today.
        </Reveal>
      </section>

      <section className="container section-tight">
        <div className="contact-grid">
          <div className="card contact-form-card">
            <h3>Send Us A Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  className="form-control"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Enter subject"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Type your message here..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="card contact-info-card">
            <h3>Contact Information</h3>
            <p><FiPhone /> 012 345 678</p>
            <p><FiMail /> info@misssunflower.com</p>
            <p><FiMapPin /> Phnom Penh, Cambodia</p>
            <p><FiClock /> Mon - Sat | 8:00 AM - 5:00 PM</p>
            <hr />
            <h5>Our Location</h5>
            <div className="contact-map">
              <iframe
                title="Miss Sunflower location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.765296562772!2d104.88816677481726!3d11.568675988632382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109519fe4077d69%3A0x20138e822e434660!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1782219321836!5m2!1sen!2skh"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
