import React, { useState } from 'react';
import { saveAs } from "file-saver";
import axios from 'axios';
import ResultsPanel from './ResultsPanel';

const TOOL_OPTIONS = [
  { label: 'Subdomains', value: 'subfinder', icon: '🌐' },
  { label: 'GAU', value: 'gau', icon: '🔎' },
];

const ENDPOINTS: Record<string, string> = {
  subfinder: '/api/subfinder',
  gau: '/api/gau',
  // Add endpoints for xyz as needed
};

interface ReconToolProps {
  isDarkTheme: boolean;
}

export default function ReconTool({ isDarkTheme }: ReconToolProps) {
  const [domain, setDomain] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filter, setFilter] = useState('');
  const [whoisResult, setWhoisResult] = React.useState<any>(null);
  const [whoisLoading, setWhoisLoading] = React.useState(false);
  const [whoisError, setWhoisError] = React.useState<string | null>(null);
  const [showWhoisPanel, setShowWhoisPanel] = React.useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null); // 'subfinder', 'gau', ... or 'whois'
  const [isResultsMinimized, setIsResultsMinimized] = useState(false);

  const toolToUse = selectedTool ?? 'subfinder';

  // Theme-based colors
  const colors = {
    primary: isDarkTheme ? '#00ff88' : '#667eea',
    secondary: isDarkTheme ? '#00d4ff' : '#f093fb',
    background: isDarkTheme ? '#1a1f2e' : 'rgba(255, 255, 255, 0.1)',
    surface: isDarkTheme ? '#2d3748' : 'rgba(255, 255, 255, 0.95)',
    text: isDarkTheme ? '#ffffff' : '#1e293b',
    border: isDarkTheme ? '#475569' : 'rgba(102, 126, 234, 0.3)',
    glow: isDarkTheme ? '0 0 12px rgba(255, 255, 255, 0.15)' : '0 0 20px rgba(102, 126, 234, 0.2)',
    inputBg: isDarkTheme ? '#2d3748' : 'rgba(255, 255, 255, 0.9)',
    buttonBg: isDarkTheme ? '#00ff88' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  };

  const handleGo = async () => {
    setLoading(true);
    setResults([]);
    
    // Default: legacy tools
    let endpoint = ENDPOINTS[toolToUse];
    if (!endpoint) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      setResults(data.results || data.urls || []);
      if (data.error) setWhoisError(data.error);
    } catch (err: any) {
      setWhoisError(err.message || 'Unknown error');
    }
    setLoading(false);
    setShowResults(true);
    setFilter(''); // Reset filter on new scan
  };

  const handleWhoisLookup = async () => {
    setShowWhoisPanel(true);
    if (!domain) return;
    setWhoisLoading(true);
    setWhoisError(null);
    setWhoisResult(null);
    try {
      const resp = await axios.post<{ result: any }>('http://localhost:8000/api/whois', { domain });
      setWhoisResult(resp.data.result);
    } catch (err: any) {
      // Log the full error for debugging
      console.error('WHOIS lookup error:', err);
      setWhoisError(
        err?.response?.data?.detail ||
        err?.message ||
        'WHOIS lookup failed'
      );
    } finally {
      setWhoisLoading(false);
    }
  };

  // Export filtered results as TXT
  const handleExport = () => {
    if (filteredResults.length === 0) return;
    const blob = new Blob([filteredResults.join("\n")], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${selectedTool}_${domain || 'results'}.txt`);
  };

  // Filtered results (support string and object results, with type guard)
  const filteredResults = results.filter(r => {
    if (typeof r === 'string') {
      return r.toLowerCase().includes(filter.toLowerCase());
    } else if (
      r &&
      typeof r === 'object' &&
      'url' in r &&
      typeof (r as any).url === 'string'
    ) {
      return (r as any).url.toLowerCase().includes(filter.toLowerCase());
    }
    return false;
  });

  return (
    <div style={{ background: 'none', padding: 0, borderRadius: 0, boxShadow: 'none', maxWidth: '100%', margin: '0 auto', overflowX: 'hidden' }}>
      {/* Global style for scan-type-btn hover effect */}
      <style>{`
        button.scan-type-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: linear-gradient(90deg, ${colors.secondary} 0%, ${colors.primary} 100%) !important;
          color: ${isDarkTheme ? '#181c2f' : '#ffffff'} !important;
          box-shadow: ${colors.glow};
        }
      `}</style>
      
      {/* BugRecon Title */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        marginTop: '1rem'
      }}>
                 <h1 style={{
           fontSize: '4rem',
           fontWeight: 900,
           color: isDarkTheme ? '#00ff88' : '#ffffff',
           textShadow: isDarkTheme ? '0 0 20px #00ff88' : '0 0 20px rgba(255, 255, 255, 0.6)',
           letterSpacing: '3px',
           margin: '0 0 1rem 0',
           fontFamily: 'Orbitron, Fira Mono, monospace'
         }}>
           BugRecon
         </h1>
        
                 {/* Bug Hunter Quote */}
         <p style={{
           fontSize: '1.1rem',
           color: isDarkTheme ? '#b2ffb2' : '#64748b',
           fontStyle: 'italic',
           margin: '0',
           textAlign: 'center',
           maxWidth: '600px',
           marginLeft: 'auto',
           marginRight: 'auto',
           lineHeight: '1.5',
           textShadow: isDarkTheme ? '0 0 8px rgba(178, 255, 178, 0.3)' : 'none'
         }}>
           "Empowering bug bounty hunters with advanced reconnaissance automation."
         </p>
      </div>
              <form
          onSubmit={e => {
            e.preventDefault();
            if (!loading && domain) handleGo();
          }}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 8, justifyContent: 'center', gap: '0.5rem', flexDirection: 'row' }}
        >
        <input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder='Enter domain (e.g. example.com)'
          style={{
            marginRight: 0,
            padding: '20px 32px',
            borderRadius: 12,
            border: `2px solid ${colors.border}`,
            background: colors.inputBg,
            color: colors.text,
            fontSize: '1.4rem',
            boxShadow: colors.glow,
            width: 'auto',
            maxWidth: '500px',
            minWidth: '280px',
            flex: 1,
            outline: 'none',
            letterSpacing: 1,
            fontFamily: 'Fira Mono, monospace',
            transition: 'all 0.2s',
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !domain}
          style={{
            padding: '20px 48px',
            borderRadius: 12,
            background: colors.buttonBg,
            color: isDarkTheme ? '#0f1419' : '#667eea',
            fontWeight: 700,
            fontSize: '1.4rem',
            border: 'none',
            marginLeft: 12,
            boxShadow: colors.glow,
            cursor: loading || !domain ? 'not-allowed' : 'pointer',
            letterSpacing: 1,
            fontFamily: 'Fira Mono, monospace',
            transition: 'all 0.2s',
            minWidth: '120px',
            flexShrink: 0,
          }}
        >
          {loading ? 'Scanning...' : 'Go'}
        </button>
      </form>
      {/* Scan type buttons with extra padding above */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 18, marginTop: 28, flexWrap: 'wrap', padding: '0 1rem' }}>
        {TOOL_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setSelectedTool(opt.value);
              setActiveButton(opt.value);
              setShowWhoisPanel(false);
              setWhoisResult(null);
              setWhoisError(null);
              setShowResults(false);
            }}
            disabled={loading}
            className="scan-type-btn"
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: `2px solid ${colors.border}`,
              background: activeButton === opt.value
                ? `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                : colors.surface,
              color: activeButton === opt.value ? (isDarkTheme ? '#181c2f' : '#ffffff') : colors.primary,
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: activeButton === opt.value ? colors.glow : 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: 1,
            }}
          >
            <span style={{ fontSize: '1.1em' }}>{opt.icon}</span>
            <span style={{
              fontFamily: 'Exo, Arial, sans-serif',
              fontWeight: 800,
              fontSize: '1.1em',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}>{opt.label}</span>
          </button>
        ))}
        {/* Whois Lookup Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedTool(null); // Un-highlight scan tool buttons
            setActiveButton('whois');
            setShowWhoisPanel(true);
            setShowResults(false);
            setWhoisResult(null);
            setWhoisError(null);
            // Only call handleWhoisLookup when button is clicked
            handleWhoisLookup();
          }}
          disabled={loading || whoisLoading || !domain}
          className="scan-type-btn"
          style={{
            padding: '8px 18px',
            borderRadius: 10,
            border: `2px solid ${colors.border}`,
            background: activeButton === 'whois'
              ? `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              : colors.surface,
            color: activeButton === 'whois' ? (isDarkTheme ? '#181c2f' : '#ffffff') : colors.primary,
            fontWeight: 800,
            fontSize: '1.1em',
            fontFamily: 'Exo, Arial, sans-serif',
            boxShadow: activeButton === 'whois' ? colors.glow : 'none',
            cursor: whoisLoading ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: 1.5,
          }}
        >
          <span style={{ fontSize: '1.2em', display: 'flex', alignItems: 'center' }}>🔍</span> Whois Lookup
        </button>
      </div>
      {/* Whois Results Panel */}
      {showWhoisPanel ? (
        <>
          {whoisLoading && (
            <div style={{ color: colors.secondary, textAlign: 'center', fontFamily: 'Exo, Arial, sans-serif', fontWeight: 700, fontSize: '1.1em', marginBottom: 12 }}>
              Looking up WHOIS info for <span style={{ color: colors.primary }}>{domain}</span>...
            </div>
          )}
          {whoisError && (
            <div style={{ color: '#ff4d4f', textAlign: 'center', fontFamily: 'Exo, Arial, sans-serif', fontWeight: 700, fontSize: '1.1em', marginBottom: 12 }}>
              {whoisError.includes('WHOIS lookup failed for this TLD')
                ? 'WHOIS lookup failed for this domain or TLD. Try a different domain, or check your spelling.'
                : whoisError}
            </div>
          )}
          {whoisResult && (
                         <div style={{
               background: colors.surface,
               borderRadius: 16,
               boxShadow: colors.glow,
               margin: '18px auto 0',
               maxWidth: '95%',
               padding: '18px 28px 18px 28px',
               border: `2px solid ${colors.border}`,
               color: colors.text,
               fontFamily: 'Exo, Arial, sans-serif',
               fontSize: '1.08em',
               letterSpacing: 1,
               overflow: 'auto',
               maxHeight: 400,
               wordBreak: 'break-word',
             }}>
              <div style={{ color: colors.secondary, fontWeight: 900, fontSize: '1.3em', marginBottom: 10, textAlign: 'center', letterSpacing: 2 }}>
                Whois Record for <span style={{ color: colors.primary }}>{whoisResult.domain}</span>
              </div>
                             <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                 gap: '8px 16px', 
                 marginBottom: 8,
                 padding: '0 0.5rem'
               }}>
                <div><b>Registrar:</b> {whoisResult.registrar || '-'}</div>
                <div><b>Status:</b> {whoisResult.status || '-'}</div>
                <div><b>Created:</b> {whoisResult.creation_date || '-'}</div>
                <div><b>Expires:</b> {whoisResult.expiration_date || '-'}</div>
                <div><b>Updated:</b> {whoisResult.updated_date || '-'}</div>
                <div><b>IP Address:</b> {whoisResult.ip_address || '-'}</div>
                <div><b>Name Servers:</b> {Array.isArray(whoisResult.name_servers) ? whoisResult.name_servers.join(', ') : '-'}</div>
                <div><b>Emails:</b> {Array.isArray(whoisResult.emails) ? whoisResult.emails.join(', ') : (whoisResult.emails || '-')}</div>
                <div><b>DNSSEC:</b> {whoisResult.dnssec || '-'}</div>
                <div><b>ASN:</b> {whoisResult.asn || '-'}</div>
                <div><b>AS Name:</b> {whoisResult.as_name || '-'}</div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Only show scan results if not showing Whois panel, not loading, and a scan tool is selected (not Whois)
        showResults && !loading && selectedTool && selectedTool !== 'whois' && (
                     <div style={{
             background: colors.surface,
             borderRadius: 16,
             boxShadow: colors.glow,
             margin: '32px auto 0',
             maxWidth: '95%',
             width: '100%',
             padding: '0 0 24px 0',
             border: `2px solid ${colors.border}`,
             // No maxHeight, let height grow with content
             overflowY: 'auto',
             overflowX: 'hidden',
           }}>
            <div style={{
              color: colors.primary,
              fontFamily: 'Orbitron, Fira Mono, monospace',
              fontSize: '1.8rem',
              textAlign: 'center',
              fontWeight: 700,
              margin: '0 0 18px 0',
              paddingTop: 18,
              textShadow: colors.glow,
              letterSpacing: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 20,
              paddingRight: 20,
            }}>
              <span style={{ flex: 1, textAlign: 'center' }}>
                {toolToUse === 'subfinder' ? `Subdomains Found (${filteredResults.length})` :
                  toolToUse === 'gau' ? `GAU URLs Found (${filteredResults.length})` :
                  toolToUse.toUpperCase() + ` Results (${filteredResults.length})`}
              </span>
              <button
                onClick={() => setIsResultsMinimized(!isResultsMinimized)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primary,
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '40px',
                  height: '40px',
                }}
                title={isResultsMinimized ? 'Maximize' : 'Minimize'}
              >
                {isResultsMinimized ? '🔽' : '🔼'}
              </button>
            </div>
            {/* Export/Save Button and Results Content - Only show when not minimized */}
            {!isResultsMinimized && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <button
                    onClick={handleExport}
                    disabled={filteredResults.length === 0}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      color: isDarkTheme ? '#181c2f' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      border: 'none',
                      boxShadow: colors.glow,
                      cursor: filteredResults.length === 0 ? 'not-allowed' : 'pointer',
                      letterSpacing: 1,
                      fontFamily: 'Orbitron, Fira Mono, monospace',
                      textShadow: '0 0 4px #fff',
                      transition: 'all 0.2s',
                      outline: 'none',
                      marginBottom: 0,
                      marginTop: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      animation: filteredResults.length > 0 ? 'glowPulse 1.2s infinite alternate' : 'none',
                    }}
                  >
                    <span style={{ marginRight: 4, fontSize: '1.1em', display: 'flex', alignItems: 'center' }}>⬇️</span> Export/Save
                  </button>
                  <style>{`
                    @keyframes glowPulse {
                      0% { box-shadow: ${colors.glow}; }
                      100% { box-shadow: ${colors.glow.replace('0.3', '0.6')}; }
                    }
                  `}</style>
                </div>
                {/* Small search/filter box */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <input
                    type="text"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder={
                      toolToUse === 'subfinder' ? 'Find subdomain...' :
                        toolToUse === 'gau' ? 'Find .js, .php, ...' :
                          'Find result...'
                    }
                                         style={{
                       padding: '10px 20px',
                       borderRadius: 8,
                       border: `1px solid ${colors.border}`,
                       background: colors.background,
                       color: colors.text,
                       fontSize: '1.1rem',
                       boxShadow: colors.glow,
                       width: '90%',
                       maxWidth: '300px',
                       minWidth: '250px',
                       outline: 'none',
                       fontFamily: 'Fira Mono, monospace',
                       letterSpacing: 1,
                       transition: 'all 0.2s',
                     }}
                  />
                </div>
                {/* ResultsPanel: URLs grid is rendered directly inside the main output panel, no extra container */}
                <ResultsPanel results={filteredResults} isDarkTheme={isDarkTheme} />
              </>
            )}
          </div>
        )
      )}
      {/* Scanning progress/timer */}
      {loading && (
        <div style={{
          color: colors.text,
          fontFamily: 'Fira Mono, monospace',
          fontSize: '1.05rem',
          textAlign: 'center',
          margin: '18px auto 0',
          textShadow: isDarkTheme ? '0 0 6px #fff, 0 0 8px #222' : 'none',
          letterSpacing: 1,
          fontWeight: 500,
        }}>
          Scanning: <span style={{ color: colors.secondary, fontWeight: 700 }}>{domain}</span>
        </div>
      )}
    </div>
  );
} 