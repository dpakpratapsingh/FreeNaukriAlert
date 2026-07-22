'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({ name: '', email: '', education: '', targetJob: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`http://localhost:5033${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isLogin ? 'login' : 'register'}`);

      if (isLogin) {
        // Returning user goes straight to dashboard
        router.push(`/dashboard?email=${formData.email}`);
      } else {
        // New user goes to assessment for onboarding
        router.push(`/assessment?email=${formData.email}&onboarding=true`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '600px' }}>
      <div className="card">
        
        {/* Toggles */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: '32px' }}>
          <button 
            onClick={() => setIsLogin(true)}
            style={{ flex: 1, padding: '16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, borderBottom: isLogin ? '4px solid var(--brand-saffron)' : '4px solid transparent', color: isLogin ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            style={{ flex: 1, padding: '16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, borderBottom: !isLogin ? '4px solid var(--brand-saffron)' : '4px solid transparent', color: !isLogin ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Sign Up
          </button>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>
          {isLogin ? 'Welcome Back' : 'Student Onboarding'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {isLogin ? 'Enter your email to continue your journey.' : 'Provide your history so we can judge your eligibility.'}
        </p>
        
        {error && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Highest Education Eligibility</label>
                <select 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  onChange={e => setFormData({...formData, education: e.target.value})}
                >
                  <option value="">Select Level...</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post-Graduate">Post-Graduate</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Rough Target Job (Manifestation)</label>
                <input 
                  type="text" 
                  placeholder="e.g. UPSC, SSC CGL, Bank PO"
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  onChange={e => setFormData({...formData, targetJob: e.target.value})}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
            {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Enter the Journey Loop')}
          </button>
        </form>
      </div>
    </div>
  );
}
