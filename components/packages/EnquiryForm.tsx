"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitEnquiry } from "@/app/actions/submitEnquiry";
import { CheckCircle, Loader2, Send } from "lucide-react";

interface EnquiryFormProps {
  packageId?: string;
  packageName?: string;
  className?: string;
  lightMode?: boolean;
}

export default function EnquiryForm({
  packageId,
  packageName,
  className = "",
  lightMode = false,
}: EnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLight = lightMode || className.includes("!bg-white") || className.includes("bg-white");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitEnquiry({
      name,
      phone,
      email: email || undefined,
      package_id: packageId,
      message: message || undefined,
      source: "form",
      honeypot,
    });

    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-8 text-center flex flex-col items-center gap-4 ${className}`}
        style={
          isLight
            ? { background: "#FFFFFF", border: "1px solid var(--color-border)" }
            : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }
        }
      >
        <CheckCircle size={48} className="text-emerald-500" />
        <div>
          <h3 className={`font-serif text-2xl mb-2 ${isLight ? "text-[var(--color-text-primary)]" : "text-white"}`}>
            Message Received!
          </h3>
          <p className={`text-sm ${isLight ? "text-[var(--color-text-muted)]" : "text-white/70"}`}>
            Thank you {name}! We&apos;ll call you back within 2 hours.{" "}
            {packageName && (
              <span>
                Your enquiry about <strong className={isLight ? "text-[var(--color-primary)]" : "text-white"}>{packageName}</strong> is noted.
              </span>
            )}
          </p>
        </div>
      </motion.div>
    );
  }

  const inputClass = isLight
    ? "w-full px-4 py-3 rounded-xl text-sm bg-[#FAF8F5] border border-[#DBD4C4] text-[#0D1F1C] placeholder-[#718096] focus:outline-none focus:border-[#004741] focus:ring-1 focus:ring-[#004741]/20 transition-all font-medium"
    : "w-full px-4 py-3 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-secondary-light)] focus:bg-white/15 transition-all font-medium";

  const labelClass = isLight
    ? "block text-xs text-[var(--color-text-secondary)] font-bold mb-1.5"
    : "block text-xs text-white/80 font-medium mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl p-6 flex flex-col gap-4 ${className}`}
      style={
        isLight
          ? { background: "#FFFFFF", border: "1px solid var(--color-border)" }
          : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }
      }
      aria-label="Enquiry form"
      noValidate
    >
      <h3 className={`font-serif text-xl mb-1 ${isLight ? "text-[var(--color-text-primary)]" : "text-white"}`}>
        Send an Enquiry
      </h3>
      <p className={`text-xs mb-2 ${isLight ? "text-[var(--color-text-muted)]" : "text-white/60"}`}>
        We&apos;ll call you back within 2 hours.
      </p>

      {/* Name */}
      <div>
        <label htmlFor="enquiry-name" className={labelClass}>
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="enquiry-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya Sharma"
          className={inputClass}
          autoComplete="name"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="enquiry-phone" className={labelClass}>
          Mobile Number <span className="text-red-400">*</span>
        </label>
        <input
          id="enquiry-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          className={inputClass}
          autoComplete="tel"
          maxLength={10}
          pattern="[0-9]{10}"
        />
      </div>

      {/* Email (optional) */}
      <div>
        <label htmlFor="enquiry-email" className={labelClass}>
          Email <span className={isLight ? "text-gray-400 font-normal" : "text-white/40 font-normal"}>(optional)</span>
        </label>
        <input
          id="enquiry-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={inputClass}
          autoComplete="email"
        />
      </div>

      {/* Package pre-fill (hidden if from package page) */}
      {!packageId && (
        <div>
          <label htmlFor="enquiry-msg" className={labelClass}>
            Your message
          </label>
          <textarea
            id="enquiry-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your travel plans, dates, group size..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      )}

      {packageId && (
        <input type="hidden" name="package_id" value={packageId} />
      )}

      {/* Honeypot field for bot spam trap */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">Leave blank</label>
        <input
          id="website_url"
          type="text"
          name="website_url"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-xs px-1"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading || !name.trim() || !phone.trim()}
        className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
        }}
        id="enquiry-submit-btn"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Sending...</>
        ) : (
          <><Send size={15} /> Send Enquiry</>
        )}
      </button>
    </form>
  );
}
