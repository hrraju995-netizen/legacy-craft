"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  User, Package, LogOut, Phone, Calendar, ShoppingBag, ArrowRight,
  ShieldCheck, Lock, Eye, EyeOff, Download, CheckCircle2,
  Clock, Truck, ChevronRight, Edit3, Save, AlertCircle, Sparkles, KeyRound, Check
} from "lucide-react";
import { useCustomerAuthStore } from "@/store/useCustomerAuthStore";
import {
  getCustomerProfile,
  logoutCustomer,
  changeCustomerPassword,
  updateCustomerProfile
} from "@/lib/api";

export default function CustomerProfilePage() {
  const router = useRouter();
  const { customer, token, setAuth, clearAuth } = useCustomerAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // orders, security, settings

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Backend Origin for Invoices
  const backendBase = useMemo(() => {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    return rawApiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/v1\/?$/, "").replace(/\/api\/?$/, "");
  }, []);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const data = await getCustomerProfile(token);
      setProfileData(data);
      if (data?.customer) {
        setProfileForm({
          name: data.customer.name || "",
          email: data.customer.email || "",
        });
      }
    } catch (err) {
      if (err.status === 401) {
        clearAuth();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [token, router, clearAuth]);

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutCustomer(token);
      }
    } catch (e) {
      // ignore
    } finally {
      clearAuth();
      toast.info("You have been logged out.");
      router.push("/");
    }
  };

  // Password strength helper
  const pwStrength = useMemo(() => {
    const p = passwordForm.new_password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score += 1;
    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score; // 0 to 4
  }, [passwordForm.new_password]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.new_password.length < 6) {
      toast.error("New password must be at least 6 characters (কমপক্ষে ৬ অক্ষর হতে হবে)।");
      return;
    }

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error("New password confirmation does not match (পাসওয়ার্ড মিলছে না)।");
      return;
    }

    setPwSubmitting(true);
    try {
      const res = await changeCustomerPassword(token, passwordForm);
      toast.success(res?.message || "Password updated successfully (পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে)!");
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to update password. Please check your current password.");
    } finally {
      setPwSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setProfileSubmitting(true);
    try {
      const res = await updateCustomerProfile(token, profileForm);
      toast.success(res?.message || "Profile updated successfully!");
      if (res?.customer) {
        setAuth(res.customer, token);
        setProfileData((prev) => ({
          ...prev,
          customer: { ...prev?.customer, ...res.customer },
        }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  if (!token) {
    return null;
  }

  const currentCustomer = profileData?.customer || customer;
  const orders = profileData?.orders || [];
  const totalSpent = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const activeOrdersCount = orders.filter((o) =>
    ["pending", "confirmed", "processing", "shipped", "ready_to_ship"].includes(o.status?.toLowerCase())
  ).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Executive Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-primary via-[#b36939] to-amber-600 text-white flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-lg shadow-primary/25 ring-4 ring-amber-50">
                {currentCustomer?.name ? currentCustomer.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {currentCustomer?.name || "Valued Customer"}
                </h1>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/70 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-600" /> VIP Member
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {currentCustomer?.phone}
                </span>
                {currentCustomer?.email && (
                  <span className="text-slate-400">• {currentCustomer.email}</span>
                )}
                <span className="text-slate-400">• Member ID: #{currentCustomer?.id || 1}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end relative z-10">
            <Link
              href="/track-order"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-primary hover:border-primary/40 hover:bg-amber-50/40 transition-all shadow-2xs"
            >
              <Truck className="w-4 h-4 text-primary" />
              <span>Track Order</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-primary transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Now</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/40 transition-all cursor-pointer shadow-2xs"
              title="Log out from this device"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-primary/30 transition-all">
            <div className="p-3 bg-amber-50 text-primary rounded-xl shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Orders (মোট অর্ডার)</p>
              <h3 className="text-xl font-bold text-slate-900">{orders.length}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-300 transition-all">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Spent (মোট খরচ)</p>
              <h3 className="text-xl font-bold text-slate-900">৳{totalSpent.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-all">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">In Progress (চলমান অর্ডার)</p>
              <h3 className="text-xl font-bold text-slate-900">{activeOrdersCount}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-stone-300 transition-all">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Security (অ্যাকাউন্ট স্ট্যাটাস)</p>
              <h3 className="text-base font-bold text-emerald-600 flex items-center gap-1">
                Active & Secured
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3.5 relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "orders" ? "text-primary font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3.5 relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "security" ? "text-primary font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Password & Security (পাসওয়ার্ড পরিবর্তন)</span>
            {activeTab === "security" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3.5 relative transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "settings" ? "text-primary font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Profile Settings (প্রোফাইল তথ্য)</span>
            {activeTab === "settings" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: ORDERS LIST */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm border border-slate-200">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-14 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No orders placed yet (কোনো অর্ডার পাওয়া যায়নি)</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Explore our handcrafted furniture catalog and start decorating your home today.
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-block bg-primary text-white text-xs font-semibold px-6 py-3 rounded-xl hover:bg-black transition-all shadow-sm"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const statusStyles = {
                  pending: "bg-amber-50 text-amber-700 border-amber-200",
                  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
                  processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
                  ready_to_ship: "bg-teal-50 text-teal-700 border-teal-200",
                  shipped: "bg-purple-50 text-purple-700 border-purple-200",
                  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  cancelled: "bg-red-50 text-red-700 border-red-200",
                };

                const badge = statusStyles[order.status?.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    {/* Top Row: Order # & Status & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-base text-slate-900">
                            #{order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badge}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {order.createdAt}
                          </span>
                          <span>• {order.itemCount} Item(s)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Live Track Order Button */}
                        <Link
                          href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary hover:text-white text-xs font-semibold transition-all shadow-2xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Order (ট্র্যাক)</span>
                        </Link>

                        {/* Direct PDF Invoice Download Button */}
                        <a
                          href={`${backendBase}/orders/${encodeURIComponent(order.orderNumber)}/invoice/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-semibold transition-all border border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Invoice</span>
                        </a>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                          {item.image && (
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white border border-slate-200/60 shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {item.quantity} × ৳{item.unitPrice.toLocaleString()} {item.variant ? `(${item.variant})` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Row: Total & Payment */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">
                        Payment: <strong className="text-slate-800 uppercase font-semibold">{order.paymentStatus}</strong>
                      </span>
                      <div className="text-right">
                        <span className="text-slate-500 mr-2">Grand Total:</span>
                        <span className="text-base font-extrabold text-primary">
                          ৳{order.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: CHANGE PASSWORD & SECURITY */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-xl">
            <div className="mb-6 flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-primary rounded-2xl shrink-0">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Change Password (পাসওয়ার্ড পরিবর্তন)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার অ্যাকাউন্টের সুরক্ষার জন্য নিয়মিত পাসওয়ার্ড আপডেট করুন এবং শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password (বর্তমান পাসওয়ার্ড) *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    required
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title="Toggle password visibility"
                  >
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password (নতুন পাসওয়ার্ড) *
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title="Toggle password visibility"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {passwordForm.new_password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1.5 h-1.5">
                      <div className={`flex-1 rounded-full ${pwStrength >= 1 ? "bg-red-500" : "bg-slate-200"}`} />
                      <div className={`flex-1 rounded-full ${pwStrength >= 2 ? "bg-amber-500" : "bg-slate-200"}`} />
                      <div className={`flex-1 rounded-full ${pwStrength >= 3 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <div className={`flex-1 rounded-full ${pwStrength >= 4 ? "bg-emerald-600" : "bg-slate-200"}`} />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Strength:{" "}
                      <span className={pwStrength >= 3 ? "text-emerald-600 font-bold" : pwStrength >= 2 ? "text-amber-600 font-bold" : "text-red-500 font-bold"}>
                        {pwStrength >= 3 ? "Strong (শক্তিশালী)" : pwStrength >= 2 ? "Medium (মোটামুটি)" : "Weak (দুর্বল)"}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password (নতুন পাসওয়ার্ড নিশ্চিত করুন) *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    required
                    value={passwordForm.new_password_confirmation}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                    placeholder="Repeat your new password"
                    className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title="Toggle password visibility"
                  >
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checklist */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${passwordForm.new_password.length >= 6 ? "text-emerald-600" : "text-slate-300"}`} />
                  <span>Minimum 6 characters (কমপক্ষে ৬ অক্ষর)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${passwordForm.new_password && passwordForm.new_password === passwordForm.new_password_confirmation ? "text-emerald-600" : "text-slate-300"}`} />
                  <span>Passwords match (দুটো পাসওয়ার্ড একই হতে হবে)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-slate-900 text-white text-sm font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{pwSubmitting ? "Updating Password..." : "Update Password (পাসওয়ার্ড আপডেট করুন)"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PROFILE SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-xl">
            <div className="mb-6 flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-primary rounded-2xl shrink-0">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Personal Information (ব্যক্তিগত তথ্য)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার নাম ও ইমেইল ঠিকানা পরিবর্তন করে সেভ করুন।
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name (পূর্ণ নাম)
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (মোবাইল নম্বর - অপরিবর্তনযোগ্য)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentCustomer?.phone || ""}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 mt-1">ফোন নম্বরের সাথে আপনার সকল অর্ডার সংযুক্ত রয়েছে।</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (ইমেইল ঠিকানা)
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-primary text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSubmitting ? "Saving Changes..." : "Save Profile Details (তথ্য সেভ করুন)"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
