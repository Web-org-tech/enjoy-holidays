import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck, AlertCircle, CreditCard, RotateCcw, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions — ENJOY Holidays",
  description:
    "Review the booking conditions, payment schedules, cancellation guidelines, and operational policies for ENJOY Holidays packages.",
};

export default function TermsPage() {
  const lastUpdated = "September 16, 2026";

  return (
    <>
      {/* Header */}
      <section
        className="pt-36 pb-14 grain-overlay"
        style={{ background: "var(--color-deep-teal)" }}
        aria-labelledby="terms-heading"
      >
        <div className="container-site max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <span className="label text-[var(--color-secondary-light)] mb-3 block">✦ Client Agreement</span>
          <h1 id="terms-heading" className="display-xl text-white mb-3">
            Terms & <span className="italic text-[var(--color-secondary-light)]">Conditions</span>
          </h1>
          <p className="body-md text-white/70">
            Last updated: {lastUpdated}. Please read these terms carefully before confirming your holiday booking with us.
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
                <FileCheck size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                1. Booking & Confirmation
              </h2>
            </div>
            <p className="body-md leading-relaxed mb-4">
              All package itineraries are subject to availability at the time of reservation. A booking is formally confirmed once an initial advance deposit (typically 30% to 50% of the total quote) has been received and verified by our team, and written confirmation has been issued via email or official WhatsApp correspondence.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                2. Pricing, Taxes & Payment Schedules
              </h2>
            </div>
            <ul className="list-disc pl-6 space-y-2 body-md">
              <li>All quoted prices are calculated in Indian Rupees (INR) and include GST unless stated otherwise on special discounted quotations.</li>
              <li>The balance payment is due 14 days prior to departure, or upon arrival at the first destination if explicitly pre-authorized by your dedicated travel manager.</li>
              <li>Peak season surcharges may apply during high-demand windows (such as Diwali, Christmas, New Year, and regional monsoon festivals).</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <RotateCcw size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                3. Cancellation & Refund Policy
              </h2>
            </div>
            <p className="body-md leading-relaxed mb-4">
              We understand plans can change unexpectedly. Cancellations must be notified in writing to <a href="mailto:hello@enjoyholidays.in" className="text-[var(--color-primary)] underline">hello@enjoyholidays.in</a>. Our standard refund structure is as follows:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[var(--color-border)] rounded-xl overflow-hidden mb-4">
                <thead className="bg-[var(--color-surface-alt)] font-bold text-[var(--color-text-primary)]">
                  <tr>
                    <th className="p-3 text-left">Notice Period</th>
                    <th className="p-3 text-left">Cancellation Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  <tr>
                    <td className="p-3">30 or more days before arrival</td>
                    <td className="p-3 font-semibold text-emerald-700">10% processing fee (90% refund)</td>
                  </tr>
                  <tr>
                    <td className="p-3">15 to 29 days before arrival</td>
                    <td className="p-3 font-semibold text-amber-700">30% cancellation fee (70% refund)</td>
                  </tr>
                  <tr>
                    <td className="p-3">7 to 14 days before arrival</td>
                    <td className="p-3 font-semibold text-orange-700">50% cancellation fee (50% refund)</td>
                  </tr>
                  <tr>
                    <td className="p-3">Less than 7 days / No-show</td>
                    <td className="p-3 font-semibold text-red-700">100% (Non-refundable)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-primary)]">
                4. Force Majeure & Unforeseen Events
              </h2>
            </div>
            <p className="body-md leading-relaxed mb-3">
              ENJOY Holidays is not liable for itinerary disruptions, flight cancellations, road blockages, extreme weather conditions, natural disasters, or government restrictions beyond our reasonable control. In such events, our team will work diligently to reschedule your itinerary or provide equivalent credits where possible.
            </p>
          </div>

          {/* Section 5 */}
          <div className="pt-6 border-t border-[var(--color-border)]">
            <h2 className="text-lg font-serif font-bold text-[var(--color-text-primary)] mb-2">
              5. Governing Law & Jurisdiction
            </h2>
            <p className="body-md leading-relaxed mb-4">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Kochi, Kerala.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
