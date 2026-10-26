import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact | AP39', description: 'How to reach AP39.', alternates: { canonical: '/contact' } };

export default function Contact() {
  return (
    <div className="wrap">
      <section className="page-title">
        <h1>Contact</h1>
        <p>For work, collaboration or questions about anything here.</p>
      </section>
      <div className="contact-box">
        <p>The fastest way to reach me is Telegram.</p>
        <a className="btn" href="https://t.me/ap39ap39" target="_blank" rel="noopener noreferrer">Message @ap39ap39</a>
      </div>
    </div>
  );
}
