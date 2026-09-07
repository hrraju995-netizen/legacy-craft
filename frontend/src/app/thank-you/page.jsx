"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShoppingBag, ArrowRight, Download, MapPin, Phone, User, Calendar } from "lucide-react";

export default function ThankYouPage() {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-3xl flex items-center justify-center mb-5 border border-gray-100">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Order Found</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-sm">
          It looks like you have not placed any order yet or the session has expired.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-2xl font-semibold transition-all shadow-sm"
        >
          Go to Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs text-center mb-8 relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            Order Confirmed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            We have received your order and will begin processing it right away. A confirmation text or call will be made shortly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="text-gray-400">Order ID:</span> 
              <span className="text-gray-900 font-bold bg-gray-100 px-2.5 py-1 rounded-lg">{orderData.orderNumber}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{orderData.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Customer & Shipping Info */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Customer Information
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-400 font-medium mb-0.5">Full Name</p>
                <p className="font-bold text-gray-900">
                  {orderData.customer?.fullName || orderData.customer_name || "Valued Customer"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-medium mb-0.5">Phone Number</p>
                <p className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  {orderData.customer?.phone || orderData.customer_phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-medium mb-0.5">Delivery Address</p>
                <p className="font-bold text-gray-900 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {orderData.customer?.address || orderData.shipping_address || "Dhaka, Bangladesh"}
                </p>
              </div>

              {(orderData.customer?.orderNote || orderData.order_note) && (
                <div>
                  <p className="text-gray-400 font-medium mb-0.5">Order Note</p>
                  <p className="italic text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {orderData.customer?.orderNote || orderData.order_note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" /> Order Items ({orderData.items.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {orderData.items.map((item) => {
                const itemPrice = Number(item.price) || 0;
                const lineTotal = Number(item.lineTotal) || itemPrice * (item.quantity || 1);
                return (
                  <div key={`${item.name}-${item.variant ?? ""}`} className="flex items-center justify-between gap-3 pb-3 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill
              sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity || 1} × ৳{itemPrice.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-gray-900 shrink-0">
                      ৳{lineTotal.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">৳{orderData.subtotal.toLocaleString()}</span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-bold">-৳{orderData.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">
                  {orderData.shipping > 0 ? `৳${orderData.shipping.toLocaleString()}` : "Free"}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-sm sm:text-base font-bold text-gray-900">Total Paid (Cash on Delivery)</span>
                <span className="text-lg sm:text-xl font-black text-primary">৳{orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`http://127.0.0.1:8000/orders/${orderData.orderNumber || orderData.id || "latest"}/invoice/download`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-black text-white px-7 py-3.5 rounded-2xl font-semibold transition-all cursor-pointer text-sm shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4" /> Download Invoice (PDF)
          </a>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-2xl font-semibold transition-all cursor-pointer text-sm shadow-sm"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}