import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';

const TermsPage: React.FC = () => {
  const sections = [
    { title: 'Acceptance of Terms', content: 'By accessing or using Social Ai, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.' },
    { title: 'User Accounts', content: 'You must be at least 13 years old to use Social Ai. You are responsible for maintaining the security of your account and for all activities that occur under your account.' },
    { title: 'User Content', content: 'You retain ownership of any content you post on Social Ai. By posting content, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content on our platform.' },
    { title: 'Prohibited Conduct', content: 'You agree not to: post harmful, illegal, or offensive content; harass other users; impersonate others; or use the platform for any unauthorized commercial purposes.' },
    { title: 'AI Content Assistant', content: 'Our AI Content Assistant is designed to help improve your posts. The AI-generated suggestions are for your use only, and you are responsible for reviewing and approving any content before publishing.' },
    { title: 'Termination', content: 'We reserve the right to suspend or terminate accounts that violate these terms, without prior notice. You may delete your account at any time through your account settings.' },
    { title: 'Limitation of Liability', content: 'Social Ai is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.' },
    { title: 'Changes to Terms', content: 'We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.' },
  ];

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-6">Effective Date: January 1, 2026</p>
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-200"><p className="text-gray-600">Questions? Contact us at: <a href="mailto:legal@socialai.com" className="text-primary-600">legal@socialai.com</a></p></div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;