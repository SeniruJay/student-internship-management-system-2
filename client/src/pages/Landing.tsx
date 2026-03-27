import { Link } from 'react-router-dom';
import { GraduationCap, Building2, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      
      {/* Hero Section */}
      <section 
        className="relative flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-40 text-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://cdn.prod.website-files.com/663c844e64d28ad42770d8f9/66b49977106e7d1b0a6b5c72_internship-program-benefits.webp')` }}
      >
        {/* Abstract Overlay for Text Readability */}
        <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] pointer-events-none"></div>

        {/* Subtle background glow mimicking premium SaaS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-xs font-semibold text-zinc-100 tracking-wide">The Standard for Education</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-8 text-white leading-[1.05] max-w-4xl text-balance drop-shadow-md">
              Building careers,<br />
              <span className="text-zinc-300">one connection at a time.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-200 mb-12 max-w-2xl font-medium leading-relaxed text-balance drop-shadow-sm">
              The unified platform for students, universities, and industry partners to orchestrate internship programs with unprecedented clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-zinc-900 bg-white rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    Enter Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-zinc-900 bg-white rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto shadow-lg"
                  >
                    Start for free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto shadow-md"
                  >
                    Sign in to account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white">A complete ecosystem.</h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">Everything you need to manage the lifecycle of an internship. Built with best-in-class workflows that adapt strictly to your role.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Student Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-8">
                <GraduationCap className="h-7 w-7 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">Students</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                Showcase your skills, discover opportunities, and track your industry journey with precision.
              </p>
              <ul className="space-y-4">
                {['Build a verified profile portfolio', 'One-click application pipeline', 'Submit synchronized weekly logs'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 text-zinc-900 dark:text-white shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-8">
                <Building2 className="h-7 w-7 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">Companies</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                Source top talent seamlessly. Define exact requirements and manage candidate states instantly.
              </p>
              <ul className="space-y-4">
                {['Publish roles programmatically', 'Candidate tracking dashboard', 'Direct bi-directional feedback'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 text-zinc-900 dark:text-white shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Lecturer Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-8">
                <BookOpen className="h-7 w-7 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">Academic Staff</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                Maintain academic rigor. Act as the bridge between theoretical learning and industry reality.
              </p>
              <ul className="space-y-4">
                {['Monitor full cohort trajectories', 'Log and review weekly reports', 'Record final assessments securely'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 text-zinc-900 dark:text-white shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
