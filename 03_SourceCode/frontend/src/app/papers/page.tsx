'use client';

import { useState, useEffect } from 'react';

export default function ExplorePapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [examName, setExamName] = useState('');
  const [year, setYear] = useState('');
  const [shift, setShift] = useState('');

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (examName) params.append('examName', examName);
      if (year) params.append('year', year);
      if (shift) params.append('shift', shift);

      const res = await fetch(`http://localhost:5033/api/papers?${params.toString()}`);
      const data = await res.json();
      setPapers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []); // Initial load

  return (
    <div className="container" style={{ padding: '64px 24px' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Explore Past Papers</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Search Previous & Predicted Practice Papers by Year and Shift.
        </p>
      </div>
      
      {/* Search Filters */}
      <div className="card" style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Exam Name (e.g. UPSC)" 
          value={examName}
          onChange={e => setExamName(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        />
        <input 
          type="number" 
          placeholder="Year" 
          value={year}
          onChange={e => setYear(e.target.value)}
          style={{ width: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        />
        <select 
          value={shift}
          onChange={e => setShift(e.target.value)}
          style={{ width: '150px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        >
          <option value="">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        <button onClick={fetchPapers} className="btn btn-primary">Search Engine</button>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div style={{ textAlign: 'center' }}>Querying Database...</div>
      ) : papers.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>
          No papers found matching your criteria. Be the first Contributor to upload one!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {papers.map((p: any) => (
            <div key={p.id} className="card" style={{ borderLeft: `4px solid ${p.paperType === 'Predicted' ? 'var(--brand-saffron)' : 'var(--brand-green)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800 }}>{p.examName}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.year}</span>
              </div>
              <div style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {p.shift} Shift • <strong style={{ color: p.paperType === 'Predicted' ? 'var(--brand-saffron)' : 'var(--brand-green)' }}>{p.paperType}</strong>
              </div>
              <a href={p.documentUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                Open Document
              </a>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
