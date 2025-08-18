"use client";
import React, { useState } from 'react';
import Landing from './landing/page';
import Dashboard from './dashboard/page';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Landing onSignupSuccess={handleSignupSuccess} />
      )}
    </div>
  );
}
