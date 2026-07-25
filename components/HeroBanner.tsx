"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    tag: "Shine Everyday",
    title: "Effortless Style,\nTimeless You",
    sub: "Fashion jewelry that complements your every mood and moment.",
    cta: "Shop Now",
    href: "/products",
  },
  {
    tag: "New Arrivals",
    title: "Bold &\nBeautiful",
    sub: "Discover our latest collection of statement-making pieces.",
    cta: "Explore Now",
    href: "#categories",
  },
  {
    tag: "Limited Edition",
    title: "Crafted For\nEvery Occasion",
    sub: "From brunch to gala — jewelry that tells your story.",
    cta: "View Collection",
    href: "#categories",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  const slide = slides[current];

  return (
    <section className="ab-hero">
      {/* Background image */}
      <div className="ab-hero-img">
        <Image
          src="/hero-model.png"
          alt="Hero model wearing AuraBeads jewelry"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        <div className="ab-hero-overlay" />
      </div>

      {/* Content */}
      <div className="ab-hero-content">
        <p className="ab-hero-tag">{slide.tag}</p>
        <h1 className="ab-hero-title">{slide.title}</h1>
        <p className="ab-hero-sub">{slide.sub}</p>
        <Link href={slide.href} className="ab-btn-gold">
          {slide.cta} →
        </Link>
      </div>

      {/* Arrows */}
      <button className="ab-hero-arrow ab-hero-arrow--left" onClick={prev} aria-label="Previous slide">&#8249;</button>
      <button className="ab-hero-arrow ab-hero-arrow--right" onClick={next} aria-label="Next slide">&#8250;</button>

      {/* Dots */}
      <div className="ab-hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`ab-hero-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
