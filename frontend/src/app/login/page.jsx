'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { loginCustomer } from '@/lib/api';
import { useCustomerAuthStore } from '@/store/useCustomerAuthStore';

const isValidBdPhone = (value) => /^01[3-9]\d{8}$/.test(value.replace(/[\s-]/g, ""));

const Login = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!isValidBdPhone(formData.phone))
      next.phone = 'Enter a valid Bangladeshi number, e.g. 017XXXXXXXX.';
    if (formData.password.length < 6)
      next.password = 'Password must be at least 6 characters.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await loginCustomer({
        phone: formData.phone.trim(),
        password: formData.password,
      });

      if (res?.token && res?.customer) {
        useCustomerAuthStore.getState().setAuth(res.customer, res.token);
        toast.success(`Welcome back, ${res.customer.name}!`);
        setTimeout(() => {
          router.push('/profile');
        }, 800);
      } else {
        toast.error(res?.message || 'Invalid credentials.');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid phone or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Login Your Account</h2>
          <p className="text-sm text-gray-500 mt-2">Log in to manage your orders & account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="017XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition duration-200 focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.phone ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>
            )}
          </div>

          {/* Password with Eye Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition duration-200"
              />
              
              {/* Eye Icon Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black focus:outline-none p-1 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  /* Eye Off Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  /* Eye Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary transition cursor-pointer"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="font-medium text-gray-600 hover:text-black transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed py-3.5 rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition duration-200 shadow-md"
          >
            {submitting ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border cursor-pointer border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <FcGoogle size={22}/>
          Continue with Google
        </button>

        {/* Create Account Link */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Do not have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-black hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;