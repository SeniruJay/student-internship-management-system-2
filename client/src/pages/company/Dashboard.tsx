import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, CheckCircle, XCircle, PlusCircle } from 'lucide-react';

export default function CompanyDashboard() {
  const { token } = useAuth();
  const [internships, setInternships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('post');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [intRes, appRes, stuRes] = await Promise.all([
        fetch('/api/companies/internships', { headers }),
        fetch('/api/companies/applications', { headers }),
        fetch('/api/companies/students', { headers })
      ]);

      const intData = await intRes.json();
      const appData = await appRes.json();
      const stuData = await stuRes.json();

      setInternships(intData.internships || []);
      setApplications(appData.applications || []);
      setStudents(stuData.students || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const validateField = (fieldName: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Job title is required';
        } else if (value.trim().length < 5) {
          newErrors.title = 'Job title must be at least 5 characters long';
        } else if (value.trim().length > 100) {
          newErrors.title = 'Job title must be less than 100 characters';
        } else {
          delete newErrors.title;
        }
        break;
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.trim().length < 20) {
          newErrors.description = 'Description must be at least 20 characters long';
        } else if (value.trim().length > 1000) {
          newErrors.description = 'Description must be less than 1000 characters';
        } else {
          delete newErrors.description;
        }
        break;
      case 'requirements':
        if (!value.trim()) {
          newErrors.requirements = 'Requirements are required';
        } else if (value.trim().length < 20) {
          newErrors.requirements = 'Requirements must be at least 20 characters long';
        } else if (value.trim().length > 1000) {
          newErrors.requirements = 'Requirements must be less than 1000 characters';
        } else {
          delete newErrors.requirements;
        }
        break;
      case 'duration':
        if (!value.trim()) {
          newErrors.duration = 'Duration is required';
        } else if (!/^\d+\s+(month|week|day|year)s?$/i.test(value.trim())) {
          newErrors.duration = 'Duration must be in format: "6 months", "3 weeks", etc.';
        } else {
          delete newErrors.duration;
        }
        break;
      case 'deadline':
        if (!value) {
          newErrors.deadline = 'Application deadline is required';
        } else {
          const deadlineDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (deadlineDate <= today) {
            newErrors.deadline = 'Application deadline must be in the future';
          } else {
            delete newErrors.deadline;
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handlePostInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const res = await fetch('/api/companies/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, requirements, duration, deadline })
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Success response:', data);
        alert('Internship posted successfully');
        setTitle(''); setDescription(''); setRequirements(''); setDuration(''); setDeadline('');
        setErrors({});
        fetchData();
      } else {
        const errorData = await res.json();
        console.error('Server error:', errorData);
        alert(`Error posting internship: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/companies/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWeeklyReport = async (studentId: string) => {
    const weekNumber = prompt('Enter week number (e.g., 1):');
    const content = prompt('Enter report content/feedback:');
    if (!weekNumber || !content) return;

    try {
      const res = await fetch('/api/companies/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, weekNumber: parseInt(weekNumber), content })
      });
      if (res.ok) {
        alert('Weekly report submitted successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://www.shutterstock.com/image-vector/white-background-features-overlaying-light-600nw-2697439861.jpg" 
          alt="Light background overlay" 
          className="w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-slate-900/80 dark:via-indigo-900/80 dark:to-purple-900/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-zinc-100 dark:border-zinc-900 overflow-x-auto mb-10">
        <nav className="flex space-x-6 px-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('post')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'post' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Post Internship</button>
          <button onClick={() => setActiveTab('manage')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'manage' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Manage Internships</button>
          <button onClick={() => setActiveTab('applications')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'applications' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Review Applications</button>
          <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'students' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Browse Students</button>
        </nav>
      </div>

      {activeTab === 'post' && (
        <div className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl p-10 rounded-[2rem] shadow-sm border border-white/30 dark:border-zinc-700/30 transition-colors duration-300 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-50 tracking-tight"><PlusCircle className="text-zinc-900 dark:text-white h-6 w-6" /> Create New Posting</h2>
          <form onSubmit={handlePostInternship} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Job Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                onBlur={e => validateField('title', e.target.value)}
                className={`block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset placeholder:text-zinc-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow ${
                  errors.title 
                    ? 'ring-red-500/50 focus:ring-red-500/50' 
                    : 'ring-white/30 dark:ring-zinc-700/50 focus:ring-white/50 dark:focus:ring-zinc-600/50'
                }`} 
                placeholder="e.g. Software Engineering Intern" 
              />
              {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
              <textarea 
                required 
                rows={4} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                onBlur={e => validateField('description', e.target.value)}
                className={`block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset placeholder:text-zinc-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow ${
                  errors.description 
                    ? 'ring-red-500/50 focus:ring-red-500/50' 
                    : 'ring-white/30 dark:ring-zinc-700/50 focus:ring-white/50 dark:focus:ring-zinc-600/50'
                }`} 
                placeholder="Provide a detailed description of the internship role..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Requirements</label>
              <textarea 
                required 
                rows={5} 
                value={requirements} 
                onChange={e => setRequirements(e.target.value)} 
                onBlur={e => validateField('requirements', e.target.value)}
                className={`block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset placeholder:text-zinc-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow ${
                  errors.requirements 
                    ? 'ring-red-500/50 focus:ring-red-500/50' 
                    : 'ring-white/30 dark:ring-zinc-700/50 focus:ring-white/50 dark:focus:ring-zinc-600/50'
                }`} 
                placeholder="List the required skills, qualifications, and experience..."
              />
              {errors.requirements && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.requirements}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Duration</label>
                <input 
                  type="text" 
                  required 
                  value={duration} 
                  onChange={e => setDuration(e.target.value)} 
                  onBlur={e => validateField('duration', e.target.value)}
                  className={`block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset placeholder:text-zinc-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow ${
                    errors.duration 
                      ? 'ring-red-500/50 focus:ring-red-500/50' 
                      : 'ring-white/30 dark:ring-zinc-700/50 focus:ring-white/50 dark:focus:ring-zinc-600/50'
                  }`} 
                  placeholder="e.g. 6 Months" 
                />
                {errors.duration && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Application Deadline</label>
                <input 
                  type="date" 
                  required 
                  value={deadline} 
                  onChange={e => setDeadline(e.target.value)} 
                  onBlur={e => validateField('deadline', e.target.value)}
                  className={`block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset placeholder:text-zinc-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow w-full ${
                    errors.deadline 
                      ? 'ring-red-500/50 focus:ring-red-500/50' 
                    : 'ring-white/30 dark:ring-zinc-700/50 focus:ring-white/50 dark:focus:ring-zinc-600/50'
                  }`} 
                />
                {errors.deadline && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>}
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full bg-white/30 dark:bg-zinc-800/30 backdrop-blur-sm text-zinc-900 dark:text-zinc-50 px-6 py-3.5 rounded-full text-base font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-md border border-white/40 dark:border-zinc-600/40 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 dark:focus:ring-zinc-600/50">Publish Internship</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 tracking-tight">Your Active Postings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map(internship => (
              <div key={internship._id} className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/30 dark:border-zinc-700/30 transition-colors duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{internship.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium mb-4">Posted on {new Date(internship.createdAt).toLocaleDateString()}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed flex-grow">{internship.description}</p>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-auto bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-zinc-700/50">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Duration</span>
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Deadline</span>
                    <span>{internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
            {internships.length === 0 && <p className="text-zinc-500 text-base">You haven't posted any internships yet.</p>}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/30 dark:border-zinc-700/30 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Applicant</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">CV</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-white/10 dark:hover:bg-zinc-800/10 backdrop-blur-sm transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{app.student?.name}</div>
                      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{app.student?.email}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-zinc-600 dark:text-zinc-300">{app.internship?.title}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm">
                      <a href={app.cvUrl} target="_blank" rel="noreferrer" className="text-zinc-900 dark:text-white hover:underline flex items-center gap-1.5 font-semibold transition-colors">
                        <FileText className="w-4 h-4" /> View CV
                      </a>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border backdrop-blur-sm ${app.status === 'approved' ? 'bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20' : app.status === 'rejected' ? 'bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-500/20' : 'bg-amber-50/50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                      {app.status === 'pending' && (
                        <div className="flex gap-3">
                          <button onClick={() => handleUpdateStatus(app._id, 'approved')} className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors hover:scale-110"><CheckCircle className="w-6 h-6" /></button>
                          <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors hover:scale-110"><XCircle className="w-6 h-6" /></button>
                        </div>
                      )}
                      {app.status === 'approved' && (
                        <button onClick={() => handleWeeklyReport(app.student._id)} className="bg-white/30 dark:bg-zinc-800/30 backdrop-blur-sm text-zinc-900 dark:text-zinc-50 text-xs font-bold border border-white/40 dark:border-zinc-600/40 px-4 py-2 rounded-full transition-colors shadow-sm hover:scale-[1.02] active:scale-[0.98]">
                          Add Report
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {applications.length === 0 && <div className="p-12 text-center text-zinc-500 font-medium">No applications received yet.</div>}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <div key={student._id} className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/30 dark:border-zinc-700/30 transition-colors duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-5 mb-6">
                <div className="bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center transition-colors border border-white/30 dark:border-zinc-700/50">
                  <Users className="text-zinc-900 dark:text-zinc-50 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{student.user?.name}</h3>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{student.user?.email}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 mb-8 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-zinc-700/50">
                <div className="flex justify-between"><strong className="text-zinc-700 dark:text-zinc-200">GPA</strong> <span>{student.gpa || 'N/A'}</span></div>
                <div className="flex justify-between"><strong className="text-zinc-700 dark:text-zinc-200">Year</strong> <span>{student.year || 'N/A'}</span></div>
                <div className="flex justify-between"><strong className="text-zinc-700 dark:text-zinc-200">Contact</strong> <span>{student.contact || 'N/A'}</span></div>
              </div>
              {student.cvUrl && (
                <a href={student.cvUrl} target="_blank" rel="noreferrer" className="block text-center w-full bg-white/30 dark:bg-zinc-800/30 backdrop-blur-sm text-zinc-900 dark:text-zinc-50 py-3.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md border border-white/40 dark:border-zinc-600/40">
                  View Profile
                </a>
              )}
            </div>
          ))}
          {students.length === 0 && <p className="text-zinc-500 text-base col-span-full">No students available.</p>}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
