"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { trackOrder } from "@/lib/api";

export const dynamic = "force-dynamic";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", desc: "অর্ডার গ্রহণ করা হয়েছে" },
  { key: "confirmed", label: "Confirmed", desc: "অর্ডার নিশ্চিত করা হয়েছে" },
  { key: "processing", label: "Processing", desc: "পণ্য প্রস্তুত করা হচ্ছে" },
  { key: "shipped", label: "On The Way", desc: "ডেলিভারির পথে রয়েছে" },
  { key: "delivered", label: "Delivered", desc: "সফলভাবে ডেলিভারি সম্পন্ন" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("order") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  const fetchTracking = async (searchNum, searchPhone = "") => {
    const cleanNum = searchNum.trim();
    if (!cleanNum) {
      setError("Please enter your Order Number (অর্ডার নম্বর দিন)।");
      return;
    }

    setLoading(true);
    setError("");
    setOrderData(null);

    // Clean phone: ignore if it's placeholder or contains X
    const cleanPhone = searchPhone.trim();
    const effectivePhone = cleanPhone && !cleanPhone.includes("X") && !cleanPhone.includes("x") ? cleanPhone : "";

    try {
      let data;
      try {
        // 1. Primary: Use same-origin Next.js rewrite proxy (eliminates all CORS errors)
        data = await trackOrder(cleanNum, effectivePhone);
      } catch (proxyErr) {
        // 2. Fallback: Direct API call if proxy is not configured or in local dev
        const directBase = (process.env.NEXT_PUBLIC_API_URL || "https://api.lookstudiobd.com/api/v1").replace(/\/$/, "");
        const params = new URLSearchParams();
        if (effectivePhone) {
          params.append("phone", effectivePhone);
        }
        const directUrl = `${directBase}/orders/${encodeURIComponent(cleanNum)}/track?${params.toString()}`;
        const res = await fetch(directUrl, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.message || proxyErr?.message || "Order not found. Please check your Order Number.");
        }
        data = await res.json();
      }

      setOrderData(data);
    } catch (err) {
      const rawMsg = err?.message || "";
      if (
        rawMsg.toLowerCase().includes("failed to fetch") ||
        rawMsg.toLowerCase().includes("networkerror") ||
        rawMsg.toLowerCase().includes("fetch failed")
      ) {
        setError("অর্ডারটি পাওয়া যায়নি অথবা সংযোগে সমস্যা হচ্ছে। আপনার অর্ডার নম্বরটি সঠিক কিনা যাচাই করুন। (Unable to find order. Please verify your Order Number).");
      } else {
        setError(rawMsg || "Order not found. Please check your Order Number.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchTracking(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTracking(orderNumber, phone);
  };

  const getStepStatus = (stepKey, currentStatus) => {
    const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus?.toLowerCase());
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus?.toLowerCase() === "cancelled") {
      return "cancelled";
    }

    if (currentIndex >= stepIndex) {
      return "completed";
    }
    if (currentIndex === stepIndex - 1) {
      return "current";
    }
    return "upcoming";
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 sm:py-16 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5 text-amber-700" />
            Live Delivery Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Track Your Order (অর্ডার ট্র্যাক করুন)
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600">
            Enter your Order ID received via SMS or invoice to track live status and dispatch updates.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200/80 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Order Number (অর্ডার নম্বর) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. LCS-260902-8695"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all uppercase tracking-wide font-mono"
                />
                <Package className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="sm:w-56">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Phone Number (ঐচ্ছিক ফোন নম্বর)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all font-mono"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="sm:self-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Track (খুঁজুন)</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Details Display */}
        {orderData && (
          <div className="space-y-6">
            {/* Top Status Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Order ID:
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-base sm:text-lg">
                      {orderData.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Placed on {orderData.placedAt}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      orderData.status === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : orderData.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {orderData.statusLabel || orderData.status}
                  </span>

                  <a
                    href={`https://api.lookstudiobd.com/orders/${orderData.orderNumber}/invoice/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF Invoice</span>
                  </a>
                </div>
              </div>

              {/* Status Stepper */}
              {orderData.status !== "cancelled" ? (
                <div className="py-8">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-2 relative">
                    {STATUS_STEPS.map((step, idx) => {
                      const state = getStepStatus(step.key, orderData.status);
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              state === "completed"
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                : state === "current"
                                ? "bg-amber-600 text-white ring-4 ring-amber-100"
                                : "bg-stone-100 text-stone-400"
                            }`}
                          >
                            {state === "completed" ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-bold mt-2.5 ${
                              state === "completed" || state === "current"
                                ? "text-stone-900"
                                : "text-stone-400"
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-[10px] text-stone-500 mt-0.5 max-w-[120px]">
                            {step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-red-600 bg-red-50/50 rounded-xl my-4">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <h4 className="font-bold text-sm">Order Cancelled (অর্ডারটি বাতিল করা হয়েছে)</h4>
                  <p className="text-xs text-red-500 mt-1">
                    If you have questions, please reach out to our customer support.
                  </p>
                </div>
              )}

              {/* Courier Consignment Section */}
              {orderData.tracking && orderData.tracking.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        Courier Partner: {orderData.tracking[0].courier || "Assigned Courier"}
                      </h4>
                      <p className="text-xs text-stone-600 font-mono mt-0.5">
                        Tracking Code: <span className="font-bold text-stone-900">{orderData.tracking[0].trackingCode}</span>
                      </p>
                    </div>
                  </div>
                  {orderData.tracking[0].status && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md text-[11px] font-bold">
                      {orderData.tracking[0].status}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Order Details & Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Items List */}
              <div className="md:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80">
                <h3 className="font-bold text-sm text-stone-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-stone-700" />
                  Ordered Items (অর্ডারকৃত পণ্যসমূহ)
                </h3>
                <div className="divide-y divide-stone-100">
                  {orderData.items?.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-stone-200">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-stone-900">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className="text-xs text-stone-500">Variant: {item.variant}</p>
                          )}
                          <p className="text-xs text-stone-600 mt-0.5">
                            ৳{item.price?.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 shrink-0">
                        ৳{item.lineTotal?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal (সাবটোটাল):</span>
                    <span>৳{orderData.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping Fee (ডেলিভারি চার্জ):</span>
                    <span>৳{orderData.shippingTotal?.toLocaleString()}</span>
                  </div>
                  {orderData.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount (ডিসকাউন্ট):</span>
                      <span>-৳{orderData.discountTotal?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-900 font-extrabold text-sm pt-2 border-t border-stone-100">
                    <span>Total Amount (সর্বমোট):</span>
                    <span>৳{orderData.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery & Customer Info */}
              <div className="md:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80">
                  <h3 className="font-bold text-xs text-stone-500 uppercase tracking-wider mb-3">
                    Delivery Address (ডেলিভারি ঠিকানা)
                  </h3>
                  <div className="space-y-1.5 text-xs text-stone-700">
                    <p className="font-bold text-sm text-stone-900">{orderData.customerName}</p>
                    <p className="text-stone-600">{orderData.customerPhone}</p>
                    <p className="flex items-start gap-1.5 pt-1 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{orderData.shippingAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80">
                  <h3 className="font-bold text-xs text-stone-500 uppercase tracking-wider mb-3">
                    Payment Details (পেমেন্ট তথ্য)
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Method:</span>
                      <span className="font-semibold text-stone-900 uppercase">
                        {orderData.paymentMethod || "Cash on Delivery"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Payment Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          orderData.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {orderData.paymentStatus || "Unpaid"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Need Help Card */}
                <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-sm mb-1">Need Assistance? (সাহায্য প্রয়োজন?)</h4>
                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    Our customer support is available daily from 9:00 AM to 9:00 PM.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Contact Support</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 py-12 sm:py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
