import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';

const PrivacyPage: React.FC = () => {
  const sections = [
    { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, update your profile, create posts, or communicate with other users. This may include your name, username, email address, profile picture, and any content you post on our platform.' },
    { title: 'How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, including to: process transactions, send you technical notices and support messages, respond to your comments and questions, and communicate with you about products, services, and events.' },
    { title: 'Sharing of Information', content: 'We do not share your personal information with third parties without your consent, except in the following circumstances: to comply with laws or respond to lawful requests and legal process, to protect the rights and property of Social Ai, or to prevent fraud or other illegal activity.' },
    { title: 'Data Security', content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.' },
    { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information. You can do this through your account settings or by contacting our support team.' },
    { title: 'Cookies', content: 'We use cookies to enhance your experience on our platform. Cookies help us remember your preferences and analyze how you use our services.' },
    { title: 'Changes to This Policy', content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date.' },
  ];

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-6">Last updated: January 1, 2026</p>
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-200"><p className="text-gray-600">If you have any questions, contact us at: <a href="mailto:privacy@socialai.com" className="text-primary-600">privacy@socialai.com</a></p></div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPage;