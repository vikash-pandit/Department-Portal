import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import { User } from './types/User';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'home'>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {currentPage === 'login' ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <HomePage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;