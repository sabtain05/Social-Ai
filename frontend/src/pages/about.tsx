import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { SparklesIcon, UserGroupIcon, ChatBubbleLeftRightIcon, ShieldCheckIcon, RocketLaunchIcon, HeartIcon } from '@heroicons/react/24/outline';
import Avatar from '@/components/common/Avatar';

const AboutPage: React.FC = () => {
  const features = [
    { icon: SparklesIcon, title: 'AI Content Assistant', description: 'Get AI-powered suggestions to improve your posts while maintaining your unique voice and style.' },
    { icon: UserGroupIcon, title: 'Connect with Friends', description: 'Follow friends, send friend requests, and build your social network.' },
    { icon: ChatBubbleLeftRightIcon, title: 'Engage with Content', description: 'Like, comment, and share posts across multiple platforms.' },
    { icon: ShieldCheckIcon, title: 'Privacy First', description: 'Control who sees your content with public and friends-only privacy settings.' },
  ];

  const teamMembers = [
    { name: 'Sabtain Ali', role: 'CEO & Founder', bio: 'Former tech executive with 15+ years in social media innovation.', avatar: null },
    { name: 'Michael Chen', role: 'CTO & Lead AI Engineer', bio: 'AI researcher and full-stack developer.', avatar: null },
    { name: 'Emily Rodriguez', role: 'Head of Product', bio: 'Product strategist focused on creating intuitive user experiences.', avatar: null },
    { name: 'David Kim', role: 'Lead Backend Developer', bio: 'Expert in scalable architectures and database optimization.', avatar: null },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">About Social Ai</h1>
          <p className="text-lg opacity-90">
            Social Ai is a modern social media platform that combines traditional social networking
            with cutting-edge AI technology to help you create better content.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We believe that everyone has a story to tell, and we want to help you tell it better.
            Our AI Content Assistant is designed to enhance your creativity, not replace it,
            giving you suggestions that maintain your authentic voice while making your content
            more engaging and impactful.
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex space-x-4">
                <feature.icon className="h-8 w-8 text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet Our Team</h2>
            <p className="text-gray-600">The passionate people behind Social Ai</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <Avatar src={member.avatar} alt={member.name} size={100} className="mx-auto mb-3 ring-4 ring-white shadow-lg" fallbackInitials={member.name} />
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 text-sm">{member.role}</p>
                <p className="text-gray-500 text-xs mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div><p className="text-3xl font-bold text-primary-600">1000+</p><p className="text-gray-600">Active Users</p></div>
            <div><p className="text-3xl font-bold text-primary-600">10k+</p><p className="text-gray-600">Posts Created</p></div>
            <div><p className="text-3xl font-bold text-primary-600">50k+</p><p className="text-gray-600">AI Suggestions</p></div>
          </div>
        </div>

        {/* Join Section */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Join Our Team</h2>
          <p className="text-gray-600 mb-6">We're always looking for talented individuals to join our mission.</p>
          <a href="/contact" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">View Open Positions</a>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;