import './globals.css';

export const metadata = {
  title: 'Free Naukri Alert | Mission Driven Notifications',
  description: 'A non-profit platform for competitive students in India. Honest eligibility checks and intelligent job alerts.',
  openGraph: {
    title: 'Free Naukri Alert',
    description: 'Empowering the Indian competitive journey with logic-driven exam alerts.',
    url: 'https://www.FreeNaukriAlert.System',
    siteName: 'Free Naukri Alert',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 0', background: 'var(--bg-secondary)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 800, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--brand-saffron)', fontSize: '24px' }}>✺</span> 
              FreeNaukriAlert
            </a>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Assessments</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Past Papers</a>
              <a href="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Login / Register</a>
            </div>
          </div>
        </nav>

        {children}

      </body>
    </html>
  );
}
