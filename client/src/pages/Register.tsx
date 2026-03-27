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
    <div className="min-h-screen w-full flex items-center justify-center relative px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&crop=center&auto=format" 
          alt="Professional workspace background" 
          className="w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-zinc-800/80 to-zinc-900/90"></div>
      </div>

      {/* Registration Form */}
      <div className="bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl py-12 px-6 sm:px-12 rounded-[2rem] shadow-2xl border border-white/20 dark:border-zinc-700/50 w-full max-w-md transition-colors duration-300 relative z-10 overflow-hidden">
        
        <div className="text-center mb-10 relative z-10">
          <div className="bg-white/20 dark:bg-zinc-800/50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30 dark:border-zinc-600/50">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-sm font-medium text-white/80 mt-2">Join the Internship Portal</p>
        </div>

        {error && <div className="bg-red-50/90 dark:bg-red-500/20 backdrop-blur-sm border border-red-200/50 dark:border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-white placeholder-white/50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-600/50 placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-400 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-white placeholder-white/50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-600/50 placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-400 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Password</label>
            <input
              type="password"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-white placeholder-white/50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-600/50 placeholder:text-white/40 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-400 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">I am a...</label>
            <select
              className="block w-full rounded-xl border-0 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-600/50 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-400 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/30 backdrop-blur-sm transition-all cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student" className="bg-zinc-800 text-white">Student</option>
              <option value="company" className="bg-zinc-800 text-white">Company</option>
              <option value="lecturer" className="bg-zinc-800 text-white">Lecturer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white py-3.5 px-4 rounded-full font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg focus:outline-none flex justify-center text-sm mt-4 backdrop-blur-sm border border-white/20 dark:border-zinc-600/50"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/70 relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold transition-colors hover:underline hover:text-white/90">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
