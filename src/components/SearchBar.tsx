import React, { useState, useEffect } from 'react';

type Props = {
  setDomain: (domain: string) => void;
  setResults: (results: string[]) => void;
  setGauResults: (results: string[]) => void;
  setLastScan: (scan: 'subfinder' | 'gau') => void;
};

const SearchBar: React.FC<Props> = ({ setDomain, setResults, setGauResults, setLastScan }) => {
  const [domain, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Remove local gauResults state
  // const [gauResults, setGauResults] = useState<string[]>([]);
  const [gauLoading, setGauLoading] = useState(false);
  const [gauError, setGauError] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, timeLeft]);

  // Utility to sanitize domain input
  function sanitizeDomain(input: string) {
    return input.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setLoading(true);
    setTimeLeft(30);
    const sanitized = sanitizeDomain(domain);
    setDomain(sanitized);
    setLastScan('subfinder');
    
    try {
      const response = await fetch('http://localhost:8000/api/subfinder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: sanitized }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error calling subfinder API:', error);
      setResults([]);
    } finally {
      setLoading(false);
      setTimeLeft(30);
    }
  };

  // GAU scan handler
  const handleGauScan = async () => {
    if (!domain) return;
    setGauLoading(true);
    setGauError(null);
    setGauResults([]);
    setLastScan('gau');
    const sanitized = sanitizeDomain(domain);
    try {
      const response = await fetch('http://localhost:8000/api/gau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: sanitized }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGauResults(data.urls || []);
    } catch (error: any) {
      setGauError(error.message || 'Unknown error');
    } finally {
      setGauLoading(false);
    }
  };

  return (
    <div className="search-container" style={{ position: 'relative' }}>
      {/* Prominent loading overlay for GAU scan */}
      {gauLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(24, 28, 47, 0.85)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.2rem',
          fontWeight: 600,
          borderRadius: 12,
        }}>
          <div className="spinner" style={{
            width: 48,
            height: 48,
            border: '6px solid #ff2222',
            borderTop: '6px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: 16,
          }} />
          Running GAU scan... Please wait
        </div>
      )}
      <form onSubmit={handleSubmit} className="searchbar-form">
        <input
          className="glow-search"
          type="text"
          placeholder="Enter domain (e.g. example.com)"
          value={domain}
          onChange={e => setDomainInput(e.target.value)}
          disabled={loading || gauLoading}
          autoFocus
        />
        <button className="go-btn" type="submit" disabled={loading || gauLoading}>
          {loading ? 'Scanning...' : 'Go'}
        </button>
        <button
          type="button"
          className="go-btn"
          style={{ marginLeft: 8 }}
          onClick={handleGauScan}
          disabled={gauLoading || loading}
        >
          {gauLoading ? 'GAU...' : 'GAU Scan'}
        </button>
      </form>
      
      {loading && (
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Scanning subdomains... {timeLeft}s remaining
          </div>
        </div>
      )}
      {/* Show GAU results or error */}
      {gauLoading && (
        <div className="progress-text">Running GAU scan...</div>
      )}
      {gauError && (
        <div className="progress-text" style={{ color: 'red' }}>GAU Error: {gauError}</div>
      )}
      {/* Remove local GAU results display here, now handled in App */}
    </div>
  );
};

export default SearchBar; 