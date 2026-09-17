import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — ENJOY Holidays",
  description:
    "Read how ENJOY Holidays collects, uses, and safeguards your personal information when booking tours and travel experiences.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 16, 2026";

  return (
    <>
      {/* Header */}
      <section
        className="pt-36 pb-14 grain-overlay"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="privacy-heading"
      >
        <div className="container-site max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ Legal & Privacy</span>
          <h1 id="privacy-heading" className="display-xl text-white mb-3">
            Privacy <span className="italic text-[var(--color-secondary-light)]">Policy</span>
          </h1>
          <p className="body-md text-white/70">
            Last updated: {lastUpdated}. Your privacy and data confidentiality are of paramount importance to us.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container-site py-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--color-border)] shadow-sm space-y-10 text-[var(--color-text-secondary)]">
          {/* Section 1 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                1. Information We Collect
              </h2>
            </div>
            <p className="body-md leading-relaxed mb-4">
              When you interact with ENJOY Holidays — whether via our website enquiry forms, WhatsApp conversations, email, or telephone — we may collect personal details necessary to plan and deliver your travel itinerary:
            </p>
            <ul className="list-disc pl-6 space-y-2 body-md">
              <li><strong>Contact Information:</strong> Full name, mobile/WhatsApp telephone number, email address, and city of origin.</li>
              <li><strong>Travel Preferences:</strong> Destination choices, duration, number of passengers (pax), dates of travel, accommodation preferences, and dietary requirements.</li>
              <li><strong>Verification Details:</strong> Identification documents (e.g. Aadhaar, Passport) strictly as required by local authorities, hotels, houseboat operators, or forest department checkpoints.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="body-md leading-relaxed mb-4">
              Your details are used solely to deliver premium holiday experiences and responsive customer service:
            </p>
            <ul className="list-disc pl-6 space-y-2 body-md">
              <li>To prepare customized itineraries, quotes, and travel confirmations.</li>
              <li>To book reserved accommodations, chauffeurs, private boat rentals, and state permits on your behalf.</li>
              <li>To provide customer support before, during, and after your trip.</li>
              <li>To communicate important updates regarding weather, road status, or local travel advisory changes.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <Eye size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                3. Information Sharing & Third Parties
              </h2>
            </div>
            <p className="body-md leading-relaxed mb-3">
              We do <strong>not</strong> sell, rent, or trade your personal information to marketing brokers or third-party advertisers. Your information is shared only with:
            </p>
            <ul className="list-disc pl-6 space-y-2 body-md">
              <li>Direct travel partners (such as verified resort homestays, licensed drivers, and certified local guides) strictly for executing your itinerary.</li>
              <li>Regulatory or government authorities if mandated by law or security regulations.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                4. Data Security & Storage
              </h2>
            </div>
            <p className="body-md leading-relaxed mb-4">
              All inquiries and transactions are handled using encrypted industry-standard protocols (HTTPS/TLS) and secure database facilities. We maintain physical, electronic, and managerial safeguards to protect your records against unauthorized access, alteration, or disclosure.
            </p>
          </div>

          {/* Section 5 */}
          <div className="pt-6 border-t border-[var(--color-border)]">
            <h2 className="text-lg font-serif font-bold text-[var(--color-text-primary)] mb-2">
              5. Contact Our Privacy Team
            </h2>
            <p className="body-md leading-relaxed mb-4">
              If you have any questions regarding this Privacy Policy, wish to update your contact preferences, or request data deletion, please reach out to us:
            </p>
            <div className="bg-[var(--color-surface-alt)] p-4 rounded-xl text-sm space-y-1">
              <p><strong>ENJOY Holidays</strong></p>
              <p>Email: <a href="mailto:hello@enjoyholidays.in" className="text-[var(--color-primary)] underline">hello@enjoyholidays.in</a></p>
              <p>Phone: +91 99999 99999</p>
              <p>Address: 123 Travel Lane, Kochi, Kerala — 682001</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
