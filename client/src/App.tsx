/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import LecturerDashboard from './pages/lecturer/Dashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'student': return <Navigate to="/student/dashboard" />;
    case 'company': return <Navigate to="/company/dashboard" />;
    case 'lecturer': return <Navigate to="/lecturer/dashboard" />;
    default: return <Navigate to="/login" />;
  }
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans flex flex-col relative transition-colors duration-300">
            <Navbar />
            <main className="flex-grow flex flex-col relative z-10 bg-zinc-50 dark:bg-zinc-950">
              <Routes>
                <Route path="/" element={<Landing />} />
                
                {/* Wrapped Routes */}
                <Route path="/*" element={
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    <Routes>
                      <Route path="/dashboard" element={<DashboardRedirect />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      <Route path="/student/*" element={
                        <ProtectedRoute allowedRoles={['student']}>
                          <StudentDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/company/*" element={
                        <ProtectedRoute allowedRoles={['company']}>
                          <CompanyDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/lecturer/*" element={
                        <ProtectedRoute allowedRoles={['lecturer']}>
                          <LecturerDashboard />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </div>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
