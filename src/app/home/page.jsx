"use client";

import Link from "next/link";
import { Calendar, DollarSign, MessageCircle, Shield, Clock, MapPin } from "lucide-react";

export default function page() {
  return (
    <main className="min-h-screen bg-[#e0e5ec] text-gray-800 font-sans px-6 py-12 mt-18">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find or Share Your Perfect Space
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            A modern platform where students can offer or find extra space in flats — book by the hour or day, negotiate prices, and connect with verified users.
          </p>

          <div className="flex justify-center gap-6 flex-wrap mb-12">
            <Link
              href="/list-space"
              className="group px-8 py-4 rounded-2xl bg-[#e0e5ec] text-lg font-medium shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff] hover:bg-[#d6dce4] transition-all duration-300 hover:shadow-[8px_8px_16px_#c2c8d0,_-8px_-8px_16px_#ffffff] transform hover:-translate-y-1"
            >
              <span className="flex items-center">
                📝 List Your Space
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <Link
              href="/find-space"
              className="group px-8 py-4 rounded-2xl bg-[#e0e5ec] text-lg font-medium shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff] hover:bg-[#d6dce4] transition-all duration-300 hover:shadow-[8px_8px_16px_#c2c8d0,_-8px_-8px_16px_#ffffff] transform hover:-translate-y-1"
            >
              <span className="flex items-center">
                🔍 Find a Space
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>
        </div>

        {/* New Features Highlight */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">✨ New Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Clock className="text-blue-500" size={24} />}
              title="Hourly Booking"
              desc="Book spaces by the hour for short-term needs. Perfect for study sessions or quick meetings."
              highlight={true}
            />
            <FeatureCard
              icon={<MessageCircle className="text-green-500" size={24} />}
              title="Price Negotiation"
              desc="Chat with space owners to negotiate prices that work for both parties."
              highlight={true}
            />
            <FeatureCard
              icon={<DollarSign className="text-purple-500" size={24} />}
              title="Budget Filtering"
              desc="Set your budget and find spaces that match your financial needs."
              highlight={true}
            />
          </div>
        </div>

        {/* Core Features */}
        <section className="grid md:grid-cols-3 gap-8 text-left mb-16">
          <FeatureCard
            icon={<MapPin className="text-red-500" size={24} />}
            title="Location-Based Search"
            desc="Find spaces near you with integrated maps and GPS coordinates."
          />
          <FeatureCard
            icon={<Shield className="text-indigo-500" size={24} />}
            title="Secure & Verified"
            desc="Only verified users can book or list. Your safety and security come first."
          />
          <FeatureCard
            icon={<Calendar className="text-orange-500" size={24} />}
            title="Flexible Booking"
            desc="Book for days, hours, or negotiate custom arrangements that suit your needs."
          />
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard
              step="1"
              title="Sign Up"
              desc="Create your account and complete your profile with verification details."
            />
            <StepCard
              step="2"
              title="List or Search"
              desc="Post your available space or browse through available listings in your area."
            />
            <StepCard
              step="3"
              title="Connect & Negotiate"
              desc="Send booking requests, negotiate prices, and communicate with space owners."
            />
            <StepCard
              step="4"
              title="Book & Enjoy"
              desc="Confirm your booking and enjoy your perfect space at the right price."
            />
          </div>
        </section>

        {/* Stats */}
        <section className="text-center mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard number="500+" label="Active Spaces" />
            <StatCard number="1000+" label="Happy Users" />
            <StatCard number="95%" label="Successful Bookings" />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-[#e0e5ec] rounded-3xl p-8 shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">Join thousands of students finding and sharing spaces across the city.</p>
            <Link
              href="/auth"
              className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc, highlight = false }) {
  return (
    <div className={`bg-[#e0e5ec] rounded-2xl p-6 shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff] hover:bg-[#d6dce4] transition-all duration-300 hover:shadow-[8px_8px_16px_#c2c8d0,_-8px_-8px_16px_#ffffff] transform hover:-translate-y-1 ${
      highlight ? 'ring-2 ring-blue-300' : ''
    }`}>
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-xl font-semibold ml-3">{title}</h3>
        {highlight && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">NEW</span>}
      </div>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-lg">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-[#e0e5ec] rounded-2xl p-6 shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff]">
      <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}
