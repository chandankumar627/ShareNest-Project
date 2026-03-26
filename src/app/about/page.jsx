"use client";

import { Clock, DollarSign, MessageCircle, Shield, Users, MapPin, Calendar, Star } from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans mt-16 text-gray-900 animate-slide-up-fade">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            About ShareNest
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing how students and professionals find and share living spaces in urban areas.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm mb-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex justify-center items-center gap-2">
            <Star className="text-amber-500 fill-amber-500" size={28} /> Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            <strong>ShareNest</strong> is a modern platform created for students and working professionals living in urban areas. 
            We understand that finding safe, affordable, and convenient short- or long-term space can be challenging in cities. 
            Many residents have extra space they're willing to share, and we're here to connect them with those who need it.
          </p>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MapPin className="text-indigo-600" size={24} />}
              title="Smart Listings"
              desc="Help city residents list their available space with location, images, and full descriptions."
            />
            <FeatureCard
              icon={<Users className="text-emerald-600" size={24} />}
              title="Easy Discovery"
              desc="Let users browse available spaces in their area with advanced filtering and search options."
            />
            <FeatureCard
              icon={<MessageCircle className="text-violet-600" size={24} />}
              title="Direct Communication"
              desc="Enable seamless communication and price negotiation between space owners and seekers."
            />
            <FeatureCard
              icon={<Clock className="text-orange-600" size={24} />}
              title="Flexible Booking"
              desc="Support both hourly and daily bookings to meet diverse accommodation needs."
            />
            <FeatureCard
              icon={<DollarSign className="text-amber-600" size={24} />}
              title="Price Negotiation"
              desc="Built-in negotiation system allowing users to find mutually agreeable pricing."
            />
            <FeatureCard
              icon={<Shield className="text-blue-600" size={24} />}
              title="Secure Platform"
              desc="Firebase authentication with safe, verified user access built throughout the system."
            />
          </div>
        </div>

        {/* New Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">✨ Latest Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <NewFeatureCard
              icon={<Clock className="text-indigo-600" size={28} />}
              title="Hourly Booking"
              desc="Book spaces for just a few hours - perfect for study sessions, meetings, or short stays."
            />
            <NewFeatureCard
              icon={<MessageCircle className="text-emerald-600" size={28} />}
              title="Price Negotiation"
              desc="Chat with space owners to negotiate prices that work for everyone involved."
            />
            <NewFeatureCard
              icon={<DollarSign className="text-violet-600" size={28} />}
              title="Budget Filtering"
              desc="Set your budget and find spaces that match your financial requirements."
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10"></div>
            <StepCard
              step="1"
              title="Create Account"
              desc="Sign up and complete your profile with verification details."
            />
            <StepCard
              step="2"
              title="List or Search"
              desc="Post your space or browse through listings with smart filters."
            />
            <StepCard
              step="3"
              title="Connect & Negotiate"
              desc="Send booking requests, negotiate prices recursively, and chat."
            />
            <StepCard
              step="4"
              title="Book & Enjoy"
              desc="Confirm your booking and enjoy your perfect space at the right price."
            />
          </div>
        </div>

        {/* Why Choose Us & Stats */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Choose ShareNest?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="text-emerald-600" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Safety First</h3>
                <ul className="space-y-2 text-sm text-gray-600 font-medium">
                  <li>• Verified user profiles with ID checks</li>
                  <li>• Secure authentication system</li>
                  <li>• Direct and safe communication</li>
                  <li>• Community-driven safety ratings</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                  <Star className="text-amber-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">User Experience</h3>
                <ul className="space-y-2 text-sm text-gray-600 font-medium">
                  <li>• Intuitive, modern interface design</li>
                  <li>• Advanced search and fiters</li>
                  <li>• Real-time booking requests</li>
                  <li>• Fully mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 lg:invisible">Our Impact</h2>
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg h-full flex flex-col justify-center">
              <div className="space-y-8">
                 <div className="text-center">
                    <div className="text-4xl font-extrabold mb-1">500+</div>
                    <div className="text-indigo-200 font-medium">Active Spaces</div>
                 </div>
                 <div className="text-center">
                    <div className="text-4xl font-extrabold mb-1">1000+</div>
                    <div className="text-indigo-200 font-medium">Happy Users</div>
                 </div>
                 <div className="text-center">
                    <div className="text-4xl font-extrabold mb-1">95%</div>
                    <div className="text-indigo-200 font-medium">Successful Bookings</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">Join thousands of students and professionals finding perfect spaces in your city today.</p>
          <a href="/auth" className="inline-flex items-center px-8 py-3.5 rounded-full bg-gray-900 text-white font-bold hover:bg-black transition shadow-md hover:shadow-lg">
             Join ShareNest
          </a>
          <p className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 font-medium uppercase tracking-widest">
            Made with ❤️ by Manish kr _manish_ku07 | ShareNest Platform
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function NewFeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-indigo-100 ring-2 ring-indigo-50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-[10px] font-black tracking-wider px-2 py-1 rounded-md">NEW</div>
      <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div className="text-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative z-10 transition-transform hover:-translate-y-1">
      <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-5 shadow-sm ring-4 ring-white">
        {step}
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}