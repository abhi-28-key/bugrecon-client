import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ReconTool from './components/ReconTool';

const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`app-root ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <Navbar isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      <main className="main-centered-content">
        <ReconTool isDarkTheme={isDarkTheme} />
      </main>
      <div className="disclaimer">This tool is for educational and authorized security testing only. Unauthorized use is strictly prohibited.</div>
    </div>
  );
};

export default App;
