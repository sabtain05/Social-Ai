import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: EnvelopeIcon, title: 'Email', value: 'contact@socialai.com', link: 'mailto:contact@socialai.com' },
    { icon: PhoneIcon, title: 'Phone', value: '+1 (555) 123-4567', link: 'tel:+15551234567' },
    { icon: MapPinIcon, title: 'Address', value: '123 Tech Street, Silicon Valley, CA 94025', link: null },
    { icon: ClockIcon, title: 'Hours', value: 'Mon-Fri, 9am - 6pm PST', link: null },
  ];

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <info.icon className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{info.title}</p>
                    {info.link ? <a href={info.link} className="text-gray-600 hover:text-primary-600">{info.value}</a> : <p className="text-gray-600">{info.value}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary-50 rounded-xl p-6"><p className="text-gray-600 text-sm">We typically respond within 24-48 hours during business days.</p></div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John the Don" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john.don@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            <input type="text" name="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            <textarea name="message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Your Message" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50">{isSubmitting ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;