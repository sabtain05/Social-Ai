import React, { useState } from 'react';
import Link from 'next/link';
import { 
  SparklesIcon, 
  PencilSquareIcon, 
  ShareIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ChatBubbleLeftIcon,
  RocketLaunchIcon, 
  CursorArrowRaysIcon 
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const WelcomePage: React.FC = () => {
  const [demoPost, setDemoPost] = useState('I am tired today');
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const aiSuggestions = [
    { style: 'motivational', text: 'Feeling exhausted but still pushing forward 💪✨ #KeepGoing', icon: '💪' },
    { style: 'emotional', text: 'Some days are heavy, but I keep going 🌙💫 #RealTalk', icon: '🌙' },
    { style: 'creative', text: 'Taking a moment to recharge. Better days ahead! 🌟 #SelfCare', icon: '🌟' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-purple-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SA</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Social Ai</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
                Post Smarter with <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Write better posts, express yourself, and connect smarter using AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
                >
                  Get Started <RocketLaunchIcon className="ml-2 h-5 w-5" />
                </Link>
                <button
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                  className="inline-flex items-center justify-center px-6 py-3 text-primary-600 bg-white border-2 border-primary-200 rounded-lg hover:border-primary-400"
                >
                  Try AI Demo <CursorArrowRaysIcon className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
                <textarea
                  value={demoPost}
                  onChange={(e) => setDemoPost(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="What's on your mind?"
                />
                <button
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                  className="mt-3 flex items-center space-x-2 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>Improve with AI</span>
                </button>
                {showAISuggestions && (
                  <div className="mt-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 border border-primary-200">
                    <div className="space-y-3">
                      {aiSuggestions.map((s, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{s.icon}</span>
                            <span className="text-xs font-medium text-primary-600 uppercase">{s.style}</span>
                          </div>
                          <p className="text-sm text-gray-700">{s.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Social Ai?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: SparklesIcon, title: 'AI Post Assistant', desc: 'Get intelligent suggestions to enhance your posts' },
              { icon: ChatBubbleLeftIcon, title: 'Clean Feed', desc: 'Enjoy a distraction-free social experience' },
              { icon: UserGroupIcon, title: 'Follow & Friends', desc: 'Connect with people who share your interests' },
              { icon: ShieldCheckIcon, title: 'Safe & Positive', desc: 'Content moderation for a healthy community' },
              { icon: ShareIcon, title: 'Easy Sharing', desc: 'Share posts across all major platforms' },
              { icon: PencilSquareIcon, title: 'Creative Tools', desc: 'Express yourself with rich media' }
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Start using Social Ai today</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands of creators who are already expressing themselves better</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
              Sign Up - It's Free <RocketLaunchIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Social Ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;