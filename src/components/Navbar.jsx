import React from 'react';
import { 
  Shield, LayoutDashboard, SearchCheck, Settings,
  Sun, Moon
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  const navItems = [
    { id: 'landing',       label: 'Overview',           icon: Shield },
    { id: 'verification',  label: 'Verify Document',    icon: SearchCheck },
    { id: 'dashboard',     label: 'Forensic Dashboard', icon: LayoutDashboard },
    { id: 'settings',      label: 'Settings',           icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d0f12]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 font-body transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#97d700] to-[#00E5FF] p-0.5 shadow-lg shadow-[#97d700]/20 group-hover:shadow-[#00E5FF]/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-900 dark:bg-[#0d0f12] rounded-[10px] flex items-center justify-center">
                <span className="font-headline font-black text-sm tracking-tighter text-[#97d700] group-hover:scale-110 transition-transform">
                  SD
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-headline font-black text-2xl tracking-tight">
                  <span className="text-[#97d700]">Sher</span><span className="text-[#00E5FF]">Detect</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold rounded-full bg-[#97d700]/15 text-[#97d700] border border-[#97d700]/40">
                  AI FORENSIC
                </span>
              </div>
              <p className="text-[9px] font-mono text-slate-500 dark:text-gray-400 tracking-wider">
                AI POWERED FRAUD DETECTION SYSTEM
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 dark:bg-[#15191e] p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black shadow-md shadow-[#97d700]/25 font-bold'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-500 dark:text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions & Theme Switcher */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#15191e] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#1c2128] transition flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-[#FFAB00]" />
                : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>




          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-slate-100 dark:bg-[#15191e] border-t border-slate-200 dark:border-white/5 py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isActive
                  ? 'text-green-700 dark:text-[#97d700] font-bold'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
