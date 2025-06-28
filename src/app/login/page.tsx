"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [clientCode, setClientCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);
  const router = useRouter();
  const { isLoggedIn, login: setAuthState } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCode.trim()) {
      setError('Please enter your client code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(clientCode.trim());
      
      if (result.success && result.client) {
        setAuthState(result.client);
        router.push('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-400">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div className="bg-black/95 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 shadow-2xl shadow-orange-500/10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Client Portal</h1>
            <p className="text-slate-400">Enter your unique client code to access your dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="clientCode" className="block text-sm font-medium text-slate-300 mb-2">
                Client Code
              </label>
              <div className="relative">
                <input
                  type={showCode ? "text" : "password"}
                  id="clientCode"
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value.toUpperCase())}
                  placeholder="Enter your client code"
                  className="w-full px-4 py-3 bg-black/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-400 transition-colors"
                  disabled={isLoading}
                >
                  {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !clientCode.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-center text-sm text-slate-500">
              Don't have a client code?{' '}
              <a href="/contact" className="text-orange-400 hover:text-orange-300 transition-colors">
                Contact us
              </a>
            </p>
          </div>
        </div>

        {/* Sample Codes for Demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800"
        >
          <p className="text-sm text-slate-400 mb-2">Demo client codes:</p>
          <div className="flex flex-wrap gap-2">
            <code 
              className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs cursor-pointer hover:bg-orange-500/30 transition-colors"
              onClick={() => setClientCode('SPARKLE2024')}
            >
              SPARKLE2024
            </code>
            <code 
              className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs cursor-pointer hover:bg-orange-500/30 transition-colors"
              onClick={() => setClientCode('DEMO2024')}
            >
              DEMO2024
            </code>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 