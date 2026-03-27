import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      login(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-zinc-900 py-12 px-6 sm:px-12 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 w-full max-w-md transition-colors duration-300 relative overflow-hidden">
        
        <div className="text-center mb-10 relative z-10">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome Back</h2>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-2">Sign in to your account</p>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 px-4 rounded-full font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md focus:outline-none flex justify-center text-sm"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400 relative z-10">
          Don't have an account?{' '}
          <Link to="/register" className="text-zinc-900 dark:text-white font-semibold transition-colors hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
