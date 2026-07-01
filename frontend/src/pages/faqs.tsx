import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQsPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: 'What is Social Ai?', a: 'Social Ai is a social media platform that combines traditional social networking features with an AI-powered content assistant that helps improve your posts.' },
    { q: 'How does the AI Content Assistant work?', a: 'When you write a post, you can click "Improve with AI". Our system sends your text to OpenAI, which returns improved versions with different styles while maintaining your original intent.' },
    { q: 'Is Social Ai free to use?', a: 'Yes! Social Ai is completely free to use. There are no subscription fees or hidden charges.' },
    { q: 'Can I control who sees my posts?', a: 'Yes, you can set each post to be either "Public" (visible to everyone) or "Friends Only" (visible only to your accepted friends).' },
    { q: 'How do I follow or unfollow someone?', a: 'Visit a user\'s profile and click the "Follow" or "Unfollow" button. You can also send friend requests to connect more closely.' },
    { q: 'What\'s the difference between following and being friends?', a: 'Following allows you to see someone\'s public posts. Being friends allows you to see their private/friends-only posts as well.' },
    { q: 'How do I delete my account?', a: 'You can delete your account from the Settings page. This action is permanent and cannot be undone.' },
    { q: 'Is my data safe?', a: 'We take data security seriously. Your password is encrypted, and we follow industry best practices to protect your information.' },
    { q: 'Can I share posts to other platforms?', a: 'Yes! You can share posts to Facebook, WhatsApp, Instagram, Twitter, Telegram, or copy the link.' },
    { q: 'What should I do if I encounter inappropriate content?', a: 'You can report inappropriate content by using the report feature. Our moderation team will review and take appropriate action.' },
  ];

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-6">Find answers to common questions about Social Ai</p>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition">
                <span className="font-semibold text-gray-900">{faq.q}</span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50"><p className="text-gray-600">{faq.a}</p></div>}
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-primary-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">Can't find the answer? Please contact our support team.</p>
          <a href="/contact" className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Contact Us</a>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQsPage;