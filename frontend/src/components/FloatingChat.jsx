"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa"; 

export default function FloatingChat({ settings: initialSettings = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(initialSettings || {});

  // Always fetch fresh config on client mount to bypass any SSR/browser caching
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    fetch(`${apiUrl}/v1/site/config?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.chat) {
          setSettings(data.settings.chat);
        }
      })
      .catch(() => {});
  }, []);

  // Master switch
  const chatEnabled = settings.chat_enabled !== false && settings.chat_enabled !== "0" && settings.chat_enabled !== 0;
  if (!chatEnabled) {
    return null;
  }

  // Channels: WhatsApp
  const whatsappEnabled = settings.whatsapp_enabled !== false && settings.whatsapp_enabled !== "0" && settings.whatsapp_enabled !== 0;
  const rawWhatsapp = (settings.whatsapp_number || "8801897711118").toString().trim();
  let whatsappNumber = rawWhatsapp.replace(/[^0-9]/g, "");
  if (whatsappNumber.startsWith("01") && whatsappNumber.length === 11) {
    whatsappNumber = "88" + whatsappNumber;
  }

  // Channels: Messenger
  const messengerEnabled = settings.messenger_enabled !== false && settings.messenger_enabled !== "0" && settings.messenger_enabled !== 0;
  const rawMessenger = (settings.messenger_username || "legacycraftstudio").toString().trim();
  let messengerUrl = "";
  if (rawMessenger) {
    if (rawMessenger.startsWith("http://") || rawMessenger.startsWith("https://")) {
      messengerUrl = rawMessenger;
    } else {
      const cleanUser = rawMessenger.replace(/^[@\/]+/, "").replace(/\/+$/, "");
      // Using facebook.com/messages/t/ works reliably on both desktop (logged in fb) and mobile
      messengerUrl = `https://www.facebook.com/messages/t/${cleanUser}`;
    }
  }

  // Channels: Phone Call
  const phoneEnabled = settings.phone_enabled !== false && settings.phone_enabled !== "0" && settings.phone_enabled !== 0;
  const phoneNum = (settings.phone_number || "+8801897711118").toString().trim();

  // Channels: Email
  const emailEnabled = settings.email_enabled !== false && settings.email_enabled !== "0" && settings.email_enabled !== 0;
  const emailAddress = (settings.email_address || "support@legacycraftstudio.com").toString().trim();

  // If all channels are turned off, don't show the widget
  const hasAnyChannel = (whatsappEnabled && whatsappNumber) ||
    (messengerEnabled && messengerUrl) ||
    (phoneEnabled && phoneNum) ||
    (emailEnabled && emailAddress);

  if (!hasAnyChannel) {
    return null;
  }

  return (
    <div className="fixed bottom-22 right-4 sm:bottom-20 sm:right-14 z-50 flex flex-col items-end">
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-6 scale-95 pointer-events-none"
        }`}
      >
        {/* WhatsApp */}
        {whatsappEnabled && whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="WhatsApp"
          >
            <FaWhatsapp className="w-6 h-6" />
          </a>
        )}

        {/* Messenger */}
        {messengerEnabled && messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#0084FF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Messenger"
          >
            <FaFacebookMessenger className="w-6 h-6" />
          </a>
        )}

        {/* Call / Phone */}
        {phoneEnabled && phoneNum && (
          <a
            href={`tel:${phoneNum}`}
            className="w-12 h-12 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Call Us"
          >
            <Phone className="w-5 h-5" />
          </a>
        )}

        {/* Email */}
        {emailEnabled && emailAddress && (
          <a
            href={`mailto:${emailAddress}`}
            className="w-12 h-12 bg-[#EA4335] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Email Us"
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary hover:bg-black text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer relative"
        aria-label="Open Chat"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></span>
        
        {isOpen ? (
          <X className="w-7 h-7 transition-transform rotate-90" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}