import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../utils/api';

const legalContent = {
  privacy: {
    eyebrow: 'Your information',
    title: 'Privacy Policy',
    intro: 'This page explains how Glow&Grace uses information when you browse, book an appointment, or place an order.',
    sections: [
      {
        title: 'Information you provide',
        paragraphs: [
          'We may collect your name, email address, phone number, delivery address, appointment details, order details, and messages you send us.',
          'Payment references and transaction status may be stored to reconcile orders. Full card details are handled by the selected payment provider and are not stored by this website.'
        ]
      },
      {
        title: 'How information is used',
        paragraphs: [
          'We use this information to manage accounts, respond to questions, arrange appointments, deliver orders, confirm payments, and send service-related updates.',
          'We do not sell personal information. We share only the data needed with service providers that support hosting, database storage, media uploads, email, delivery, or payment processing.'
        ]
      },
      {
        title: 'Storage and security',
        paragraphs: [
          'Account, booking, and order records are stored to operate the service and maintain business records. Some site preferences and cart information may be saved in your browser storage.',
          'We use reasonable safeguards, but no internet transmission or storage system can be guaranteed completely secure.'
        ]
      },
      {
        title: 'Your choices and questions',
        paragraphs: [
          'You may contact us to request correction of your account details or ask how your information is used. We may retain transaction records where needed for business, security, or legal requirements.'
        ]
      }
    ]
  },
  terms: {
    eyebrow: 'Using our services',
    title: 'Terms & Cancellation',
    intro: 'These terms describe the basic process for appointments, orders, and payments through Glow&Grace.',
    sections: [
      {
        title: 'Appointments',
        paragraphs: [
          'Submitting a booking sends an appointment request. It is not confirmed until the parlour reviews and confirms it. We may contact you using the phone or email provided.',
          'Please contact us as early as possible if you need to change or cancel an appointment. Availability depends on the service, date, and staff schedule.'
        ]
      },
      {
        title: 'Orders and prices',
        paragraphs: [
          'Product availability, prices, and offers may change. Orders are subject to stock confirmation and delivery details supplied at checkout.',
          'Customers are responsible for providing accurate contact and delivery information. We will contact you if an order needs clarification.'
        ]
      },
      {
        title: 'Payments, cancellations, and refunds',
        paragraphs: [
          'Cash-on-delivery and manual transfer payments follow the instructions shown at checkout. A manual transfer remains pending until the parlour verifies the transaction reference.',
          'Online gateway payments are treated as paid only after the server verifies the transaction with the payment provider. If you cancel a payment, the order remains unpaid.',
          'Cancellation and refund decisions depend on the service or product, the order status, the payment provider rules, and applicable law. Contact us with your order reference so we can review the request.'
        ]
      },
      {
        title: 'Service results and support',
        paragraphs: [
          'Beauty and wellness results can vary between individuals. Tell our team about relevant preferences or sensitivities before a service begins.',
          'For help with an appointment, order, or payment, contact us using the details below.'
        ]
      }
    ]
  }
};

const LegalPage = ({ page }) => {
  const [settings, setSettings] = useState(null);
  const content = legalContent[page] || legalContent.privacy;

  useEffect(() => {
    apiGet('/content/settings')
      .then(({ settings: data }) => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-xs font-bold uppercase text-rose-700">{content.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">{content.title}</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{content.intro}</p>
          <p className="mt-3 text-xs text-slate-500">Last updated: November 16, 2026</p>
        </header>

        <div className="divide-y divide-slate-200">
          {content.sections.map(section => (
            <section key={section.title} className="space-y-3 py-7">
              <h2 className="text-lg font-extrabold text-slate-900">{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph} className="text-sm leading-7 text-slate-600">{paragraph}</p>)}
            </section>
          ))}
        </div>

        <aside className="border-t border-slate-200 pt-6 text-sm text-slate-600">
          <h2 className="font-bold text-slate-900">Contact</h2>
          <p className="mt-2">{settings?.siteName || 'Glow&Grace Beauty Parlour'}</p>
          {settings?.contactEmail && <p><a className="text-rose-700 hover:underline" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>}
          {settings?.phone && <p>{settings.phone}</p>}
          <Link to="/contact" className="mt-3 inline-block font-bold text-rose-700 hover:underline">Contact the parlour</Link>
        </aside>
      </article>
    </main>
  );
};

export default LegalPage;