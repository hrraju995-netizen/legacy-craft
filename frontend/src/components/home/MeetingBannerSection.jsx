"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const MeetingBannerSection = ({ banner = null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    companyName: "",
    objective: "",
    dateTime: "",
    method: "online",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Meeting Form Data:", formData);
    // Form submission processing logic goes here
    setIsModalOpen(false);
  };

  const bannerImage = banner?.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";
  const bannerTitle = banner?.title || "Need a Meeting !!";
  const bannerSubtitle = banner?.subtitle || "To better understand your requirements or provide detailed explanations, you can request a meeting with our team. We conduct both online and offline meetings for your convenience.";
  const bannerBtnText = banner?.buttonText || "Request a Meeting";

  return (
    <section className="py-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Banner Card Container */}
      <div className="container rounded-tl-4xl rounded-br-4xl overflow-hidden shadow-lg border border-gray-100 grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Meeting Image */}
        <div className="relative min-h-[350px] lg:min-h-[420px] bg-gray-900">
          <Image
            src={bannerImage}
            alt={bannerTitle}
            fill
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Right Side: Yellow CTA Box */}
        <div 
          style={{
            backgroundColor: banner?.bgColor || undefined,
          }}
          className="bg-primary p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start"
        >
          <h2 
            style={{ color: banner?.textColor || undefined }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            {bannerTitle}
          </h2>
          <p 
            style={{ color: banner?.textColor ? `${banner.textColor}ee` : undefined }}
            className="mt-4 text-sm sm:text-base text-white leading-relaxed max-w-lg font-medium"
          >
            {bannerSubtitle}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: banner?.buttonColor || undefined,
              color: banner?.buttonTextColor || undefined,
            }}
            className="mt-8 px-8 py-3.5 bg-black text-white text-sm sm:text-base font-semibold rounded-bl-3xl rounded-tr-3xl hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 cursor-pointer"
          >
            {bannerBtnText}
          </button>
        </div>
      </div>

      {/* Schedule a Meeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 text-center relative border-b border-gray-100 shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900">
                Schedule a Meeting
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Fill out the form below to book a consultation with our experts.
              </p>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-grow">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Designation & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Your designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Meeting Objective */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Meeting Objective
                </label>
                <input
                  type="text"
                  name="objective"
                  placeholder="Discuss office renovation"
                  value={formData.objective}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  required
                  value={formData.dateTime}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-700"
                />
              </div>

              {/* Meeting Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Meeting Method
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="radio"
                      name="method"
                      value="online"
                      checked={formData.method === "online"}
                      onChange={handleChange}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-primary"
                    />
                    Online (Zoom/Meet)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="radio"
                      name="method"
                      value="physical"
                      checked={formData.method === "physical"}
                      onChange={handleChange}
                      className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-primary"
                    />
                    Physical (In-person)
                  </label>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Any specific requirements or questions..."
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F172A] text-white text-sm font-semibold rounded-lg hover:bg-black transition-all duration-200 shadow-md cursor-pointer"
                >
                  Confirm Schedule
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MeetingBannerSection;