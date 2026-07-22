'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('paper');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Paper Form
  const [paperForm, setPaperForm] = useState({
    examName: '', year: '', shift: '', paperType: 'Previous', documentUrl: '', uploadedBy: 'Admin (System)'
  });

  // Job Form
  const [jobForm, setJobForm] = useState({
    title: '', department: '', requiredEducation: '', deadline: '', applyUrl: ''
  });

  const handlePaperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const res = await fetch('http://localhost:5033/api/admin/upload-paper', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paperForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage('Past Paper Successfully Uploaded!');
      setPaperForm({ ...paperForm, examName: '', year: '', shift: '', documentUrl: '' });
    } catch (err: any) { setMessage(`Error: ${err.message}`); } finally { setLoading(false); }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const res = await fetch('http://localhost:5033/api/jobs/post', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jobForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Job Posted! Automatically matched and notified ${data.notificationsSent} students.`);
      setJobForm({ title: '', department: '', requiredEducation: '', deadline: '', applyUrl: '' });
    } catch (err: any) { setMessage(`Error: ${err.message}`); } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '600px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Contributor / Admin Panel</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>Manage the Central Engine</p>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: '32px' }}>
          <button 
            onClick={() => { setActiveTab('paper'); setMessage(''); }}
            style={{ flex: 1, padding: '16px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, borderBottom: activeTab === 'paper' ? '4px solid var(--brand-saffron)' : '4px solid transparent', color: activeTab === 'paper' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >Upload Past Paper</button>
          <button 
            onClick={() => { setActiveTab('job'); setMessage(''); }}
            style={{ flex: 1, padding: '16px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, borderBottom: activeTab === 'job' ? '4px solid var(--brand-saffron)' : '4px solid transparent', color: activeTab === 'job' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >Broadcast Job Alert</button>
        </div>
        
        {message && <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '8px', background: message.startsWith('Error') ? '#ffdddd' : '#ddffdd', color: '#333', textAlign: 'center', fontWeight: 600 }}>{message}</div>}

        {activeTab === 'paper' ? (
          <form onSubmit={handlePaperSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Exam Name (e.g. SSC CGL)" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={paperForm.examName} onChange={e => setPaperForm({...paperForm, examName: e.target.value})} />
            <div style={{ display: 'flex', gap: '16px' }}>
              <input type="number" placeholder="Year" required style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={paperForm.year} onChange={e => setPaperForm({...paperForm, year: e.target.value})} />
              <select required style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={paperForm.shift} onChange={e => setPaperForm({...paperForm, shift: e.target.value})}>
                <option value="">Select Shift...</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option>
              </select>
            </div>
            <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={paperForm.paperType} onChange={e => setPaperForm({...paperForm, paperType: e.target.value})}>
              <option value="Previous">Previous Year Paper</option><option value="Predicted">Predicted Practice Paper</option>
            </select>
            <input type="url" placeholder="Document URL (PDF/Drive)" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={paperForm.documentUrl} onChange={e => setPaperForm({...paperForm, documentUrl: e.target.value})} />
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' : 'Upload Paper'}</button>
          </form>
        ) : (
          <form onSubmit={handleJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Job Title (e.g. Probationary Officer)" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} />
            <input type="text" placeholder="Department (e.g. SBI, UPSC)" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={jobForm.department} onChange={e => setJobForm({...jobForm, department: e.target.value})} />
            <select required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={jobForm.requiredEducation} onChange={e => setJobForm({...jobForm, requiredEducation: e.target.value})}>
              <option value="">Required Minimum Education...</option>
              <option value="10th">10th Pass</option><option value="12th">12th Pass</option><option value="Graduate">Graduate</option><option value="Post-Graduate">Post-Graduate</option>
            </select>
            <input type="date" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} />
            <input type="url" placeholder="Application URL" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }} value={jobForm.applyUrl} onChange={e => setJobForm({...jobForm, applyUrl: e.target.value})} />
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' : 'Broadcast Job Alert'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
