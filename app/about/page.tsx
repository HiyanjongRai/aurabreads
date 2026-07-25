import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Instagram,
  Heart,
  Gem,
  Award,
  Leaf,
  ArrowRight,
  Star,
  Users,
  Package,
} from 'lucide-react';

export const metadata = {
  title: 'About — AuraBeads',
  description:
    'Handcrafted jewelry made with love from Gaighat, Udayapur. Discover the story behind AuraBeads.',
};

const stats = [
  { value: '500+', label: 'Happy Customers', icon: Users },
  { value: '3+', label: 'Years of Craft', icon: Award },
  { value: '200+', label: 'Unique Designs', icon: Gem },
  { value: '4.9', label: 'Average Rating', icon: Star },
];

const values = [
  {
    icon: Gem,
    title: 'Premium Materials',
    body: 'Every bead, wire, and finding we use is hand-selected for quality. We never compromise on the materials that touch your skin.',
  },
  {
    icon: Heart,
    title: 'Made with Intention',
    body: 'Each piece is crafted slowly, by hand, with full attention. We believe the care put into an object becomes part of it.',
  },
  {
    icon: Leaf,
    title: 'Thoughtful Sourcing',
    body: 'We work with local suppliers where possible and choose materials that are gentle on you and on the planet.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="ab-about-root">

        {/* ── Hero ── */}
        <section className="ab-about-hero">
          <div className="ab-about-hero-inner">
            <span className="ab-about-eyebrow">Our Story</span>
            <h1 className="ab-about-hero-title">
              Jewelry made by hand,<br />worn with meaning.
            </h1>
            <p className="ab-about-hero-sub">
              AuraBeads is a home-based artisan jewellery studio from Gaighat,
              Udayapur. Every piece is made by hand — shaped, strung, and finished
              with care before it ever reaches you.
            </p>
            <Link href="/" className="ab-about-hero-cta">
              Shop the collection <ArrowRight size={15} />
            </Link>
          </div>

          {/* Decorative rule */}
          <div className="ab-about-hero-rule" />
        </section>

        {/* ── Story ── */}
        <section className="ab-about-story">
          <div className="ab-about-container">
            <div className="ab-about-story-grid">

              {/* Text */}
              <div className="ab-about-story-text">
                <span className="ab-about-section-tag">Our Beginning</span>
                <h2 className="ab-about-section-title">
                  From a kitchen table<br />to a full collection.
                </h2>
                <div className="ab-about-story-body">
                  <p>
                    AuraBeads was born from a simple need — to make something beautiful
                    with our hands. What started as a weekend hobby on a kitchen table
                    in Gaighat grew into a real studio practice, piece by piece, order
                    by order.
                  </p>
                  <p>
                    We don't have a factory. We have a workspace, a bead cabinet, and
                    a deep respect for the craft. Each item in our collection is made
                    individually — no two are exactly alike, and that's exactly the
                    point.
                  </p>
                  <p>
                    Today we ship across Nepal and beyond, but the process is the same
                    as day one: quiet focus, good materials, and a genuine love for
                    what we make.
                  </p>
                </div>
                <Link href="/" className="ab-about-text-link">
                  Explore our pieces <ArrowRight size={14} />
                </Link>
              </div>

              {/* Image panel */}
              <div className="ab-about-story-visual">
                <div className="ab-about-story-panel">
                  <div className="ab-about-story-panel-inner">
                    <Gem size={36} strokeWidth={1.25} />
                    <p className="ab-about-story-panel-quote">
                      &ldquo;Each bead placed with purpose. Each piece finished with care.&rdquo;
                    </p>
                    <span className="ab-about-story-panel-sig">— AuraBeads Studio</span>
                  </div>
                </div>
                {/* Floating accent card */}
                <div className="ab-about-story-accent">
                  <Package size={14} strokeWidth={2} />
                  <span>Gift-wrapped for every order</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="ab-about-values">
          <div className="ab-about-container">
            <div className="ab-about-values-header">
              <span className="ab-about-section-tag">What we stand for</span>
              <h2 className="ab-about-section-title">Built on three principles.</h2>
            </div>
            <div className="ab-about-values-grid">
              {values.map(({ icon: Icon, title, body }, i) => (
                <div key={title} className="ab-about-value-card">
                  <div className="ab-about-value-num">0{i + 1}</div>
                  <div className="ab-about-value-icon">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="ab-about-value-title">{title}</h3>
                  <p className="ab-about-value-body">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="ab-about-contact">
          <div className="ab-about-container">
            <div className="ab-about-contact-header">
              <span className="ab-about-section-tag">Find us</span>
              <h2 className="ab-about-section-title">Get in touch.</h2>
            </div>

            <div className="ab-about-contact-grid">

              {/* Contact cards */}
              <div className="ab-about-contact-cards">
                <a href="tel:9819721703" className="ab-about-contact-card">
                  <div className="ab-about-contact-card-icon">
                    <Phone size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="ab-about-contact-card-label">Call or WhatsApp</p>
                    <p className="ab-about-contact-card-value">+977 9819721703</p>
                    <p className="ab-about-contact-card-note">Available for orders and inquiries</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/aura_beads_store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-about-contact-card"
                >
                  <div className="ab-about-contact-card-icon">
                    <Instagram size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="ab-about-contact-card-label">Instagram</p>
                    <p className="ab-about-contact-card-value">@aura_beads_store</p>
                    <p className="ab-about-contact-card-note">New designs, behind-the-scenes, updates</p>
                  </div>
                </a>

                <div className="ab-about-contact-card">
                  <div className="ab-about-contact-card-icon">
                    <MapPin size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="ab-about-contact-card-label">Based in</p>
                    <p className="ab-about-contact-card-value">Gaighat, Udayapur</p>
                    <p className="ab-about-contact-card-note">Nepal — shipping nationwide</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="ab-about-map-wrap">
                <iframe
                  title="AuraBeads location map"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.123456!2d86.7081850!3d26.7891023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2sGaighat%20Udayapur%20Nepal!5e0!3m2!1sen!2snp!4v1234567890"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ab-about-cta">
          <div className="ab-about-cta-inner">
            <span className="ab-about-eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Ready to explore?
            </span>
            <h2 className="ab-about-cta-title">
              Find the piece<br />that feels like you.
            </h2>
            <p className="ab-about-cta-sub">
              Earrings, necklaces, bracelets — each one made by hand, ready to be yours.
            </p>
            <div className="ab-about-cta-btns">
              <Link href="/" className="ab-about-cta-primary">
                Shop the collection
              </Link>
              <a
                href="https://www.instagram.com/aura_beads_store/"
                target="_blank"
                rel="noopener noreferrer"
                className="ab-about-cta-secondary"
              >
                <Instagram size={15} strokeWidth={2} />
                Follow on Instagram
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
