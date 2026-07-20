'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    if (email) {
      fetch(`http://localhost:5000/api/auth/profile/${email}`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(console.error);
    }
  }, [email]);

  if (!profile) {
    return <div style={{ textAlign: 'center', marginTop: '64px' }}>Loading Journey...</div>;
  }

  return (
    <div className="container" style={{ padding: '64px 24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome, {profile.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Target: {profile.targetJob} | Role: {profile.role}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: profile.activityScore > 50 ? 'var(--brand-green)' : 'var(--brand-saffron)' }}>
            {profile.activityScore}%
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Activity Score</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Alerts Panel */}
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
            Active Alerts
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-saffron)', marginTop: '8px' }}></div>
              <div>
                <div style={{ fontWeight: 600 }}>Job Notification (SSC CGL)</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Based on your Graduate eligibility.</div>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-navy)', marginTop: '8px' }}></div>
              <div>
                <div style={{ fontWeight: 600 }}>Syllabus Alert</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>New topics added to Tier II.</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Assessment Panel */}
        <div className="card" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ marginBottom: '8px' }}>100-Question Check</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Prove your Examiner Thought Process to increase your Activity Percentage.
          </p>
          <a href={`/assessment?email=${email}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>Start Assessment</a>
        </div>
      </div>

    </div>
  );
}
