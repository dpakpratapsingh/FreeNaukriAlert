export default function Home() {
  return (
    <main style={{ minHeight: 'calc(100vh - 70px)', padding: '64px 0' }}>
      <div className="container">
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 64px auto' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Non-Profit • Pure Logic • India
          </div>
          <h1 style={{ fontSize: '56px', letterSpacing: '-1px', marginBottom: '24px' }}>
            Dominate the <span className="text-gradient">Competitive Journey</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Information must reach you. A unified notification alert system that strictly judges eligibility, not personality or emotion. 
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Begin 100-Question Check</a>
            <button className="btn" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              Explore Past Papers
            </button>
          </div>
        </div>

        {/* Vision Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div className="card">
            <h3 style={{ color: 'var(--brand-saffron)' }}>01. Complete Objectivity</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              We track your activity percentage based entirely on algorithmic scoring from the syllabus and Examiner Thought Processes. No emotional bias.
            </p>
          </div>
          
          <div className="card">
            <h3 style={{ color: 'var(--brand-navy)' }}>02. Lifecycle Notifications</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Loop through Job, Exam, and Syllabus alerts. When you succeed, you exit as an Employer or Contributor to help the next generation.
            </p>
          </div>
          
          <div className="card">
            <h3 style={{ color: 'var(--brand-green)' }}>03. Deep Practice Engine</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Sort predicted and previous papers strictly by Year and Shift. Don't waste time on irrelevant data.
            </p>
          </div>
          
        </div>

      </div>
    </main>
  );
}
