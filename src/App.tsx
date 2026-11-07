/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Menu,
  X,
  Check,
  Lock,
} from 'lucide-react';
import {
  SERVICES,
  LOCATIONS,
  GALLERY_ITEMS,
  PHOTO_URLS,
  Booking,
  BookingStatus,
  getBookings,
  updateBookingStatus,
  resetDemoBookings,
  formatLocalDateISO,
} from './data/salonData';
import { ResilientImage } from './components/ResilientImage';
import { BookingFlow } from './components/BookingFlow';
import { AdminDashboard } from './components/AdminDashboard';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Booking & Filter States
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    SERVICES[1].id, // Default to Gel Manicure
  ]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    LOCATIONS[0].id // Default to Kingston Salon
  );
  const [activeLocationTabId, setActiveLocationTabId] = useState<string>(
    LOCATIONS[0].id
  );
  const [galleryFilter, setGalleryFilter] = useState<string>('All');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentPath === '/admin') {
      navigateTo('/');
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleServiceId = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBookServiceClick = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev : [...prev, serviceId]
    );
    scrollToSection('booking');
  };

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings(getBookings());
  };

  const handleUpdateBookingStatus = (id: string, status: BookingStatus) => {
    const updated = updateBookingStatus(id, status);
    setBookings(updated);
  };

  const handleResetDemoData = () => {
    const reset = resetDemoBookings();
    setBookings(reset);
  };

  const activeLocationCard = useMemo(
    () =>
      LOCATIONS.find((loc) => loc.id === activeLocationTabId) || LOCATIONS[0],
    [activeLocationTabId]
  );

  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.tag === galleryFilter);
  }, [galleryFilter]);

  const todaysCount = useMemo(() => {
    const todayISO = formatLocalDateISO(new Date());
    return bookings.filter(
      (b) => b.dateISO === todayISO && b.status !== 'cancelled'
    ).length;
  }, [bookings]);

  // Render /admin Salon Dashboard if path is /admin
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return (
      <AdminDashboard
        bookings={bookings}
        onUpdateStatus={handleUpdateBookingStatus}
        onResetDemoData={handleResetDemoData}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F0E9] text-[#0B3B2E] flex flex-col selection:bg-[#E9C9BE] selection:text-[#0B3B2E]">
      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-[#F6F0E9]/85 backdrop-blur-md border-b border-[#0B3B2E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#0B3B2E] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B2E] rounded-lg"
          >
            Happy Nails{' '}
            <span className="text-[#3F6B58]/65 text-sm align-middle ml-0.5">
              ✦
            </span>
          </a>

          {/* Zone 2: Concise Single-Line Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0B3B2E]/80"
          >
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('services');
              }}
              className="hover:text-[#0B3B2E] underline-offset-8 hover:underline transition-all whitespace-nowrap shrink-0"
            >
              Services
            </a>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('gallery');
              }}
              className="hover:text-[#0B3B2E] underline-offset-8 hover:underline transition-all whitespace-nowrap shrink-0"
            >
              Gallery
            </a>
            <a
              href="#locations"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('locations');
              }}
              className="hover:text-[#0B3B2E] underline-offset-8 hover:underline transition-all whitespace-nowrap shrink-0"
            >
              Locations
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action (+ Mobile Menu Button) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('booking')}
              className="inline-flex items-center gap-2 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B3B2E]"
            >
              <span>Book Now</span>
              <span aria-hidden="true">↗</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2.5 rounded-full bg-white/75 text-[#0B3B2E] border border-[#0B3B2E]/15 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden frosted-card border-t border-[#0B3B2E]/10 px-6 py-5 space-y-3 animate-fade-slide">
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('services');
              }}
              className="block py-2 text-base font-medium text-[#0B3B2E]"
            >
              Services
            </a>
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('booking');
              }}
              className="block py-2 text-base font-medium text-[#0B3B2E]"
            >
              Book Appointment
            </a>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('gallery');
              }}
              className="block py-2 text-base font-medium text-[#0B3B2E]"
            >
              Gallery
            </a>
            <a
              href="#locations"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('locations');
              }}
              className="block py-2 text-base font-medium text-[#0B3B2E]"
            >
              Locations
            </a>
            <div className="pt-2 border-t border-[#0B3B2E]/10">
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/admin');
                }}
                className="inline-flex items-center gap-1.5 py-1.5 text-xs text-[#0B3B2E]/50 hover:text-[#0B3B2E]"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Admin</span>
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="flex-1">
        {/* 1. HERO SECTION WITH AESTHETIC SANCTUARY BACKGROUND */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:py-28 overflow-hidden">
          {/* Full-bleed aesthetic salon sanctuary background image */}
          <div aria-hidden="true" className="absolute inset-0 z-0">
            <ResilientImage
              src={PHOTO_URLS.heroBackground}
              alt="Happy Nails Kingston sunlit boutique interior"
              className="w-full h-full object-cover object-center scale-[1.01]"
            />
            {/* Layered warm cream & soft blush scrim for editorial atmosphere + high legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F6F0E9]/95 via-[#F6F0E9]/82 to-[#F6F0E9]/45" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F6F0E9]/40 via-transparent to-[#F6F0E9]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Editorial Headline & Primary CTA */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8 frosted-card interactive-panel rounded-[2rem] p-7 sm:p-10 lg:p-12">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#3F6B58] font-semibold">
                    A little luxury, made just for you.
                  </p>
                  <h1
                    className="font-serif text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold text-[#0B3B2E] leading-[1.06] tracking-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    Your next favourite nails{' '}
                    <span className="text-[#3F6B58] italic font-normal">
                      start here.
                    </span>
                  </h1>
                </div>

                <p className="text-base sm:text-lg text-[#0B3B2E]/85 max-w-xl leading-relaxed">
                  Step into our calm Kingston upon Thames sanctuary. We pair
                  botanical cuticle care, HEMA-free builder gels, and bespoke
                  hand-painted artistry for nails that feel as restorative as
                  they look.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => scrollToSection('booking')}
                    className="btn-luxury inline-flex items-center gap-2.5 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 px-8 py-4 rounded-full text-sm sm:text-base font-medium shadow-md cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B3B2E]"
                  >
                    <span>Book your appointment</span>
                    <span aria-hidden="true" className="text-lg leading-none">
                      ↗
                    </span>
                  </button>

                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('services');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium text-[#0B3B2E] bg-white/80 hover:bg-white hover:-translate-y-0.5 border border-[#0B3B2E]/15 transition-all whitespace-nowrap shrink-0"
                  >
                    Explore treatment menu
                  </a>
                </div>

                {/* Quiet Unboxed Metadata Strip */}
                <div className="pt-4 border-t border-[#0B3B2E]/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#0B3B2E]/80">
                  <span>39 Richmond Rd, Kingston upon Thames</span>
                  <span aria-hidden="true">·</span>
                  <span>HEMA-Free & Vegan BIAB</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">4.9 ★ (420+ Local Guests)</span>
                </div>
              </div>

              {/* Right Column: Hero Imagery & Frosted Glass Detail */}
              <div className="lg:col-span-5 relative flex flex-col justify-between">
                {/* Floating Sanctuary Pill Badge on Top Left */}
                <div className="hidden sm:flex items-center gap-2 frosted-pill px-4 py-2 rounded-full absolute -top-3 left-6 z-20 animate-float-reverse text-xs font-medium text-[#0B3B2E]">
                  <span className="text-[#3F6B58]">✦</span>
                  <span>Organic Botanical Care · KT2</span>
                </div>

                <div className="relative h-full min-h-[360px] sm:min-h-[440px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/90 group">
                  <ResilientImage
                    src={PHOTO_URLS.heroEditorial}
                    alt="Glossy sheer blush and sage green French tip manicure at Happy Nails Kingston"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B2E]/55 via-transparent to-transparent" />

                  {/* Frosted Glass Floating Card Inside Hero Media */}
                  <div className="absolute bottom-5 left-5 right-5 frosted-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 animate-float-slow">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                        Signature Look · Kingston Studio
                      </p>
                      <p className="font-serif text-xl font-semibold text-[#0B3B2E]">
                        Botanical BIAB & Micro-French
                      </p>
                      <p className="text-xs text-[#0B3B2E]/75 tabular-nums">
                        60 mins · Sample price from £45
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookServiceClick('gel-manicure')}
                      className="btn-luxury px-4 py-2.5 rounded-full bg-[#0B3B2E] text-[#F6F0E9] text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Book look ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SERVICES SECTION */}
        <section
          id="services"
          className="py-16 sm:py-24 border-t border-[#0B3B2E]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B58] font-semibold">
                  Curated Menu · Sample Pricing
                </p>
                <h2
                  className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E]"
                  style={{ textWrap: 'balance' }}
                >
                  Thoughtful treatments for{' '}
                  <span className="text-[#3F6B58] italic font-normal">
                    hands & feet.
                  </span>
                </h2>
              </div>
              <p className="text-sm text-[#0B3B2E]/75 max-w-sm">
                Every appointment includes a personal nail health consultation,
                sterilised medical-grade tools, and organic botanical hydration.
              </p>
            </div>

            {/* Services Cards Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {SERVICES.map((service, index) => (
                <article
                  key={service.id}
                  className="frosted-card interactive-panel rounded-3xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9C9BE]/30">
                      <ResilientImage
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="p-6 sm:p-7 space-y-4">
                      {/* Unboxed Metadata Line */}
                      <div className="flex items-center justify-between text-xs text-[#3F6B58] tabular-nums">
                        <span className="uppercase tracking-[0.16em] font-medium">
                          0{index + 1} · {service.durationMinutes} mins
                        </span>
                        <span className="font-serif text-2xl font-semibold text-[#0B3B2E]">
                          from £{service.priceFrom}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B3B2E]">
                          {service.name}
                        </h3>
                        <p className="text-xs text-[#3F6B58] mt-0.5">
                          {service.subtitle}
                        </p>
                      </div>

                      <p className="text-sm text-[#0B3B2E]/75 leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="space-y-1.5 pt-2 border-t border-[#0B3B2E]/10 text-xs text-[#0B3B2E]/80">
                        {service.includes.map((inc) => (
                          <li key={inc} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#3F6B58] shrink-0" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 sm:px-7 pb-6 pt-2">
                    <button
                      type="button"
                      onClick={() => handleBookServiceClick(service.id)}
                      className="btn-luxury w-full inline-flex items-center justify-center gap-2 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 py-3.5 px-6 rounded-full text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Select {service.name}</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </article>
              ))}

              {/* Bespoke Bridal & Group Card to balance 3-column grid */}
              <div className="frosted-card interactive-panel rounded-3xl p-7 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#E9C9BE]/45 via-white/75 to-[#F6F0E9]">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B58] font-semibold">
                    Bespoke Consultations
                  </p>
                  <h3 className="font-serif text-3xl font-semibold text-[#0B3B2E]">
                    Not sure which treatment suits your nails?
                  </h3>
                  <p className="text-sm text-[#0B3B2E]/80 leading-relaxed">
                    Whether you are transitioning from acrylics to natural BIAB
                    or planning bridal nail art in Kingston, our senior stylists
                    will tailor your ritual upon arrival.
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#0B3B2E]/10 mt-6">
                  <p className="text-xs text-[#3F6B58]">
                    “A little luxury, made just for you.”
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToSection('booking')}
                    className="btn-luxury w-full inline-flex items-center justify-center gap-2 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 py-3.5 px-6 rounded-full text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    <span>Start 3-step booking</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE 3-STEP BOOKING FLOW SECTION */}
        <section
          id="booking"
          className="py-16 sm:py-24 bg-gradient-to-b from-[#E9C9BE]/25 via-[#F6F0E9] to-[#F6F0E9] border-t border-[#0B3B2E]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B58] font-semibold">
                Online Reservation · Instant Confirmation
              </p>
              <h2
                className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E]"
                style={{ textWrap: 'balance' }}
              >
                Reserve your{' '}
                <span className="text-[#3F6B58] italic font-normal">
                  sanctuary moment.
                </span>
              </h2>
              <p className="text-sm text-[#0B3B2E]/75">
                Choose your treatment, pick a time window over the next 14 days,
                and receive an instant calendar pass.
              </p>
            </div>

            <BookingFlow
              selectedServiceIds={selectedServiceIds}
              onToggleServiceId={handleToggleServiceId}
              selectedLocationId={selectedLocationId}
              onSelectLocationId={setSelectedLocationId}
              existingBookings={bookings}
              onBookingCreated={handleBookingCreated}
              onCancelBooking={(id) =>
                handleUpdateBookingStatus(id, 'cancelled')
              }
            />
          </div>
        </section>

        {/* 4. GALLERY SECTION (Masonry Grid with Hover Zoom) */}
        <section
          id="gallery"
          className="py-16 sm:py-24 border-t border-[#0B3B2E]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B58] font-semibold">
                  The Lookbook · @happynailskingston
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E]">
                  Crafted with{' '}
                  <span className="text-[#3F6B58] italic font-normal">
                    quiet precision.
                  </span>
                </h2>
              </div>

              {/* Interactive Filter Controls */}
              <div
                className="flex flex-wrap items-center gap-1.5 bg-white/70 p-1.5 rounded-full border border-[#0B3B2E]/10"
                role="tablist"
                aria-label="Filter nail gallery"
              >
                {(
                  [
                    'All',
                    'Gel & BIAB',
                    'Extensions',
                    'Nail Art',
                    'Botanical Spa',
                  ] as const
                ).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    role="tab"
                    aria-selected={galleryFilter === tag}
                    onClick={() => setGalleryFilter(tag)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      galleryFilter === tag
                        ? 'bg-[#0B3B2E] text-[#F6F0E9]'
                        : 'text-[#0B3B2E]/75 hover:text-[#0B3B2E]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filteredGallery.map((item) => (
                <figure
                  key={item.id}
                  className="group relative rounded-3xl overflow-hidden bg-white interactive-panel border border-white/95"
                >
                  <div
                    className={`relative w-full ${item.aspectClass} overflow-hidden bg-[#E9C9BE]/35`}
                  >
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B2E]/75 via-[#0B3B2E]/15 to-transparent" />

                    <figcaption className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between gap-4 text-[#F6F0E9]">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#E9C9BE]">
                          {item.tag} · By {item.artist}
                        </p>
                        <h3 className="font-serif text-2xl font-semibold mt-0.5">
                          {item.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBookServiceClick(item.serviceId)}
                        className="px-3.5 py-2 rounded-full bg-[#F6F0E9] text-[#0B3B2E] text-xs font-medium hover:bg-[#E9C9BE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Book ↗
                      </button>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>

            {/* Client Testimonials & Social Proof Carousel */}
            <TestimonialsCarousel onBookService={handleBookServiceClick} />
          </div>
        </section>

        {/* 5. LOCATIONS SECTION (Multi-location data structure) */}
        <section
          id="locations"
          className="py-16 sm:py-24 border-t border-[#0B3B2E]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-[#3F6B58] font-semibold">
                  Visit Us · South West London
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#0B3B2E]">
                  Our{' '}
                  <span className="text-[#3F6B58] italic font-normal">
                    Sanctuaries.
                  </span>
                </h2>
              </div>

              {/* Multi-Location Selector Tabs */}
              <div
                className="flex items-center gap-2 bg-white/75 p-1.5 rounded-full border border-[#0B3B2E]/10 self-start md:self-auto"
                role="tablist"
                aria-label="Select salon location"
              >
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    role="tab"
                    aria-selected={activeLocationCard.id === loc.id}
                    onClick={() => setActiveLocationTabId(loc.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      activeLocationCard.id === loc.id
                        ? 'bg-[#0B3B2E] text-[#F6F0E9] shadow-sm'
                        : 'text-[#0B3B2E]/75 hover:text-[#0B3B2E]'
                    }`}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Location Featured Card + Multi-location Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 frosted-card interactive-panel rounded-3xl p-6 sm:p-10 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-[#3F6B58] font-semibold">
                      {activeLocationCard.badge}
                    </span>
                    <span className="text-xs text-[#0B3B2E]/70">
                      Walk-ins welcome · Pre-booking recommended
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0B3B2E]">
                      {activeLocationCard.name}
                    </h3>
                    <p className="text-base sm:text-lg text-[#0B3B2E]/85 mt-2 flex items-start gap-2.5">
                      <MapPin className="w-5 h-5 text-[#3F6B58] shrink-0 mt-0.5" />
                      <span>{activeLocationCard.fullAddress}</span>
                    </p>
                    <p className="text-xs text-[#3F6B58] mt-2 pl-7">
                      {activeLocationCard.transitNote}
                    </p>
                  </div>

                  {/* Opening Hours Table */}
                  <div className="pt-4 border-t border-[#0B3B2E]/10 space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.16em] text-[#3F6B58] font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Opening Hours
                    </h4>
                    <dl className="divide-y divide-[#0B3B2E]/10 text-sm">
                      {activeLocationCard.openingHours.map((row) => (
                        <div
                          key={row.days}
                          className="py-2.5 flex items-center justify-between gap-4"
                        >
                          <dt className="text-[#0B3B2E]/80">{row.days}</dt>
                          <dd className="font-medium text-[#0B3B2E] tabular-nums">
                            {row.hours}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Call & Book CTAs */}
                <div className="pt-4 border-t border-[#0B3B2E]/10 flex flex-wrap items-center gap-3.5">
                  <a
                    href={activeLocationCard.phoneHref}
                    className="btn-luxury inline-flex items-center justify-center gap-2 bg-[#0B3B2E] text-[#F6F0E9] hover:bg-[#0B3B2E]/90 px-6 py-3.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="tabular-nums">
                      Call {activeLocationCard.phone}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocationId(activeLocationCard.id);
                      scrollToSection('booking');
                    }}
                    className="btn-luxury inline-flex items-center justify-center gap-2 bg-[#E9C9BE]/75 hover:bg-[#E9C9BE] text-[#0B3B2E] px-6 py-3.5 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Book at {activeLocationCard.name}</span>
                    <span aria-hidden="true">↗</span>
                  </button>

                  <a
                    href={activeLocationCard.mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-medium text-[#3F6B58] hover:text-[#0B3B2E] underline underline-offset-4 whitespace-nowrap shrink-0"
                  >
                    <span>Open in Google Maps</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Sanctuary Card & All Locations Directory */}
              <div className="lg:col-span-5 relative flex flex-col justify-between gap-6">
                {/* Floating Open Badge */}
                <div className="hidden sm:flex items-center gap-2 frosted-pill px-4 py-2 rounded-full absolute -top-3 right-5 z-20 animate-float-slow text-xs font-medium text-[#0B3B2E]">
                  <span className="text-[#3F6B58]">✦</span>
                  <span>Open 7 Days · Walk-ins & Bookings</span>
                </div>

                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-white group">
                  <ResilientImage
                    src={activeLocationCard.imageUrl}
                    alt={`${activeLocationCard.name} interior`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B2E]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-[#F6F0E9]">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#E9C9BE]">
                      {activeLocationCard.postcode}
                    </p>
                    <p className="font-serif text-2xl font-semibold">
                      {activeLocationCard.addressLine1}, {activeLocationCard.city}
                    </p>
                  </div>
                </div>

                {/* All Locations Quick Switcher List */}
                <div className="frosted-card interactive-panel rounded-3xl p-6 space-y-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#3F6B58] font-semibold">
                    All Happy Nails Locations ({LOCATIONS.length})
                  </p>
                  <div className="space-y-2.5">
                    {LOCATIONS.map((loc) => {
                      const isCurrent = loc.id === activeLocationCard.id;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setActiveLocationTabId(loc.id)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isCurrent
                              ? 'bg-white border-[#0B3B2E]/30 shadow-xs'
                              : 'bg-white/50 hover:bg-white/80 border-transparent'
                          }`}
                        >
                          <div>
                            <p className="font-serif text-lg font-semibold text-[#0B3B2E]">
                              {loc.name}
                            </p>
                            <p className="text-xs text-[#0B3B2E]/70">
                              {loc.fullAddress}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-[#3F6B58] whitespace-nowrap">
                            {isCurrent ? 'Viewing ✦' : 'View →'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="bg-[#0B3B2E] text-[#F6F0E9] py-14 sm:py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#F6F0E9]/15">
            <div className="md:col-span-5 space-y-3">
              <p className="font-serif text-3xl font-semibold tracking-tight text-[#F6F0E9]">
                Happy Nails{' '}
                <span className="text-[#E9C9BE]/75 text-sm align-middle ml-0.5">
                  ✦
                </span>
              </p>
              <p className="text-sm text-[#E9C9BE] italic font-serif text-lg">
                “A little luxury, made just for you.”
              </p>
              <p className="text-xs text-[#F6F0E9]/70 max-w-sm leading-relaxed">
                39 Richmond Rd, Kingston upon Thames, KT2 5BW · Bespoke nail
                care, HEMA-free builder gels, and restorative botanical spa
                pedicures.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5 text-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9C9BE] font-semibold">
                Explore
              </p>
              <ul className="space-y-2 text-[#F6F0E9]/80">
                <li>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('services');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Treatment Menu
                  </a>
                </li>
                <li>
                  <a
                    href="#booking"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('booking');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Book Online
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('gallery');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Nail Art Lookbook
                  </a>
                </li>
                <li>
                  <a
                    href="#locations"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('locations');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Kingston Salon
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[#E9C9BE] font-semibold">
                Kingston Sanctuary
              </p>
              <p className="text-xs text-[#F6F0E9]/75 leading-relaxed">
                39 Richmond Rd, Kingston upon Thames, KT2 5BW
                <br />
                Tel: 020 8546 8821 · Open 7 days a week
              </p>
              <p className="text-[11px] text-[#F6F0E9]/50 tabular-nums">
                {todaysCount} appointment{todaysCount === 1 ? '' : 's'} scheduled
                for today
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F6F0E9]/65">
            <div className="flex items-center gap-3">
              <p>
                © {new Date().getFullYear()} Happy Nails Kingston upon Thames. All
                rights reserved.
              </p>
              <span aria-hidden="true" className="opacity-30">
                ·
              </span>
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/admin');
                }}
                className="inline-flex items-center gap-1 text-[11px] text-[#F6F0E9]/40 hover:text-[#E9C9BE] transition-colors"
                title="Salon Dashboard (/admin)"
              >
                <Lock className="w-2.5 h-2.5 opacity-70" />
                <span>Admin</span>
              </a>
            </div>
            <p className="text-[#E9C9BE]/90 font-medium tracking-wide">
              A digital experience by Sirenexis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
