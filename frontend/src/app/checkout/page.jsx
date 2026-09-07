"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, Plus, Minus, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { formatTk } from "@/config/site";
import { placeOrder, validateCoupon } from "@/lib/api";

export default function CheckoutPage() {
  const { cart = [], updateQuantity, removeFromCart, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Zones come from the admin panel, so rates are never hard-coded here.
  const [zones, setZones] = useState([]);
  const [shippingArea, setShippingArea] = useState("inside-dhaka");
  const [submitting, setSubmitting] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    orderNote: "",
    saveInfo: false,
  });

  useEffect(() => {
    setIsMounted(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/site/config`)
      .then((r) => r.json())
      .then((config) => {
        const list = config?.shippingZones ?? [];
        setZones(list);
        if (list.length) setShippingArea(list[0].id);
      })
      .catch(() => setZones([]));
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  // Same helper the cart page uses, so the two totals can never drift apart.
  const activeZone = zones.find((z) => z.id === shippingArea);
  const baseShippingCost =
    activeZone?.freeAbove && subtotal >= activeZone.freeAbove
      ? 0
      : activeZone?.cost ?? 0;

  const shippingCost = appliedCoupon?.free_shipping ? 0 : baseShippingCost;
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - couponDiscount + (cart.length > 0 ? shippingCost : 0));

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    try {
      const res = await validateCoupon(couponInput.trim(), subtotal);
      setAppliedCoupon(res);
      toast.success(res.message || "Coupon applied successfully!");
    } catch (err) {
      toast.error(err?.body?.message || err.message || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Coupon removed.");
  };

  if (!isMounted) {
    return <div className="min-h-screen" aria-hidden="true" />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * The server recalculates every price from the database, so this only sends
   * ids and quantities — the totals shown above are display-only.
   */
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.address || !formData.phone) {
      toast.error("Please fill in all required billing details!");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setSubmitting(true);

    try {
      const response = await placeOrder({
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        shipping_zone: shippingArea,
        order_note: formData.orderNote || null,
        coupon_code: appliedCoupon?.code || null,
        items: cart.map((item) => {
          let productId = item.productId ? Number(item.productId) : null;
          let variantId = item.variantId ? Number(item.variantId) : null;

          if (!productId && item.id) {
            const match = String(item.id).match(/^(\d+)(?:-v(\d+))?$/);
            if (match) {
              productId = Number(match[1]);
              if (!variantId && match[2]) variantId = Number(match[2]);
            } else {
              const parsed = parseInt(String(item.id), 10);
              if (!isNaN(parsed)) productId = parsed;
            }
          }

          return {
            product_id: Number(productId),
            variant_id: variantId ? Number(variantId) : null,
            quantity: Math.max(1, Number(item.quantity) || 1),
          };
        }),
      });

      // Hand the server's authoritative order to the thank-you page.
      sessionStorage.setItem("lastOrder", JSON.stringify(response.order));

      toast.success("Order placed successfully!");
      clearCart?.();
      router.push("/thank-you");
    } catch (error) {
      toast.error(
        error?.body?.message || error.message || "Could not place the order."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 sm:py-16">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Billing Details */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <span className="w-1.5 h-7 bg-primary rounded-full shrink-0" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Billing Details
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Your Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House/Road/Area, City"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Your Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Order Note / Additional Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="orderNote"
                  rows={2}
                  value={formData.orderNote}
                  onChange={handleInputChange}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                />
                <label htmlFor="saveInfo" className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none">
                  Save this information for faster check-out
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary & Shipping */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
              Your Order
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Your cart is empty. <Link href="/" className="text-primary font-semibold underline">Shop Now</Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const itemPriceNumber = typeof item.price === "string" 
                    ? parseFloat(item.price.replace(/,/g, "")) 
                    : Number(item.price);

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-50 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                          <Image src={item.image} alt={item.name} fill
              sizes="64px" className="object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold text-gray-900 w-4 text-center">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                          ৳ {(itemPriceNumber * (item.quantity || 1)).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Shipping Area Selector — driven by the admin panel */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Shipping Area:
              </label>
              <div className="space-y-2">
                {zones.length === 0 && (
                  <p className="text-xs text-gray-400">Loading delivery options…</p>
                )}
                {zones.map((zone) => (
                  <label
                    key={zone.id}
                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="shippingArea"
                      checked={shippingArea === zone.id}
                      onChange={() => setShippingArea(zone.id)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary cursor-pointer"
                    />
                    <span>
                      {zone.label} (<span className="font-bold">{formatTk(zone.cost)}</span>)
                      {zone.note && (
                        <span className="text-gray-400 ml-1">— {zone.note}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Promo / Coupon Code
                </label>
                {appliedCoupon && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    ✓ Applied
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div>
                    <div className="text-xs font-black text-emerald-800 tracking-wider font-mono">
                      {appliedCoupon.code}
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">
                      {appliedCoupon.free_shipping
                        ? "Free Delivery Applied"
                        : `৳${appliedCoupon.discount} Discount Applied`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer px-2 py-1 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. EID2026)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-mono uppercase focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {couponLoading ? "Applying…" : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">{formatTk(subtotal)}</span>
              </div>
              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span className="font-bold">- {formatTk(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Shipping:</span>
                <span className="font-bold text-gray-900">
                  {appliedCoupon?.free_shipping ? (
                    <span className="text-emerald-600">Free (Coupon)</span>
                  ) : (
                    formatTk(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-black text-gray-900 pt-3 border-t border-gray-100">
                <span>Total:</span>
                <span className="text-primary">{formatTk(total)}</span>
              </div>
            </div>

            {/* Order Now Button */}
            <button
              type="submit"
              disabled={submitting}
              disabled={cart.length === 0}
              className="w-full bg-primary text-white hover:opacity-90 font-bold py-4 rounded-2xl shadow-sm transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5" /> Order Now
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}