"use client";

import Link from "next/link";
import Script from "next/script";
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

type CustomerDetails = {
  name: string;
  phone: string;
  pickupTime: string;
  pickupTimeLabel?: string;
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
    emi?: boolean;
    paylater?: boolean;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

const CART_STORAGE_KEY = "nandhini-agency-cart";
const CUSTOMER_STORAGE_KEY = "nandhini-agency-customer";
const ORDER_STORAGE_KEY = "nandhini-agency-last-order";

const API_BASE_URL = "http://127.0.0.1:8000";

function formatMoney(value: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function createOrderId() {
  return `NA${Date.now().toString().slice(-10)}`;
}

export default function PaymentPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");

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
        setCustomer(parsedCustomer);
      }
    } catch {
      setError(
        "Unable to load payment details. Please return to checkout.",
      );
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

  const handlePayNow = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!customer) {
      setError(
        "Customer details are missing. Please return to checkout.",
      );
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (cartTotal <= 0) {
      setError("Invalid cart amount.");
      return;
    }

    if (!window.Razorpay) {
      setError(
        "Razorpay is still loading. Please wait a moment and try again.",
      );
      return;
    }

    try {
      setProcessing(true);

      /*
       * STEP 1
       * Ask our FastAPI backend to create a Razorpay order.
       */
      const response = await fetch(
        `${API_BASE_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: cartTotal,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Unable to create Razorpay order.",
        );
      }

      const orderData = await response.json();

      /*
       * STEP 2
       * Open Razorpay Checkout.
       *
       * Only UPI is enabled.
       */
      const razorpayOptions: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nandhini Agency",
        description: "Nandhini Agency Order",
        order_id: orderData.order_id,

        prefill: {
          name: customer.name,
          contact: `+91${customer.phone}`,
        },

        theme: {
          color: "#ea580c",
        },

        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },

        handler: (paymentResponse) => {
          /*
           * Payment completed successfully in Razorpay.
           */

          const localOrderId = createOrderId();

          const orderDataForStorage = {
            orderId: localOrderId,

            razorpayOrderId:
              paymentResponse.razorpay_order_id,

            razorpayPaymentId:
              paymentResponse.razorpay_payment_id,

            razorpaySignature:
              paymentResponse.razorpay_signature,

            customer,

            cart,

            total: cartTotal,

            paymentMethod: "UPI",

            paymentStatus: "Paid",

            orderStatus: "Order Confirmed",

            createdAt: new Date().toISOString(),
          };

          localStorage.setItem(
            ORDER_STORAGE_KEY,
            JSON.stringify(orderDataForStorage),
          );

          localStorage.removeItem(CART_STORAGE_KEY);

          setCreatedOrderId(localOrderId);
          setProcessing(false);
          setShowSuccessPopup(true);
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(
        razorpayOptions,
      );

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);

      setProcessing(false);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again.",
      );
    }
  };

  const goToTrackOrder = () => {
    setShowSuccessPopup(false);
    router.push("/track-order");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7f0]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />

          <p className="mt-4 font-bold text-[#746b61]">
            Loading payment page...
          </p>
        </div>
      </main>
    );
  }

  if (!customer || cart.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7f0] px-5">
        <div className="w-full max-w-lg rounded-[2rem] border border-[#ece5d8] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-5xl">
            ⚠️
          </div>

          <h1 className="mt-6 text-2xl font-black">
            Payment details are missing
          </h1>

          <p className="mt-3 leading-7 text-[#746b61]">
            Please return to checkout and enter your
            customer and pickup details.
          </p>

          <Link
            href="/checkout"
            className="mt-6 inline-flex rounded-full bg-orange-600 px-7 py-3.5 font-black text-white transition hover:bg-orange-700"
          >
            Return to Checkout
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-[#fbf7f0] text-[#26221d]">

        {/* PAYMENT SUCCESS POPUP */}

        {showSuccessPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#26221d]/70 px-5 backdrop-blur-md">
            <div className="w-full max-w-md animate-[fadeIn_.3s_ease-out] rounded-[2rem] bg-white p-8 text-center shadow-2xl">

              <div className="mx-auto flex h-24 w-24 animate-[pulse_1.5s_ease-in-out] items-center justify-center rounded-full bg-green-100 text-5xl">
                ✓
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.15em] text-green-600">
                Payment Successful
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Order Confirmed 🎉
              </h2>

              <p className="mt-4 leading-7 text-[#746b61]">
                Your UPI payment has been completed and
                your order is confirmed.
              </p>

              <div className="mt-6 rounded-2xl bg-[#fff7ed] p-5">
                <p className="text-xs font-black uppercase tracking-wider text-[#8a8177]">
                  Order ID
                </p>

                <p className="mt-2 text-xl font-black text-orange-600">
                  {createdOrderId}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4">
                  <span className="text-sm text-[#746b61]">
                    Amount Paid
                  </span>

                  <span className="font-black">
                    ₹{formatMoney(cartTotal)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-[#746b61]">
                    Pickup Time
                  </span>

                  <span className="font-black">
                    {customer.pickupTimeLabel ||
                      customer.pickupTime}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={goToTrackOrder}
                className="mt-7 w-full rounded-full bg-orange-600 px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-700"
              >
                Track My Order →
              </button>

              <p className="mt-4 text-xs text-[#8a8177]">
                You can see your order status from the
                Track Order page.
              </p>
            </div>
          </div>
        )}

        {/* PROCESSING */}

        {processing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#26221d]/70 px-5 backdrop-blur-md">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">

              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />

              <h2 className="mt-6 text-2xl font-black">
                Connecting to Razorpay
              </h2>

              <p className="mt-3 leading-7 text-[#746b61]">
                Please wait while we prepare your secure
                UPI payment.
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-orange-100">
                <div className="h-full w-full animate-pulse rounded-full bg-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}

        <header className="border-b border-[#e8dfd2] bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-black text-white shadow-lg shadow-orange-200">
                N
              </div>

              <div>
                <p className="font-extrabold">
                  Nandhini Agency
                </p>

                <p className="text-xs text-[#8a8177]">
                  Secure UPI Payment
                </p>
              </div>
            </Link>

            <Link
              href="/checkout"
              className="rounded-full border border-[#ddd4c7] bg-white px-5 py-2.5 text-sm font-bold transition hover:border-orange-300 hover:text-orange-600"
            >
              ← Back to Checkout
            </Link>
          </div>
        </header>

        {/* CONTENT */}

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">

          <div className="mb-8">

            <p className="text-sm font-black uppercase tracking-[0.15em] text-orange-600">
              Step 2 of 2
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Complete your payment
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-[#746b61]">
              Pay securely using UPI through Razorpay.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

            {/* PAYMENT */}

            <form
              onSubmit={handlePayNow}
              className="rounded-[2rem] border border-[#ece5d8] bg-white p-6 shadow-sm sm:p-8"
            >

              <h2 className="text-2xl font-black">
                Payment method
              </h2>

              {/* ONLY UPI */}

              <div className="mt-6 rounded-[1.5rem] border-2 border-orange-500 bg-orange-50 p-6 ring-4 ring-orange-100">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      📱
                    </div>

                    <div>
                      <p className="text-lg font-black">
                        UPI Payment
                      </p>

                      <p className="mt-1 text-sm text-[#746b61]">
                        Google Pay · PhonePe · Paytm · BHIM
                      </p>
                    </div>

                  </div>

                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-sm text-white">
                    ✓
                  </div>

                </div>

                <div className="mt-6 rounded-2xl bg-white p-4">

                  <div className="flex items-center gap-3">

                    <span className="text-xl">
                      🔒
                    </span>

                    <div>
                      <p className="font-black">
                        Secure UPI Checkout
                      </p>

                      <p className="mt-1 text-xs text-[#8a8177]">
                        You will be redirected to Razorpay
                        to complete your UPI payment.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="mt-8 w-full rounded-full bg-orange-600 px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Pay ₹{formatMoney(cartTotal)} with UPI →
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#8a8177]">
                🔒 Secure payment powered by Razorpay Test
                Mode.
              </p>

            </form>

            {/* RIGHT SIDE */}

            <aside className="h-fit space-y-6 lg:sticky lg:top-8">

              {/* CUSTOMER */}

              <div className="rounded-[2rem] border border-[#ece5d8] bg-white p-6 shadow-sm">

                <p className="text-xs font-black uppercase tracking-[0.15em] text-orange-600">
                  Customer Details
                </p>

                <div className="mt-5 space-y-4 text-sm">

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#8a8177]">
                      Name
                    </span>

                    <span className="text-right font-black">
                      {customer.name}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#8a8177]">
                      Phone
                    </span>

                    <span className="text-right font-black">
                      +91 {customer.phone}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#8a8177]">
                      Pickup Time
                    </span>

                    <span className="text-right font-black">
                      {customer.pickupTimeLabel ||
                        customer.pickupTime}
                    </span>
                  </div>

                </div>
              </div>

              {/* ORDER SUMMARY */}

              <div className="rounded-[2rem] border border-[#ece5d8] bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-orange-600">
                      Order Summary
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Your items
                    </h2>
                  </div>

                  <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-black text-orange-700">
                    {cartCount}{" "}
                    {cartCount === 1 ? "item" : "items"}
                  </span>

                </div>

                <div className="mt-6 max-h-[360px] space-y-4 overflow-y-auto pr-1">

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

                        <p className="line-clamp-2 font-black">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#8a8177]">
                          {item.colour} · Qty{" "}
                          {item.quantity}
                        </p>

                        <p className="mt-2 font-black text-orange-600">
                          ₹
                          {formatMoney(
                            item.price * item.quantity,
                          )}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

                <div className="mt-6 border-t border-[#ece5d8] pt-5">

                  <div className="flex items-center justify-between text-lg font-black">

                    <span>Total</span>

                    <span className="text-2xl text-orange-600">
                      ₹{formatMoney(cartTotal)}
                    </span>

                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#8a8177]">
                    Prepaid UPI order. Collect from the shop
                    at your selected pickup time.
                  </p>

                </div>

              </div>

            </aside>

          </div>

        </section>

      </main>
    </>
  );
}