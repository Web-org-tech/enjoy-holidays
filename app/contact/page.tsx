import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, CheckCircle2, Send, Car, Compass } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import EnquiryForm from "@/components/packages/EnquiryForm";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us — PADMA TOURS & TRAVELS (Madurai • 24/7 Service)",
  description:
    "Get in touch with PADMA TOURS & TRAVELS in Madurai. Available 24 hours a day for daily tours, Madurai local sightseeing, cab bookings, and customized holiday packages across India. Call +91 98659 87975 or WhatsApp +91 70101 11256.",
  alternates: {
    canonical: "https://padmatoursandtravels.in/contact",
  },
  openGraph: {
    title: "Contact PADMA TOURS & TRAVELS (Madurai) — 24/7 Support",
    description:
      "Planning a tour, sightseeing, or car rental? Reach us anytime 24/7 via WhatsApp, Phone, or at our Madurai Racecourse Colony office.",
    url: "https://padmatoursandtravels.in/contact",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Padma Tours and Travels Madurai" }],
  },
};

export default function ContactPage() {
  const phone = "+91 98659 87975";
  const whatsappNumber = "917010111256";
  const email = "nirmalharish1980@gmail.com";
  const address = "No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters, Madurai - 625002";
  const waUrl = buildWhatsAppUrl({ phone: whatsappNumber });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact PADMA TOURS & TRAVELS",
    description: "24/7 Travel Agency contact page in Madurai for daily tours, cabs and tour packages.",
    mainEntity: {
      "@type": "TravelAgency",
      name: "PADMA TOURS & TRAVELS",
      telephone: "+91-9865987975",
      email: "nirmalharish1980@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "No: B19/3 Racecourse Colony, Opp. Old Passport Office, Government Quarters",
        addressLocality: "Madurai",
        addressRegion: "Tamil Nadu",
        postalCode: "625002",
        addressCountry: "IN",
      },
      openingHours: "Mo-Su 00:00-24:00",
      sameAs: ["https://wa.me/917010111256"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <section
        className="pt-36 pb-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #073834 0%, #0B4F4A 60%, #155E57 100%)",
        }}
        aria-labelledby="contact-heading"
      >
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        <div className="container-site relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FBBF24] text-xs font-bold uppercase tracking-wider mb-4">
            <Clock size={14} className="animate-spin-slow" />
            <span>24/7 Round-the-Clock Support • Since 2004</span>
          </div>
          <h1 id="contact-heading" className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Let&apos;s Plan Your <span className="italic text-[#FBBF24]">Next Journey</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
            Have a question about Madurai local sightseeing, temple circuits, or custom family holiday packages?
            Our friendly travel team in Madurai is ready to assist you 24 hours a day.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-site py-16 max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Channels & Address */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#D45C33] uppercase tracking-wider block mb-1">
                ✦ Direct Reach
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B4F4A]">
                Speak Directly With Our Travel Experts
              </h2>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* WhatsApp Card */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 group"
                id="contact-whatsapp"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                      Fastest Response
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Online 24/7
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0B4F4A] mt-0.5">
                    WhatsApp Chat &amp; Instant Booking
                  </h3>
                  <p className="text-xs text-[#4B5E59] mt-0.5">
                    +91 70101 11256 • Instant itinerary quotes &amp; vehicle photos
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#25D366] mt-2 group-hover:underline">
                    Chat with us on WhatsApp →
                  </span>
                </div>
              </a>

              {/* Phone Call Card */}
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E1D3] bg-white hover:border-[#D45C33] hover:shadow-lg transition-all duration-300 group"
                id="contact-phone"
              >
                <div
                  className="w-12 h-12 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: "#D45C33" }}
                >
                  <Phone size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D45C33]">
                      Direct Helpline
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                      24 Hours
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0B4F4A] mt-0.5">
                    Call Our Booking Office
                  </h3>
                  <p className="text-xs text-[#4B5E59] mt-0.5">
                    {phone} • Immediate vehicle dispatch &amp; emergency support
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D45C33] mt-2 group-hover:underline">
                    <Phone size={13} /> Call
                  </span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${email}`}
                className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E1D3] bg-white hover:border-[#0B4F4A] hover:shadow-lg transition-all duration-300 group"
                id="contact-email"
              >
                <div
                  className="w-12 h-12 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: "#0B4F4A" }}
                >
                  <Mail size={22} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F4A]">
                    Email Inquiries
                  </span>
                  <h3 className="text-base font-bold text-[#0B4F4A] mt-0.5">
                    Custom Tour &amp; Corporate Quotes
                  </h3>
                  <p className="text-xs text-[#4B5E59] mt-0.5">
                    {email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F4A] mt-2 group-hover:underline">
                    Send an email →
                  </span>
                </div>
              </a>

              {/* Office Address Card */}
              <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#E8E1D3] bg-white shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Madurai Head Office
                  </span>
                  <h3 className="text-base font-bold text-[#0B4F4A] mt-0.5">
                    PADMA TOURS &amp; TRAVELS
                  </h3>
                  <p className="text-xs text-[#4B5E59] mt-1 leading-relaxed">
                    {address}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 size={13} /> Open 24 Hours / 7 Days
                    </span>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Race+Course+Colony+Madurai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#0B4F4A] hover:underline"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="rounded-3xl overflow-hidden border border-[#E8E1D3] shadow-md bg-stone-100 h-64 sm:h-72 relative">
              <iframe
                title="Padma Tours & Travels Madurai Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15720.590124976778!2d78.1345!3d9.9298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c59800000001%3A0x6b4f74d0815a5198!2sRace%20Course%20Colony%2C%20Madurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Column: Online Booking & Enquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D3] shadow-xl sticky top-28">
              <div className="mb-6 pb-4 border-b border-[#F0EBE1]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D45C33]">
                  <Car size={15} />
                  <span>Quick Booking &amp; Custom Quote</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#0B4F4A] mt-1">
                  Send Your Travel Inquiry
                </h2>
                <p className="text-xs text-[#60736F] mt-1">
                  Fill in your travel dates or destinations. We will get back to you with custom options within 15 minutes!
                </p>
              </div>

              {/* Integrated Enquiry Form */}
              <EnquiryForm lightMode={true} />

              <div className="mt-6 pt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#808E8B]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" /> Best Price Guarantee
                </span>
                <span>No Hidden Charges</span>
                <span>Punctual Drivers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
