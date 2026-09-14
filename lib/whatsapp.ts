// ─── WhatsApp Deep-Link Utility ──────────────────────────────────────────────

const DEFAULT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

export interface WhatsAppLinkOptions {
  phone?: string;
  packageName?: string;
  message?: string;
}

/**
 * Builds a wa.me deep link pre-filled with a travel enquiry message.
 * The message is URL-encoded and ready for use in href attributes.
 */
export function buildWhatsAppUrl({
  phone = DEFAULT_PHONE,
  packageName,
  message,
}: WhatsAppLinkOptions = {}): string {
  let text: string;

  if (message) {
    text = message;
  } else if (packageName) {
    text = `Hi! I'm interested in the *${packageName}* package. Could you please share more details about availability and pricing? Thank you! 🌍`;
  } else {
    text = `Hi! I'd like to enquire about your holiday packages. Could you help me plan my trip? 🌍`;
  }

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Builds a WhatsApp click-tracking URL that logs the event before redirecting.
 * Used on the package detail page CTA buttons.
 */
export function buildWhatsAppUrlWithSource(
  options: WhatsAppLinkOptions & { source?: string }
): string {
  return buildWhatsAppUrl(options);
}
