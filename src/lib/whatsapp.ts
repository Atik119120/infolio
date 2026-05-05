// Shared WhatsApp support config & helper
export const WHATSAPP_NUMBER = "8801950990757"; // international (no +)
export const WHATSAPP_DISPLAY = "+880 1950-990757";

export function whatsappUrl(message?: string): string {
  const text = message?.trim() ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}

export function openWhatsApp(message?: string) {
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}
