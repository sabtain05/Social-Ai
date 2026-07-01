import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const footerLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'FAQs', href: '/faqs' },
  ];

  return (
    <footer className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="space-y-3">
        {footerLinks.map((link) => (
          <Link key={link.name} href={link.href} className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">{link.name}</Link>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200"><p className="text-xs text-black text-center">&copy; {new Date().getFullYear()} Social Ai.</p>
      <p className="text-xs text-black text-center">A Sabtain Ali production</p>
      </div>
    </footer>
  );
};

export default Footer;