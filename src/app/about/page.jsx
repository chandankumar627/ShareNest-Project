"use client";

import { Clock, DollarSign, MessageCircle, Shield, Users, MapPin, Calendar, Star } from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#e0e5ec] px-6 py-12 font-sans mt-20 text-black">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About ShareNest
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing how students and professionals find and share living spaces in urban areas.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-[#e0e5ec] p-8 rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff] mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">🌟 Our Mission</h2>
          <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto">
            <strong>ShareNest</strong> is a modern platform created for students and working professionals living in urban areas. 
            We understand that finding safe, affordable, and convenient short- or long-term space can be challenging in cities. 
            Many residents have extra space they're willing to share, and we're here to connect them with those who need it.
          </p>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MapPin className="text-blue-500" size={24} />}
              title="Smart Listings"
              desc="Help city residents list their available space with GPS location, images, and detailed descriptions."
            />
            <FeatureCard
              icon={<Users className="text-green-500" size={24} />}
              title="Easy Discovery"
              desc="Let users browse available spaces in their area with advanced filtering and search options."
            />
            <FeatureCard
              icon={<MessageCircle className="text-purple-500" size={24} />}
              title="Direct Communication"
              desc="Enable seamless communication and price negotiation between space owners and seekers."
            />
            <FeatureCard
              icon={<Clock className="text-orange-500" size={24} />}
              title="Flexible Booking"
              desc="Support both hourly and daily bookings to meet diverse accommodation needs."
            />
            <FeatureCard
              icon={<DollarSign className="text-red-500" size={24} />}
              title="Price Negotiation"
              desc="Built-in negotiation system allowing users to find mutually agreeable pricing."
            />
            <FeatureCard
              icon={<Shield className="text-indigo-500" size={24} />}
              title="Secure Platform"
              desc="Firebase authentication with Google sign-in ensures safe, verified user access."
            />
          </div>
        </div>

        {/* New Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">✨ Latest Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <NewFeatureCard
              icon={<Clock className="text-blue-500" size={32} />}
              title="Hourly Booking"
              desc="Book spaces for just a few hours - perfect for study sessions, meetings, or short stays."
              isNew={true}
            />
            <NewFeatureCard
              icon={<MessageCircle className="text-green-500" size={32} />}
              title="Price Negotiation"
              desc="Chat with space owners to negotiate prices that work for everyone involved."
              isNew={true}
            />
            <NewFeatureCard
              icon={<DollarSign className="text-purple-500" size={32} />}
              title="Budget Filtering"
              desc="Set your budget and find spaces that match your financial requirements."
              isNew={true}
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard
              step="1"
              title="Create Account"
              desc="Sign up with email or Google and complete your profile with verification details."
            />
            <StepCard
              step="2"
              title="List or Search"
              desc="Post your available space or browse through listings with smart filters."
            />
            <StepCard
              step="3"
              title="Connect & Negotiate"
              desc="Send booking requests, negotiate prices, and communicate directly."
            />
            <StepCard
              step="4"
              title="Book & Enjoy"
              desc="Confirm your booking and enjoy your perfect space at the right price."
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose ShareNest?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#e0e5ec] p-6 rounded-2xl shadow-[6px_6px_20px_#c2c8d0,_-6px_-6px_20px_#ffffff]">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Shield className="mr-3 text-green-500" size={24} />
                Safety First
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Verified user profiles with Aadhar authentication</li>
                <li>• Secure Firebase authentication system</li>
                <li>• Direct communication without sharing personal details</li>
                <li>• Community-driven safety ratings</li>
              </ul>
            </div>
            <div className="bg-[#e0e5ec] p-6 rounded-2xl shadow-[6px_6px_20px_#c2c8d0,_-6px_-6px_20px_#ffffff]">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Star className="mr-3 text-yellow-500" size={24} />
                User Experience
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Intuitive, modern interface design</li>
                <li>• Advanced search and filtering options</li>
                <li>• Real-time booking and negotiation system</li>
                <li>• Mobile-responsive design for all devices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard number="500+" label="Active Spaces" />
            <StatCard number="1000+" label="Happy Users" />
            <StatCard number="95%" label="Successful Bookings" />
            <StatCard number="24/7" label="Platform Availability" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center bg-[#e0e5ec] p-8 rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff]">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">Join thousands of students and professionals finding perfect spaces.</p>
          <p className="text-sm text-gray-500">
            Made with ❤️ by Manish kr _manish_ku07 | ShareNest Platform
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#e0e5ec] p-6 rounded-2xl shadow-[6px_6px_20px_#c2c8d0,_-6px_-6px_20px_#ffffff] hover:bg-[#d6dce4] transition-all duration-300">
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-lg font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function NewFeatureCard({ icon, title, desc, isNew }) {
  return (
    <div className="bg-[#e0e5ec] p-6 rounded-2xl shadow-[6px_6px_20px_#c2c8d0,_-6px_-6px_20px_#ffffff] hover:bg-[#d6dce4] transition-all duration-300 ring-2 ring-blue-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-semibold ml-3">{title}</h3>
        </div>
        {isNew && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">NEW</span>}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
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
    <div className="bg-[#e0e5ec] rounded-2xl p-6 shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff] text-center">
      <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}