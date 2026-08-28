import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import VerificationPage from './components/VerificationPage';
import FraudReportsPage from './components/FraudReportsPage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sherdetect_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sherdetect_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c0f] text-slate-900 dark:text-[#e5e2e1] flex flex-col font-body transition-colors duration-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 pt-6">
        {activeTab === 'landing'       && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'dashboard'     && <DashboardPage setActiveTab={setActiveTab} />}
        {activeTab === 'verification'  && <VerificationPage setActiveTab={setActiveTab} />}
        {activeTab === 'fraud-reports' && <FraudReportsPage setActiveTab={setActiveTab} />}
        {activeTab === 'settings'      && <SettingsPage theme={theme} toggleTheme={toggleTheme} />}
      </main>

      <footer className="bg-slate-100 dark:bg-[#07090b] border-t border-slate-200 dark:border-white/5 py-6 text-xs font-mono text-slate-500 dark:text-gray-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-[#97d700]"></span>
            <span>SHERDETECT &copy; 2026 · AI Powered Fraud Detection System</span>
          </div>
          <div className="flex items-center space-x-4 font-bold text-slate-700 dark:text-[#00E5FF]">
            <span>Developed By Sherlock Family</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
