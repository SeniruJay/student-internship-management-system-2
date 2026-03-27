import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, BookOpen, ArrowRight, CheckCircle2, Briefcase, Code, LineChart, Globe, Cpu, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const FloatingIcon = ({ Icon, delay, x, y, size, color }: { Icon: any, delay: number, x: string, y: string, size: number, color: string }) => (
  <motion.div
    className={`absolute ${x} ${y} ${color} select-none pointer-events-none opacity-20`}
    animate={{
      y: [0, -40, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    <Icon size={size} strokeWidth={1} />
  </motion.div>
);

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-zinc-900 dark:text-zinc-50 relative">
      {/* Abstract Animations */}
      <FloatingIcon Icon={Briefcase} delay={0} x="left-[10%]" y="top-[20%]" size={80} color="text-indigo-600 dark:text-indigo-400" />
      <FloatingIcon Icon={Code} delay={1.5} x="right-[15%]" y="top-[15%]" size={100} color="text-amber-500 dark:text-amber-400" />
      <FloatingIcon Icon={LineChart} delay={3} x="left-[20%]" y="bottom-[30%]" size={70} color="text-purple-600 dark:text-purple-400" />
      <FloatingIcon Icon={Globe} delay={4.5} x="right-[25%]" y="bottom-[25%]" size={90} color="text-indigo-500 dark:text-indigo-300" />
      <FloatingIcon Icon={Cpu} delay={2} x="left-[40%]" y="top-[10%]" size={60} color="text-amber-500 dark:text-amber-300" />
      <FloatingIcon Icon={Lightbulb} delay={5} x="right-[40%]" y="top-[30%]" size={80} color="text-purple-500 dark:text-purple-300" />

      {/* Hero Section */}
      <section className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Fueling the next generation of talent</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Launch Your Career <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 dark:from-indigo-400 dark:via-purple-400 dark:to-amber-400">
                With Premium Internships
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              The elite platform connecting ambitious students, top-tier companies, and dedicated lecturers. Powered by innovation, ambition, and endless opportunity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-zinc-50 bg-zinc-900 dark:text-zinc-950 dark:bg-zinc-50 rounded-full overflow-hidden transition-transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-zinc-50 bg-zinc-900 dark:text-zinc-950 dark:bg-zinc-50 rounded-full overflow-hidden transition-transform hover:scale-105"
                  >
                    <span className="relative z-10">Get Started Now</span>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors backdrop-blur-sm"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">A Masterpiece for Everyone</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light">Tailored, high-end experiences for students, companies, and universities.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-10 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/20 transition-colors border border-indigo-200 dark:border-indigo-500/20">
                <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">For Students</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="leading-relaxed">Build a professional profile and upload your CV</span>
                </li>
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="leading-relaxed">Browse and apply to top internship opportunities</span>
                </li>
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="leading-relaxed">Track applications and submit final reports</span>
                </li>
              </ul>
            </motion.div>

            {/* Company Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-10 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-colors group"
            >
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors border border-amber-200 dark:border-amber-500/20">
                <Building2 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">For Companies</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="leading-relaxed">Post internship openings and requirements</span>
                </li>
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="leading-relaxed">Review applicants and manage hiring status</span>
                </li>
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="leading-relaxed">Submit weekly performance feedback</span>
                </li>
              </ul>
            </motion.div>

            {/* Lecturer Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-10 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-colors group"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20 transition-colors border border-purple-200 dark:border-purple-500/20">
                <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">For Lecturers</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="leading-relaxed">Monitor student internship progress</span>
                </li>
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="leading-relaxed">Review company feedback and student reports</span>
                </li>
                <li className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="leading-relaxed">Schedule vivas and assign final grades</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
