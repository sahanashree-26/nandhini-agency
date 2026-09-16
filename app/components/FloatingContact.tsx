"use client";

const PHONE_NUMBER = "9444486856"

const WHATSAPP_MESSAGE =
  "Hi, I would like to enquire about products from Nandhini Agency.";

export default function FloatingContact() {
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={`tel:+${PHONE_NUMBER}`}
        className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
        aria-label="Call Nandhini Agency"
      >
        <span>📞</span>
        <span>Call</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700"
        aria-label="Contact Nandhini Agency on WhatsApp"
      >
        <span>💬</span>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}