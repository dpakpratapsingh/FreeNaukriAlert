'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (email) {
      // Fetch Profile
      fetch(`http://localhost:5033/api/auth/profile/${email}`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(console.error);

      // Fetch Notifications
      fetch(`http://localhost:5033/api/notifications/${email}`)
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(console.error);
    }
  }, [email]);

  if (!profile) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Engine...</div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '800px' }}>
      
      {/* Header */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '8px' }}>Welcome, {profile.name}</h2>
        <div style={{ display: 'inline-block', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '24px', fontSize: '14px', fontWeight: 600 }}>
          Role: <span style={{ color: profile.role === 'Contributor' ? 'var(--brand-saffron)' : 'var(--brand-green)' }}>{profile.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: activeTab === 'profile' ? 'var(--brand-navy)' : 'var(--bg-primary)', color: activeTab === 'profile' ? '#fff' : 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}
        >
          My Profile & Scores
        </button>
        <button 
          onClick={() => setActiveTab('inbox')}
          style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: activeTab === 'inbox' ? 'var(--brand-navy)' : 'var(--bg-primary)', color: activeTab === 'inbox' ? '#fff' : 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', position: 'relative' }}
        >
          Job Alerts Inbox 
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--brand-saffron)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Student Dossier</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Highest Education</p>
              <p style={{ fontWeight: 600 }}>{profile.education}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Target Job (Manifestation)</p>
              <p style={{ fontWeight: 600 }}>{profile.targetJob}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Platform Activity Score</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ height: '8px', flex: 1, background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${profile.activityScore}%`, background: 'var(--brand-green)' }}></div>
                </div>
                <span style={{ fontWeight: 700 }}>{profile.activityScore}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Auto-Matched Jobs</h3>
          {notifications.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>No matches yet. We will notify you when a job matches your education and target!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '16px', borderRadius: '8px', border: `1px solid ${n.isRead ? 'var(--border-color)' : 'var(--brand-saffron)'}`, background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0 }}>{n.jobAlert.title}</h4>
                    {!n.isRead && <span style={{ fontSize: '12px', background: 'var(--brand-saffron)', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>New</span>}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {n.jobAlert.department} • Requires {n.jobAlert.requiredEducation}
                  </p>
                  <a href={n.jobAlert.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-block', padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}>
                    View & Apply
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
