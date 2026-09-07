"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const apiUrl = rawApiUrl.replace(/\/v1\/?$/, "");
    fetch(`${apiUrl}/v1/site/config?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings({
            ...(data.settings.footer || {}),
            ...(data.settings.chat || {}),
            ...(data.settings.general || {}),
          });
        }
      })
      .catch(() => {});
  }, []);

  const address = settings.footer_address || siteConfig.address || "Shop No: 33, Round Glass Bay, Level 5, Mirpur DOHS, Dhaka";
  const phone = settings.phone_number || settings.footer_phone || siteConfig.phone || "+8801897711118";
  const email = settings.email_address || settings.footer_email || siteConfig.email || "support@legacycraftstudio.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    setSubmitting(true);

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const apiUrl = rawApiUrl.replace(/\/v1\/?$/, "");
      const res = await fetch(`${apiUrl}/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message. Please try again.");
      }

      setToast({
        show: true,
        message: "ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।",
        type: "success",
      });
      form.reset();
    } catch (err) {
      setToast({
        show: true,
        message: err.message || "Something went wrong. Please call us directly.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 5000);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 sm:py-16 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium transition-all ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-stone-900 text-white"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-bold tracking-widest uppercase text-xs">
            Contact Us (যোগাযোগ)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-3">
            Let’s Design Your Legacy
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Have questions about our furniture or want to discuss a custom project? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-4 space-y-4">
            {/* Address */}
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-gray-900 shrink-0 shadow-xs">
                <MapPin className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Our Studio (ঠিকানা)</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{address}</p>
              </div>
            </div>

            {/* Phone (Clickable) */}
            <a
              href={`tel:${phone}`}
              className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 block hover:border-black/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-gray-900 shrink-0 shadow-xs">
                <Phone className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Call Us (ফোন নম্বর)</h3>
                <p className="text-gray-600 text-xs hover:text-black transition-colors font-mono font-medium">
                  {phone}
                </p>
              </div>
            </a>

            {/* Email (Clickable) */}
            <a
              href={`mailto:${email}`}
              className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 block hover:border-black/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-gray-900 shrink-0 shadow-xs">
                <Mail className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Email (ইমেইল)</h3>
                <p className="text-gray-600 text-xs hover:text-black transition-colors">
                  {email}
                </p>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Name (আপনার নাম) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-gray-50/70 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="e.g. Karim Ahmed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address (ইমেইল এড্রেস)
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 bg-gray-50/70 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="e.g. karim@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Phone Number (ফোন নম্বর)
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full px-4 py-3 bg-gray-50/70 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Subject (বিষয়)
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full px-4 py-3 bg-gray-50/70 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Custom Furniture / Query"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Message (আপনার বার্তা) *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-gray-50/70 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Tell us about your requirements or question..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send Message (বার্তা পাঠান)</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}