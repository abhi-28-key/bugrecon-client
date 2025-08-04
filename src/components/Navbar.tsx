import React from 'react';

interface NavbarProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkTheme, toggleTheme }) => (
  <>
    <nav className="navbar">
      <div className="navbar-title">BugRecon</div>
      <div className="navbar-links">
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkTheme ? '☀️' : '🌙'}
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {isDarkTheme ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>
    </nav>
    <div className="navbar-glow" />
  </>
);

export default Navbar; 