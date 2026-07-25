'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Instagram, Heart, Sparkles, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-inter text-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gold-50 via-white to-gold-50/30">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-sm font-semibold text-gold-700">
            <Sparkles size={16} />
            About AuraBeads
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-gray-950">
            Handcrafted Jewelry with <span className="text-gold-600">Soul & Style</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Welcome to AuraBeads, where every piece tells a story of craftsmanship, creativity, and passion. We create handcrafted jewelry that celebrates individuality and beauty.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-gray-950">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  AuraBeads started as a passion project from our home in Gaighat, Udayapur. What began as a love for creating beautiful, meaningful jewelry has blossomed into a full-fledged business dedicated to bringing handcrafted pieces to jewelry lovers across Nepal and beyond.
                </p>
                <p>
                  Each piece in our collection is meticulously crafted with attention to detail and a commitment to quality. We believe that jewelry is more than just an accessory—it's a form of personal expression and a celebration of individual style.
                </p>
                <p>
                  From elegant earrings and necklaces to stunning bracelets and rings, every item in our collection reflects our dedication to the art of jewelry making. We use premium materials and traditional craftsmanship techniques combined with modern design sensibilities.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 transition"
                >
                  Explore Our Collection
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-200 to-gold-100 rounded-3xl blur-2xl opacity-40" />
              <div className="relative h-96 sm:h-full min-h-96 rounded-3xl bg-gradient-to-br from-gold-50 to-gray-50 border border-gold-200 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <Heart size={64} className="mx-auto text-gold-600" />
                  <p className="font-serif text-2xl font-light text-gray-900">Crafted with Love</p>
                  <p className="text-sm text-gray-600">Every piece is made with care and passion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-gray-950 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">What drives everything we do</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {/* Quality */}
            <div className="rounded-2xl bg-white p-8 border border-gold-100 text-center space-y-4 hover:shadow-lg hover:border-gold-300 transition">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <Award size={28} />
              </div>
              <h3 className="font-serif text-xl font-medium text-gray-900">Quality</h3>
              <p className="text-sm text-gray-600">
                We use only premium materials and maintain rigorous quality standards in every piece we create.
              </p>
            </div>

            {/* Creativity */}
            <div className="rounded-2xl bg-white p-8 border border-gold-100 text-center space-y-4 hover:shadow-lg hover:border-gold-300 transition">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <Sparkles size={28} />
              </div>
              <h3 className="font-serif text-xl font-medium text-gray-900">Creativity</h3>
              <p className="text-sm text-gray-600">
                Innovation and artistic expression are at the heart of our design process and collections.
              </p>
            </div>

            {/* Passion */}
            <div className="rounded-2xl bg-white p-8 border border-gold-100 text-center space-y-4 hover:shadow-lg hover:border-gold-300 transition">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <Heart size={28} />
              </div>
              <h3 className="font-serif text-xl font-medium text-gray-900">Passion</h3>
              <p className="text-sm text-gray-600">
                We pour our hearts into every design, creating jewelry that resonates with your personal style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-gray-950 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">We'd love to hear from you</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Location */}
                <div className="rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100/50 p-8 border border-gold-200 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-600 text-white flex-shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Our Location</h3>
                      <p className="text-gray-700 font-medium">Gaighat, Udayapur</p>
                      <p className="text-sm text-gray-600">Nepal</p>
                      <p className="text-xs text-gray-500 mt-2 font-mono">26.7891023, 86.7081850</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100/50 p-8 border border-gold-200 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-600 text-white flex-shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Number</h3>
                      <a href="tel:9819721703" className="text-lg font-semibold text-gold-600 hover:text-gold-700 transition">
                        9819721703
                      </a>
                      <p className="text-sm text-gray-600 mt-1">Available for inquiries & orders</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100/50 p-8 border border-gold-200 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-600 text-white flex-shrink-0">
                      <Instagram size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Follow Us</h3>
                      <a
                        href="https://www.instagram.com/aura_beads_store/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-600 hover:text-gold-700 transition font-medium"
                      >
                        @aura_beads_store
                      </a>
                      <p className="text-sm text-gray-600 mt-1">See our latest designs & updates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map / Business Hours */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="rounded-2xl overflow-hidden border-2 border-gold-200 h-80 bg-gray-100 flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.123456!2d86.7081850!3d26.7891023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2sAuraBeads%20Gaighat%20Udayapur!5e0!3m2!1sen!2snp!4v1234567890`}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Business Info */}
              <div className="rounded-2xl bg-white p-8 border border-gold-100 space-y-6">
                <h3 className="font-serif text-xl font-medium text-gray-900">About Our Store</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Type of Store</p>
                    <p>Home-Based Artisan Jewelry Shop</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Specialization</p>
                    <p>Handcrafted Jewelry & Beaded Accessories</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Focus</p>
                    <p>Product Visibility & Direct Customer Connection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gold-600 to-gold-700">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">Ready to Find Your Perfect Piece?</h2>
          <p className="text-lg text-gold-100">
            Browse our exclusive collection of handcrafted jewelry and discover the perfect accessory for any occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gold-600 shadow-lg transition hover:bg-gold-50"
            >
              Shop Now
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="h-8" />
    </main>
  );
}
