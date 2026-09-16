import Image from "next/image";
import Link from "next/link";

const PHONE_NUMBER = "916380347893";
const DISPLAY_PHONE_NUMBER = "6380347893";

const WHATSAPP_NUMBER = "919444486856";
const DISPLAY_WHATSAPP_NUMBER = "9444486856";

const SHOP_ADDRESS =
  "12/56, Thiruvalluvar Street, MGR Nagar, Chennai - 600078";

const GOOGLE_MAP_LINK =
  "https://share.google/EywqmfcnmJx28wkcK";

const GOOGLE_MAP_EMBED =
  "https://www.google.com/maps?q=12%2F56%2C%20Thiruvalluvar%20Street%2C%20MGR%20Nagar%2C%20Chennai%20-%20600078&output=embed";

const WHATSAPP_MESSAGE =
  "Hi, I would like to enquire about products from Nandhini Agency.";


const orderSteps = [
  {
    number: "01",
    icon: "🛍️",
    title: "Choose Products",
    description:
      "Browse the available household and wholesale plastic products.",
  },
  {
    number: "02",
    icon: "💳",
    title: "Complete Payment",
    description:
      "Pay securely online to confirm your prepaid order.",
  },
  {
    number: "03",
    icon: "📅",
    title: "Schedule Pickup",
    description:
      "Select a date and time that is convenient for you.",
  },
  {
    number: "04",
    icon: "📦",
    title: "Collect Your Order",
    description:
      "Visit the shop at the selected time and collect your order.",
  },
];

const benefits = [
  {
    icon: "₹",
    title: "Wholesale Prices",
    description:
      "Affordable pricing for individual purchases and bulk requirements.",
  },
  {
    icon: "✓",
    title: "Quality Products",
    description:
      "Useful and reliable plastic products selected for everyday needs.",
  },
  {
    icon: "⌚",
    title: "Scheduled Pickup",
    description:
      "Choose your pickup time and avoid unnecessary waiting at the shop.",
  },
  {
    icon: "☎",
    title: "Direct Owner Support",
    description:
      "Talk directly with the owner for product and delivery enquiries.",
  },
];

export default function HomePage() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf7f0] text-[#26221d]">
      {/* Top Information Strip */}
      <div className="bg-[#26221d] text-[#f4eee5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={GOOGLE_MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-orange-300"
            >
              <span>📍</span>
              <span>{SHOP_ADDRESS}</span>
            </a>

            <span className="flex items-center gap-2">
              <span>🕘</span>
              9:00 AM – 9:00 PM
            </span>
          </div>

          <span className="w-fit rounded-full bg-orange-500/15 px-3 py-1 font-semibold text-orange-300">
            Friday Holiday
          </span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#e8dfd2] bg-[#fbf7f0]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-black text-white shadow-lg shadow-orange-200">
              N
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-[#26221d]">
                Nandhini Agency
              </p>

              <p className="text-xs font-medium text-[#8a8177]">
                Wholesale Plastic Products
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#4a443c] lg:flex">
            <a href="#home" className="transition hover:text-orange-600">
              Home
            </a>

            <Link
              href="/products"
              className="transition hover:text-orange-600"
            >
              Products
            </Link>

            <a
              href="#how-to-order"
              className="transition hover:text-orange-600"
            >
              How to Order
            </a>

            <a href="#location" className="transition hover:text-orange-600">
              Location
            </a>
          </nav>

          <div className="hidden lg:block" />
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden pb-16 pt-12 lg:pb-24 lg:pt-20"
      >
        <div className="absolute -left-48 top-20 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          {/* Hero Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Trusted Wholesale Store
            </span>

            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.04em] text-[#26221d] sm:text-5xl lg:text-7xl">
              Wholesale{" "}
              <span className="font-serif italic text-orange-600">
                Plastic Products
              </span>
              , Made Simple.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#625b52] sm:text-lg">
              Affordable household plastic products for homes, shops and
              businesses. Place a prepaid order and collect it at your
              scheduled time.
            </p>

            <div className="mt-9">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-bold text-white shadow-xl shadow-orange-200 transition hover:-translate-y-1 hover:bg-orange-700"
              >
                Shop Products
                <span>→</span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {[
                "Wholesale Price",
                "Quality Products",
                "Scheduled Pickup",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-[#4a443c]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-700">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Owner Hero Visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-8 top-10 hidden h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-white text-4xl shadow-xl lg:flex">
              🪣
            </div>

            <div className="absolute -right-5 top-14 hidden h-16 w-16 items-center justify-center rounded-3xl border border-pink-100 bg-white text-3xl shadow-xl lg:flex">
              🪞
            </div>

            <div className="absolute -left-3 bottom-20 hidden h-16 w-16 items-center justify-center rounded-3xl border border-amber-100 bg-white text-3xl shadow-xl lg:flex">
              🧹
            </div>

            <div className="absolute -right-7 bottom-24 hidden h-16 w-16 items-center justify-center rounded-3xl border border-red-100 bg-white text-3xl shadow-xl lg:flex">
              🥤
            </div>

            <div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-orange-200 via-orange-100 to-amber-50 blur-sm" />

            <div className="relative overflow-hidden rounded-[2.75rem] border border-white/80 bg-white/70 p-3 shadow-[0_35px_100px_rgba(100,64,32,0.2)] backdrop-blur">
              <div className="relative overflow-hidden rounded-[2.25rem] bg-[#e9dfd2]">
                <Image
                  src="/owner.jpeg"
                  alt="Ponraj, owner of Nandhini Agency"
                  width={640}
                  height={720}
                  priority
                  className="h-[420px] w-full object-cover object-top"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#26221d] via-[#26221d]/85 to-transparent px-7 pb-7 pt-24 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
                    Meet the owner
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Ponraj
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-orange-200">
                    Owner, Nandhini Agency
                  </p>

                  <p className="mt-4 max-w-sm font-serif text-lg italic leading-7 text-white/90">
                    “Honest pricing, quality products and direct support
                    for every customer.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Information */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-[#ece5d8] bg-white shadow-[0_20px_60px_rgba(60,45,30,0.08)] md:grid-cols-3">
          <div className="flex gap-4 border-b border-[#ece5d8] p-6 md:border-b-0 md:border-r">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              📍
            </span>

            <div>
              <p className="font-black">Shop Location</p>
              <p className="mt-1 text-sm leading-6 text-[#746b61]">
                12/56, Thiruvalluvar Street, MGR Nagar, Chennai – 600078
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-[#ece5d8] p-6 md:border-b-0 md:border-r">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              🕘
            </span>

            <div>
              <p className="font-black">Working Hours</p>
              <p className="mt-1 text-sm leading-6 text-[#746b61]">
                9:00 AM to 9:00 PM
                <br />
                Friday Holiday
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              📦
            </span>

            <div>
              <p className="font-black">Order Method</p>
              <p className="mt-1 text-sm leading-6 text-[#746b61]">
                Prepaid ordering with scheduled shop pickup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section
        id="how-to-order"
        className="relative overflow-hidden bg-[#26221d] py-24 text-white"
      >
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <span className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
                Simple ordering
              </span>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] sm:text-5xl">
                Order now.
                <span className="block font-serif italic text-orange-400">
                  Collect later.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-8 text-[#c9c2b6]">
                We prepare your order before you arrive. This reduces
                waiting time and makes pickup easier.
              </p>

              <div className="mt-9 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
                <p className="font-black text-orange-300">
                  Need home delivery?
                </p>

                <p className="mt-3 text-sm leading-7 text-[#c9c2b6]">
                  Contact the owner through WhatsApp. Delivery
                  availability and charges depend on the distance from
                  the shop.
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700"
                >
                  💬 WhatsApp Owner
                </a>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {orderSteps.map((step) => (
                <div
                  key={step.number}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-white/[0.09]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{step.icon}</span>

                    <span className="text-4xl font-black text-white/10 transition group-hover:text-orange-400/30">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-black">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#c9c2b6]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
            Why Nandhini Agency?
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-5xl">
            Simple, reliable and personal
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-[2rem] border border-[#ece5d8] bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl font-black text-orange-600">
                {benefit.icon}
              </div>

              <h3 className="mt-6 text-lg font-black">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#746b61]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid overflow-hidden rounded-[2.5rem] border border-[#ece5d8] bg-[#fbf7f0] shadow-[0_30px_90px_rgba(60,45,30,0.12)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                Our shop location
              </span>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-5xl">
                Visit Nandhini Agency
              </h2>

              <p className="mt-5 leading-8 text-[#746b61]">
                Visit the shop during working hours for product
                enquiries or to collect your scheduled order.
              </p>

              <div className="mt-8 rounded-[1.5rem] border border-[#ece5d8] bg-white p-5">
                <div className="flex gap-4">
                  <span className="text-2xl">📍</span>

                  <div>
                    <p className="font-black">Full address</p>

                    <p className="mt-2 text-sm leading-7 text-[#746b61]">
                      12/56,
                      <br />
                      Thiruvalluvar Street,
                      <br />
                      MGR Nagar,
                      <br />
                      Chennai – 600078
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#26221d] p-4 text-white">
                  <p className="text-xs text-white/50">
                    Working hours
                  </p>

                  <p className="mt-1 font-black">
                    9 AM – 9 PM
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-100 p-4">
                  <p className="text-xs text-orange-700">
                    Weekly holiday
                  </p>

                  <p className="mt-1 font-black text-orange-950">
                    Friday
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <a
                  href={GOOGLE_MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1 hover:bg-orange-700"
                >
                  <span>🧭</span>
                  Get Directions
                </a>
              </div>
            </div>

            <div className="min-h-[520px] bg-[#e6dfd4]">
              <iframe
                src={GOOGLE_MAP_EMBED}
                title="Nandhini Agency shop location"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="min-h-[520px] w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-orange-700 px-7 py-14 text-white shadow-2xl shadow-orange-200 sm:px-12 lg:px-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-white/10" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-100">
                Ready to order?
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.03em] sm:text-5xl">
                Browse products and schedule your pickup
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-orange-50">
                Affordable products, direct owner support and a simple
                ordering process.
              </p>
            </div>

            <div>
              <Link
                href="/products"
                className="rounded-full bg-[#26221d] px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#26221d]"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#26221d] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-2xl font-black">
                N
              </div>

              <div>
                <p className="font-black">
                  Nandhini Agency
                </p>

                <p className="text-xs text-white/50">
                  Wholesale Plastic Products
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/55">
              Affordable and useful plastic products for homes, shops
              and businesses.
            </p>
          </div>

          <div>
            <h3 className="font-black">Quick Links</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/55">
              <Link href="/" className="hover:text-orange-400">
                Home
              </Link>

              <Link
                href="/products"
                className="hover:text-orange-400"
              >
                Products
              </Link>

              <a
                href="#how-to-order"
                className="hover:text-orange-400"
              >
                How to Order
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black">Shop Information</h3>

            <div className="mt-5 space-y-3 text-sm leading-6 text-white/55">
              <p>Open: 9:00 AM – 9:00 PM</p>
              <p>Weekly holiday: Friday</p>
              <p>Prepaid scheduled pickup</p>
            </div>
          </div>

          <div>
            <h3 className="font-black">Contact</h3>

            <div className="mt-5 space-y-3 text-sm leading-6 text-white/55">
              <a
                href={`tel:+${PHONE_NUMBER}`}
                className="block hover:text-orange-400"
              >
                📞 {DISPLAY_PHONE_NUMBER}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-green-400"
              >
                💬 {DISPLAY_WHATSAPP_NUMBER}
              </a>

              <p>
                📍 12/56, Thiruvalluvar Street,
                <br />
                MGR Nagar, Chennai – 600078
              </p>

              <a
                href={GOOGLE_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-orange-400 hover:text-orange-300"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-5 text-sm text-white/40 sm:flex-row lg:px-8">
            <p>© 2026 Nandhini Agency. All rights reserved.</p>

            <p>MGR Nagar, Chennai – 600078</p>
          </div>
        </div>
      </footer>

      {/* Floating Contact Buttons */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        <a
          href={`tel:+${PHONE_NUMBER}`}
          aria-label="Call Nandhini Agency"
          className="flex items-center justify-center gap-2 rounded-full bg-[#26221d] px-5 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-600"
        >
          <span>📞</span>
          <span className="hidden sm:inline">Call</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Nandhini Agency"
          className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-green-700"
        >
          <span>💬</span>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </main>
  );
}
