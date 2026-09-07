"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MapPin, ArrowRight, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { SHIPPING_OPTIONS, FREE_SHIPPING_THRESHOLD, getShippingCost, formatTk } from "@/config/site";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [shippingLocation, setShippingLocation] = useState("inside"); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prices are normalised to numbers by the store, so no parsing needed here.
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = cart.length > 0 ? getShippingCost(shippingLocation, subtotal) : 0;
  const grandTotal = subtotal + shipping;

  if (!isMounted) {
    return <div className="min-h-[75vh]" aria-hidden="true" />;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="w-24 h-24 bg-gray-50 text-gray-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
          Your cart is currently empty. Click the button below to start shopping.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Shopping Cart
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 ml-4.5 font-normal">
              You have {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-600 font-semibold cursor-pointer transition-all self-start sm:self-auto px-4 py-2 rounded-xl border border-red-100 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Table List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-4 text-center">Price</th>
                    <th className="py-4 px-4 text-center">Quantity</th>
                    <th className="py-4 px-4 text-right">Subtotal</th>
                    <th className="py-4 px-6 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                      
                      {/* Product Info & Image */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 group">
                            <Image
                              src={item.image}
                              sizes="64px"
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <Link
                              href={item.link || "/products"}
                              className="text-sm font-bold text-gray-900 hover:text-primary line-clamp-1 transition-colors cursor-pointer"
                            >
                              {item.name}
                            </Link>
                            {item.subtitle && (
                              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-5 px-4 text-center whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-700">
                          ৳{item.price.toLocaleString()}
                        </span>
                      </td>

                      {/* Quantity Controls */}
                      <td className="py-5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.id, "dec")}
                            disabled={item.quantity <= 1}
                            className={`px-3 py-2 transition-colors cursor-pointer ${
                              item.quantity <= 1
                                ? "opacity-30 cursor-not-allowed text-gray-300"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-900 min-w-[28px] text-center">
                            {String(item.quantity).padStart(2, "0")}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, "inc")}
                            className="px-3 py-2 bg-primary hover:opacity-90 text-white transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-5 px-4 text-right whitespace-nowrap">
                        <span className="text-sm font-black text-gray-900">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </td>

                      {/* Delete Button */}
                      <td className="py-5 px-6 text-center whitespace-nowrap">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-9 h-9 inline-flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100 tracking-tight">
              Order Summary
            </h2>

            {/* Shipping Destination */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Shipping Destination
              </label>

              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() => setShippingLocation("inside")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    shippingLocation === "inside"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      id="inside"
                      checked={shippingLocation === "inside"}
                      onChange={() => setShippingLocation("inside")}
                      className="w-4 h-4 text-primary focus:ring-primary cursor-pointer accent-black"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Inside Dhaka</p>
                      <p className="text-[11px] text-gray-400">Regular Delivery (1-2 days)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {formatTk(SHIPPING_OPTIONS[0].cost)}
                  </span>
                </div>

                <div
                  onClick={() => setShippingLocation("outside")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    shippingLocation === "outside"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      id="outside"
                      checked={shippingLocation === "outside"}
                      onChange={() => setShippingLocation("outside")}
                      className="w-4 h-4 text-primary focus:ring-primary cursor-pointer accent-black"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Outside Dhaka</p>
                      <p className="text-[11px] text-gray-400">Courier Delivery (2-4 days)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {formatTk(SHIPPING_OPTIONS[1].cost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <p className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  Free delivery unlocked on this order.
                </p>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  ৳{shipping.toLocaleString()}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-xl font-black text-gray-900">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout & Shopping Buttons */}
            <div className="space-y-3 pt-2">
              <Link href={'/checkout'} className="w-full bg-primary text-white font-semibold py-3.5 rounded-br-2xl rounded-tl-2xl transition-all duration-300 shadow-sm hover:opacity-90 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 font-semibold py-3.5 rounded-2xl transition-all duration-300 shadow-sm active:scale-95 cursor-pointer text-sm"
              >
                Continue Shopping
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}