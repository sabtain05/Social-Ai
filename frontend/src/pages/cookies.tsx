import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';

const CookiesPage: React.FC = () => {
  const cookieTypes = [
    { name: 'Essential Cookies', description: 'These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.' },
    { name: 'Functional Cookies', description: 'These cookies help us remember your preferences and settings, such as your login status and language preferences.' },
    { name: 'Analytics Cookies', description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.' },
    { name: 'Marketing Cookies', description: 'These cookies track your browsing habits to deliver personalized advertisements relevant to your interests.' },
  ];

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-gray-500 mb-6">Last updated: January 1, 2026</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">What Are Cookies?</h2>
            <p className="text-gray-600">Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How We Use Cookies</h2>
            <p className="text-gray-600 mb-4">We use cookies for the following purposes:</p>
            <div className="space-y-4">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{cookie.name}</h3>
                  <p className="text-gray-600 text-sm">{cookie.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Managing Cookies</h2>
            <p className="text-gray-600">You can control and manage cookies in your browser settings. Most browsers allow you to:</p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              <li>View the cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all third-party cookies</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Third-Party Cookies</h2>
            <p className="text-gray-600">We may also use third-party services that place cookies on our behalf, such as analytics providers and advertising networks. These third parties have their own privacy policies and cookie policies.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Changes to This Policy</h2>
            <p className="text-gray-600">We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-600">If you have any questions, contact us at: <a href="mailto:cookies@socialai.com" className="text-primary-600">cookies@socialai.com</a></p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiesPage;