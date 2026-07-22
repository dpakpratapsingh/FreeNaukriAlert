'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    examName: '',
    year: '',
    shift: '',
    paperType: 'Previous',
    documentUrl: '',
    uploadedBy: 'Admin (System)'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5033/api/admin/upload-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload paper');

      setMessage('Past Paper Successfully Uploaded to the Engine!');
      setFormData({ ...formData, examName: '', year: '', shift: '', documentUrl: '' });
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '600px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Contributor / Admin Panel</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Upload Previous & Predicted Papers to the Central Engine.
        </p>
        
        {message && (
          <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', background: message.startsWith('Error') ? '#ffdddd' : '#ddffdd', color: '#333', textAlign: 'center', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Exam Name</label>
            <input 
              type="text" 
              placeholder="e.g. SSC CGL Tier 1"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              value={formData.examName}
              onChange={e => setFormData({...formData, examName: e.target.value})}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Year</label>
              <input 
                type="number" 
                placeholder="2024"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Shift</label>
              <select 
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                value={formData.shift}
                onChange={e => setFormData({...formData, shift: e.target.value})}
              >
                <option value="">Select...</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Paper Type</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              value={formData.paperType}
              onChange={e => setFormData({...formData, paperType: e.target.value})}
            >
              <option value="Previous">Previous Year Paper</option>
              <option value="Predicted">Predicted Practice Paper</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Document URL (PDF / Drive Link)</label>
            <input 
              type="url" 
              placeholder="https://drive.google.com/..."
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              value={formData.documentUrl}
              onChange={e => setFormData({...formData, documentUrl: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
            {loading ? 'Processing...' : 'Upload to Central Database'}
          </button>
        </form>
      </div>
    </div>
  );
}
