import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      login(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative z-10">
      <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 dark:bg-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200 dark:border-indigo-500/20 transition-colors">
            <UserPlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Create Account</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Join the Internship Portal</p>
        </div>

        {error && <div className="bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center transition-colors">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">I am a...</label>
            <select
              className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
