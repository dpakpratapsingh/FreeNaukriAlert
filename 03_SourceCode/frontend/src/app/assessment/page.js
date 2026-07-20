'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Assessment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  // Mocking the generation of Syllabus and Examiner Thought Process questions
  useEffect(() => {
    if (!email) {
      router.push('/register');
      return;
    }

    // Generate the full 100-Question limit dynamically
    const generateQuestions = () => {
      const qList = [];
      for (let i = 1; i <= 100; i++) {
        const type = i <= 50 ? 'Syllabus Check' : 'Examiner Thought Process Check';
        qList.push({
          id: i,
          type: type,
          text: `[${type}] Question ${i}: Which of the following is the most logical answer to this problem?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 'Option A' // Dummy correct answer for all
        });
      }
      return qList;
    };
    
    setQuestions(generateQuestions());
  }, [email, router]);

  const handleSelect = (questionId, selectedOption, correctOption) => {
    const existing = answers.find(a => a.questionId === questionId);
    const isCorrect = selectedOption === correctOption;
    
    if (existing) {
      setAnswers(answers.map(a => a.questionId === questionId ? { ...a, selectedOption, isCorrect } : a));
    } else {
      setAnswers([...answers, { questionId, selectedOption, isCorrect }]);
    }
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      setError('Please complete all questions before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail: email, answers })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit assessment');

      // Success, route back to dashboard to see new Activity Score
      router.push(`/dashboard?email=${email}&assessment=completed`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (questions.length === 0) return <div className="container" style={{ padding: '64px 24px' }}>Loading Assessment...</div>;

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>The 100-Question Check</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Testing your Syllabus Knowledge and Examiner Thought Process.
          <br/>
          <strong>Remember:</strong> We judge your eligibility, not your emotion.
        </p>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '24px', textAlign: 'center', fontWeight: 600 }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {questions.map((q, index) => (
          <div key={q.id} className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: 800, color: 'var(--brand-navy)' }}>Question {index + 1}</span>
              <span style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '4px 12px', borderRadius: '16px', fontWeight: 600, color: 'var(--brand-saffron)' }}>
                {q.type}
              </span>
            </div>
            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>{q.text}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {q.options.map(opt => {
                const isSelected = answers.find(a => a.questionId === q.id)?.selectedOption === opt;
                return (
                  <label 
                    key={opt} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                      border: `2px solid ${isSelected ? 'var(--brand-navy)' : 'var(--border-color)'}`, 
                      borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition)',
                      background: isSelected ? 'var(--bg-secondary)' : 'transparent'
                    }}
                  >
                    <input 
                      type="radio" 
                      name={`question-${q.id}`} 
                      value={opt} 
                      checked={isSelected}
                      onChange={() => handleSelect(q.id, opt, q.correct)}
                      style={{ transform: 'scale(1.2)', accentColor: 'var(--brand-navy)' }}
                    />
                    <span style={{ fontWeight: isSelected ? 700 : 500 }}>{opt}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit} 
          disabled={loading}
          style={{ width: '100%', maxWidth: '300px', padding: '16px', fontSize: '18px' }}
        >
          {loading ? 'Evaluating Protocol...' : 'Submit Assessment'}
        </button>
      </div>

    </div>
  );
}
