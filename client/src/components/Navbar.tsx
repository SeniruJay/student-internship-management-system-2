import React from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { useTheme } from '../context/ThemeContext';

import { GraduationCap, LogOut, Sun, Moon } from 'lucide-react';



export default function Navbar() {

  const { user, logout } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();



  const handleLogout = () => {

    logout();

    navigate('/login');

  };



  return (

    <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-zinc-50 sticky top-0 z-50 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-20">

          <div className="flex items-center">

            <Link to="/" className="flex items-center gap-2 group">

              <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">

                <GraduationCap className="h-5 w-5" />

              </div>

              <span className="font-extrabold text-xl hidden sm:block text-zinc-900 dark:text-zinc-50 tracking-tight">InterNova</span>

            </Link>

          </div>

          <div className="flex items-center gap-4">

            <button

              onClick={toggleTheme}

              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"

              aria-label="Toggle theme"

            >

              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}

            </button>

            {user ? (

              <>

                <Link to="/dashboard" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors">

                  Dashboard

                </Link>

                <div className="text-sm hidden sm:block text-zinc-500 dark:text-zinc-400 font-medium">

                  {user.name} <span className="text-zinc-400 dark:text-zinc-500 font-normal">({user.role})</span>

                </div>

                <button

                  onClick={handleLogout}

                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"

                >

                  <LogOut className="h-4 w-4" />

                  Logout

                </button>

              </>

            ) : (

              <div className="flex items-center gap-2">

                <Link to="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors">

                  Sign in

                </Link>

                <Link to="/register" className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">

                  Get Started

                </Link>

              </div>

            )}

          </div>

        </div>

      </div>

    </nav>

  );

}

