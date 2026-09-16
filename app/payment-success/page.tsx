"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderData = {
  orderId: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    pickupTime: string;
    pickupTimeLabel?: string;
  };
};

const ORDER_STORAGE_KEY = "nandhini-agency-last-order";

function formatMoney(value: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getPaymentMethodLabel(method: string) {
  if (method === "upi") return "UPI";
  if (method === "card") return "Card";
  if (method === "netbanking") return "Net Banking";
  return method;
}

export default function PaymentSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);

      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7f0]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
          <p className="mt-4 font-bold text-[#746b61]">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbf7f0] px-5">
        <div className="w-full max-w-lg rounded-[2rem] border border-[#ece5d8] bg-white p-8 text-center shadow-xl">
          <div className="text-5xl">⚠️</div>
          <h1 className="mt-5 text-2xl font-black">
            Order details not found
          </h1>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-orange-600 px-7 py-3.5 font-black text-white"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf7f0] px-5 py-12 text-[#26221d]">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2.5rem] border border-[#ece5d8] bg-white p-7 text-center shadow-[0_25px_80px_rgba(60,45,30,0.12)] sm:p-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
            ✅
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.15em] text-green-700">
            Payment Successful
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Your order is confirmed!
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#746b61]">
            Thank you, {order.customer.name}. Your payment was successful and
            your order is ready to be prepared.
          </p>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl bg-[#fbf7f0] p-5">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a8177]">
                Order ID
              </p>
              <p className="mt-2 text-lg font-black">
                {order.orderId}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fbf7f0] p-5">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a8177]">
                Amount Paid
              </p>
              <p className="mt-2 text-lg font-black text-orange-600">
                ₹{formatMoney(order.total)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fbf7f0] p-5">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a8177]">
                Payment Method
              </p>
              <p className="mt-2 text-lg font-black">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fbf7f0] p-5">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a8177]">
                Pickup Time
              </p>
              <p className="mt-2 text-lg font-black">
                {order.customer.pickupTimeLabel || order.customer.pickupTime}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-left">
            <p className="font-black text-green-800">
              📦 Order Status: {order.orderStatus}
            </p>
            <p className="mt-2 text-sm leading-6 text-green-700">
              Please keep your order ID and show it when collecting your order.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/track-order"
              className="rounded-full bg-orange-600 px-7 py-3.5 font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
            >
              Track Order
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#ddd4c7] bg-white px-7 py-3.5 font-black transition hover:border-orange-300 hover:text-orange-600"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}