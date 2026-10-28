import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { GenAIAssistant } from '../ai/GenAIAssistant';

export const UserLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-slate-50/80 flex text-slate-900 font-sans">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar toggleMobile={() => setIsMobileOpen((prev) => !prev)} />

        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* GenAI Conversational Layer Widget */}
      <GenAIAssistant />
    </div>
  );
};
