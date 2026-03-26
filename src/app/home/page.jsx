"use client";

import Link from "next/link";
import { Calendar, DollarSign, MessageCircle, Shield, Clock, MapPin, ArrowRight, HomeIcon } from "lucide-react";

export default function page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-24 mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 animate-slide-up-fade" style={{ animationDelay: '0ms' }}>
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            ShareNest is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-gray-900 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
            Find or Share Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Perfect Space</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up-fade" style={{ animationDelay: '200ms' }}>
            A modern platform where students can offer or find extra space in flats — book by the hour or day, negotiate prices, and connect with verified users.
          </p>

          <div className="flex justify-center gap-4 flex-wrap animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
            <Link
              href="/find-space"
              className="group px-8 py-4 rounded-full bg-gray-900 text-white text-lg font-semibold hover:bg-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <HomeIcon size={20} className="text-gray-300 group-hover:text-white transition-colors" />
              Find a Space
            </Link>
            <Link
              href="/list-space"
              className="group px-8 py-4 rounded-full bg-white text-gray-900 border border-gray-200 text-lg font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              List Your Space
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* New Features Highlight */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">✨ New Features</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="text-indigo-600" size={28} />}
              title="Hourly Booking"
              desc="Book spaces by the hour for short-term needs. Perfect for study sessions or quick meetings."
              highlight={true}
            />
            <FeatureCard
              icon={<MessageCircle className="text-teal-600" size={28} />}
              title="Price Negotiation"
              desc="Chat with space owners to negotiate prices that work for both parties."
              highlight={true}
              color="teal"
            />
            <FeatureCard
              icon={<DollarSign className="text-violet-600" size={28} />}
              title="Budget Filtering"
              desc="Set your budget and find spaces that match your financial needs."
              highlight={true}
              color="violet"
            />
          </div>
        </div>

        {/* Core Features */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Core Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="text-rose-600" size={28} />}
              title="Location-Based Search"
              desc="Find spaces near you with integrated maps and GPS coordinates."
              color="rose"
            />
            <FeatureCard
              icon={<Shield className="text-blue-600" size={28} />}
              title="Secure & Verified"
              desc="Only verified users can book or list. Your safety and security come first."
              color="blue"
            />
            <FeatureCard
              icon={<Calendar className="text-orange-600" size={28} />}
              title="Flexible Booking"
              desc="Book for days, hours, or negotiate custom arrangements that suit your needs."
              color="orange"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10"></div>
            <StepCard
              step="1"
              title="Sign Up"
              desc="Create your account and complete your profile with verification details."
            />
            <StepCard
              step="2"
              title="List or Search"
              desc="Post your available space or browse through listings in your area."
            />
            <StepCard
              step="3"
              title="Negotiate"
              desc="Send booking requests and negotiate with space owners."
            />
            <StepCard
              step="4"
              title="Enjoy"
              desc="Confirm your booking and enjoy your perfect space."
            />
          </div>
        </section>

        {/* Stats */}
        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard number="500+" label="Active Spaces" />
            <StatCard number="1000+" label="Happy Users" />
            <StatCard number="95%" label="Successful Bookings" />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-indigo-600 rounded-[2.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to Get Started?</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of students finding and sharing spaces across the city. Experience the modern way of renting.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-indigo-600 font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Today
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc, highlight = false, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-500",
    teal: "bg-teal-50 text-teal-600 ring-teal-500",
    violet: "bg-violet-50 text-violet-600 ring-violet-500",
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className={`bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden ${
      highlight ? `ring-1 ${colorMap[color].split(' ')[2]}` : ''
    }`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${colorMap[color].split(' ').slice(0, 2).join(' ')} group-hover:bg-white group-hover:border group-hover:border-gray-100 group-hover:shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-between">
        {title}
        {highlight && <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorMap[color].split(' ').slice(0, 2).join(' ')}`}>NEW</span>}
      </h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div className="text-center relative">
      <div className="w-16 h-16 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-sm z-10 relative">
        {step}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
      <div className="text-4xl font-black text-gray-900 mb-2">{number}</div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
}
