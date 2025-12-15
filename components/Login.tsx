/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { sanitizeString } from '../utils';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  onSignup: (username: string, password: string, shopName: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sanitizedUsername = sanitizeString(username);
    const sanitizedPassword = sanitizeString(password);
    const sanitizedShopName = sanitizeString(shopName);

    if (!sanitizedUsername || !sanitizedPassword) {
      setError('Username and password are required');
      return;
    }

    if (sanitizedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (sanitizedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (mode === 'signup' && !sanitizedShopName) {
      setError('Shop name is required');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (mode === 'login') {
        onLogin(sanitizedUsername, sanitizedPassword);
      } else {
        onSignup(sanitizedUsername, sanitizedPassword, sanitizedShopName);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8E9DD] px-4 py-8 animate-fade-in">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFB673] rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#6A4FBF] rounded-full opacity-10 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#2AB9A9] rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[40px] bg-[#FFB673] shadow-2xl mb-6 animate-bounce">
            <span className="text-white font-black text-5xl">S</span>
          </div>
          <h1 className="text-4xl font-black text-[#4A4A4A] tracking-tight mb-2">ShopSmart</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Point of Sale System</p>
        </div>

        {/* Auth Card */}
        <div className="clay-card p-8 md:p-10 bg-white border-4 border-white/80 shadow-2xl">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-50 rounded-full border-2 border-white">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                mode === 'login'
                  ? 'bg-[#6A4FBF] text-white shadow-lg scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                mode === 'signup'
                  ? 'bg-[#6A4FBF] text-white shadow-lg scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">
                Username
              </label>
              <div className="clay-pill-container px-6 py-4 bg-white/60 flex items-center gap-3 border-2 border-transparent focus-within:border-[#6A4FBF]/20 transition-all">
                <span className="text-gray-400">👤</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 outline-none font-bold text-[#4A4A4A] bg-transparent"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">
                Password
              </label>
              <div className="clay-pill-container px-6 py-4 bg-white/60 flex items-center gap-3 border-2 border-transparent focus-within:border-[#6A4FBF]/20 transition-all">
                <span className="text-gray-400">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none font-bold text-[#4A4A4A] bg-transparent"
                  placeholder="Enter password"
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {/* Shop Name (Signup only) */}
            {mode === 'signup' && (
              <div className="animate-slide-up-fade">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">
                  Shop Name
                </label>
                <div className="clay-pill-container px-6 py-4 bg-white/60 flex items-center gap-3 border-2 border-transparent focus-within:border-[#6A4FBF]/20 transition-all">
                  <span className="text-gray-400">🏪</span>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="flex-1 outline-none font-bold text-[#4A4A4A] bg-transparent"
                    placeholder="e.g. Sunny Groceries"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-[20px] animate-pop">
                <p className="text-sm font-bold text-red-500 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full clay-button-primary py-6 text-lg font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_25px_50px_-12px_rgba(106,79,191,0.5)] hover:scale-[1.02] active:scale-95 transition-all mt-8"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : mode === 'login' ? (
                'Login to Dashboard'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                className="ml-2 text-[#6A4FBF] underline underline-offset-2 hover:text-[#FFB673] transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Secure • Offline-Ready • Fast
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
