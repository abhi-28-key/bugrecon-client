import React from 'react';

type HttpxResult = {
  url: string;
  status?: number;
  title?: string;
  server?: string;
  content_length?: string | number;
  headers?: Record<string, string>;
  tech?: string[];
  proxy?: string;
  error?: string;
};

type Props = {
  results: (string | HttpxResult)[];
  isDarkTheme: boolean;
};

const getStatusColor = (status?: number) => {
  if (!status) return '#aaa';
  if (status === 200) return '#10b981'; // subtle green
  if (status === 301 || status === 302) return '#f59e0b'; // subtle orange
  if (status === 403) return '#eab308'; // subtle yellow
  if (status >= 400 && status < 600) return '#ef4444'; // subtle red
  return '#aaa';
};

const ResultsPanel: React.FC<Props> = ({ results, isDarkTheme }) => {
  const colors = {
    primary: isDarkTheme ? '#00ff88' : '#667eea',
    background: isDarkTheme ? '#1a1f2e' : 'rgba(255, 255, 255, 0.1)',
    surface: isDarkTheme ? '#2d3748' : 'rgba(255, 255, 255, 0.95)',
    text: isDarkTheme ? '#ffffff' : '#1e293b',
    border: isDarkTheme ? '#475569' : 'rgba(102, 126, 234, 0.3)',
  };

  return (
    <div className="results-panel" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {results.length === 0 ? (
        <span style={{ color: isDarkTheme ? '#888' : '#4c1d95' }}>Subdomain results will appear here.</span>
      ) : (
        <div
          className="results-list"
          style={{
            maxHeight: 400,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.5rem',
            padding: '0.5rem',
            background: colors.background,
            borderRadius: 6,
            border: `1px solid ${colors.border}`,
          }}
        >
          {results.map((r, i) => {
            if (typeof r === 'string') {
              return (
                <div key={i} className="result-item" style={{ 
                  color: colors.text,
                  padding: '8px 12px',
                  background: colors.surface,
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                  fontFamily: 'Fira Mono, monospace',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                }}>
                  {r}
                </div>
              );
            }
            // httpx-toolkit result object
            return (
              <div key={i} className="result-item" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10,
                padding: '8px 12px',
                background: colors.surface,
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                color: colors.text,
                fontFamily: 'Fira Mono, monospace',
                fontSize: '0.9rem',
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
                flexWrap: 'wrap',
              }}>
                <span style={{ flex: 1 }}>{r.url}</span>
                {r.status && r.status === 200 && (
                  <span style={{ color: '#10b981', fontWeight: 700, marginLeft: 8, letterSpacing: 1, fontSize: '1.08em', fontFamily: 'Fira Mono, monospace' }}>LIVE</span>
                )}
                {r.status && (r.status === 301 || r.status === 302) && (
                  <span style={{ color: '#f59e0b', fontWeight: 700, marginLeft: 8, letterSpacing: 1, fontSize: '1.08em', fontFamily: 'Fira Mono, monospace' }}>REDIRECT</span>
                )}
                {r.status && r.status === 403 && (
                  <span style={{ color: '#eab308', fontWeight: 700, marginLeft: 8, letterSpacing: 1, fontSize: '1.08em', fontFamily: 'Fira Mono, monospace' }}>FORBIDDEN</span>
                )}
                {r.status && r.status >= 400 && r.status !== 403 && (
                  <span style={{ color: '#ef4444', fontWeight: 700, marginLeft: 8 }}>DEAD</span>
                )}
                {r.status && (
                  <span style={{
                    color: getStatusColor(r.status),
                    fontWeight: 700,
                    marginLeft: 8,
                    fontFamily: 'Fira Mono, monospace',
                    fontSize: '1.08em',
                  }}>[{r.status}]</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel; 