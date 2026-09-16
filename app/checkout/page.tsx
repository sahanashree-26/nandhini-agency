"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: number;
  name: string;
  tamilName?: string | null;
  imageUrl: string;
  price: number;
  colour: string;
  quantity: number;
  stock: number;
};

const CART_STORAGE_KEY = "nandhini-agency-cart";
const CUSTOMER_STORAGE_KEY = "nandhini-agency-customer";
const MIN_PICKUP_TIME = "10:00";
const MAX_PICKUP_TIME = "20:30";

function formatTime(time: string) {
  if (!time) return "";

  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }

      if (savedCustomer) {
        const parsedCustomer = JSON.parse(savedCustomer);
        setName(parsedCustomer.name || "");
        setPhone(parsedCustomer.phone || "");
        setPickupTime(parsedCustomer.pickupTime || "");
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      setError("Unable to read the saved order. Please add the products again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [cart],
  );

  const validateForm = () => {
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanName) {
      return "Please enter your name.";
    }

    if (!/^[A-Za-z\s.'-]{2,50}$/.test(cleanName)) {
      return "Please enter a valid name.";
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!pickupTime) {
      return "Please select a pickup time.";
    }

    if (
      pickupTime < MIN_PICKUP_TIME ||
      pickupTime > MAX_PICKUP_TIME
    ) {
      return "Pickup time must be between 10:00 AM and 8:30 PM.";
    }

    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty. Please add products before checkout.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const customerDetails = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ""),
      pickupTime,
      pickupTimeLabel: formatTime(pickupTime),
    };

    localStorage.setItem(
      CUSTOMER_STORAGE_KEY,
      JSON.stringify(customerDetails),
    );

    router.push("/payment");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7f0]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
          <p className="mt-4 font-bold text-[#746b61]">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7f0] px-5">
        <div className="w-full max-w-lg rounded-[2rem] border border-[#ece5d8] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-5xl">
            🛒
          </div>
          <h1 className="mt-6 text-2xl font-black">Your cart is empty</h1>
          <p className="mt-3 leading-7 text-[#746b61]">
            Add products before entering your pickup details.
          </p>
          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          <Link
            href="/products#shop-products"
            className="mt-6 inline-flex rounded-full bg-orange-600 px-7 py-3.5 font-black text-white transition hover:bg-orange-700"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f0] text-[#26221d]">
      <header className="border-b border-[#e8dfd2] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-black text-white shadow-lg shadow-orange-200">
              N
            </div>
            <div>
              <p className="font-extrabold">Nandhini Agency</p>
              <p className="text-xs text-[#8a8177]">Secure Checkout</p>
            </div>
          </Link>

          <Link
            href="/products#shop-products"
            className="rounded-full border border-[#ddd4c7] bg-white px-5 py-2.5 text-sm font-bold transition hover:border-orange-300 hover:text-orange-600"
          >
            ← Back to Products
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.15em] text-orange-600">
            Step 1 of 2
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Customer and pickup details
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#746b61]">
            Enter your details and choose today&apos;s pickup time between
            10:00 AM and 8:30 PM.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[#ece5d8] bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-black">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                maxLength={50}
                className="mt-2 w-full rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] px-4 py-3.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="phone" className="block text-sm font-black">
                Phone Number
              </label>
              <div className="mt-2 flex overflow-hidden rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                <span className="flex items-center border-r border-[#ddd4c7] px-4 font-bold text-[#746b61]">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  className="w-full bg-transparent px-4 py-3.5 outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="pickupTime"
                className="block text-sm font-black"
              >
                Today&apos;s Pickup Time
              </label>
              <input
                id="pickupTime"
                type="time"
                min={MIN_PICKUP_TIME}
                max={MAX_PICKUP_TIME}
                step="900"
                value={pickupTime}
                onChange={(event) => setPickupTime(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#ddd4c7] bg-[#fffdf9] px-4 py-3.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
              <p className="mt-2 text-sm text-[#8a8177]">
                Available today from 10:00 AM to 8:30 PM.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-orange-600 px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              Continue to Payment →
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#8a8177]">
              Your order will be confirmed only after successful payment.
            </p>
          </form>

          <aside className="h-fit rounded-[2rem] border border-[#ece5d8] bg-white p-6 shadow-sm lg:sticky lg:top-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-orange-600">
                  Order Summary
                </p>
                <h2 className="mt-1 text-2xl font-black">Your items</h2>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-black text-orange-700">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-2xl border border-[#ece5d8] p-3"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fbf7f0] p-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-black">{item.name}</p>
                    <p className="mt-1 text-xs text-[#8a8177]">
                      {item.colour} · Qty {item.quantity}
                    </p>
                    <p className="mt-2 font-black text-orange-600">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#ece5d8] pt-5">
              <div className="flex items-center justify-between text-lg font-black">
                <span>Total</span>
                <span className="text-2xl text-orange-600">
                  ₹{cartTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#8a8177]">
                Prepaid order. Collect from the shop at your selected time.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}