import type { Metadata } from "next";
import EnquiryForm from "@/components/packages/EnquiryForm";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description:
    "Reach ENJOY Holidays by WhatsApp, phone, or email. We respond within 2 hours. Let us plan your perfect trip.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const contact = settings?.contact_info;
  const phone = contact?.phone ?? "+91 99999 99999";
  const email = contact?.email ?? "hello@enjoyholidays.in";
  const address = contact?.address ?? "Kochi, Kerala";
  const waNumber = contact?.whatsapp_number ?? "919999999999";
  const waUrl = buildWhatsAppUrl({ phone: waNumber });

  return (
    <>
      {/* Header */}
      <section
        className="pt-36 pb-12 grain-overlay"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="contact-page-heading"
      >
        <div className="container-site">
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ Talk to Us</span>
          <h1 id="contact-page-heading" className="display-xl text-white mb-3">
            Let&apos;s Plan Your{" "}
            <span className="italic text-[var(--color-secondary-light)]">Adventure</span>
          </h1>
          <p className="body-lg text-white/70 max-w-xl">
            Got a destination in mind? Drop us a message and we&apos;ll craft your perfect itinerary.
          </p>
        </div>
      </section>

      <div className="container-site py-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="display-md text-[var(--color-text-primary)] mb-6">Get in Touch</h2>

            <div className="flex flex-col gap-5 mb-8">
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-white hover:border-[#25d366] hover:shadow-md transition-all group"
                id="contact-whatsapp-link"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25d366] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5">WhatsApp (Fastest)</div>
                  <div className="text-sm text-[var(--color-text-muted)]">Usually responds within minutes</div>
                  <div className="text-xs text-[#25d366] font-semibold mt-1">Chat now →</div>
                </div>
              </a>

              <a href={`tel:${phone}`}
                className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
                id="contact-phone-link"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: "var(--color-primary)" }}>
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5">Call Us</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{phone}</div>
                  <div className="text-xs text-[var(--color-primary)] font-semibold mt-1">Mon–Sat 9AM–7PM</div>
                </div>
              </a>

              <a href={`mailto:${email}`}
                className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:shadow-md transition-all group"
                id="contact-email-link"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: "var(--color-accent)" }}>
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5">Email</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{email}</div>
                  <div className="text-xs text-[var(--color-accent)] font-semibold mt-1">Response within 4 hours</div>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-white">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-surface-alt)" }}>
                  <MapPin size={20} style={{ color: "var(--color-primary)" }} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5">Office</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{address}</div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden h-48 bg-gray-100 flex items-center justify-center border border-[var(--color-border)]">
              <div className="text-center text-[var(--color-text-muted)] text-sm">
                <MapPin size={24} className="mx-auto mb-2 opacity-40" />
                <p>Map embed</p>
                <p className="text-xs opacity-60">Add Google Maps API key in settings</p>
              </div>
            </div>
          </div>

          {/* Enquiry form */}
          <div>
            <h2 className="display-md text-[var(--color-text-primary)] mb-6">Send an Enquiry</h2>
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <EnquiryForm lightMode={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 md:h-0 block md:hidden" aria-hidden="true" />
    </>
  );
}
