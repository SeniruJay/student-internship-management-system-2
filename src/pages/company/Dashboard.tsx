import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function CompanyDashboard() {
  const { token } = useAuth();
  const [internships, setInternships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('postings');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');

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

  const handlePostInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/companies/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, requirements, duration })
      });
      if (res.ok) {
        alert('Internship posted successfully');
        setTitle(''); setDescription(''); setRequirements(''); setDuration('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
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
    <div className="space-y-6 relative z-10">
      <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 overflow-x-auto">
        <button onClick={() => setActiveTab('postings')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'postings' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>My Postings</button>
        <button onClick={() => setActiveTab('applications')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'applications' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Applications</button>
        <button onClick={() => setActiveTab('students')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'students' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Browse Students</button>
      </div>

      {activeTab === 'postings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 h-fit transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><Briefcase className="text-indigo-600 dark:text-indigo-400" /> Post Internship</h2>
            <form onSubmit={handlePostInternship} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Requirements</label>
                <textarea required value={requirements} onChange={e => setRequirements(e.target.value)} rows={2} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Duration</label>
                <input type="text" required value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 6 Months" className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-colors">Post Opportunity</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Your Active Postings</h2>
            {internships.map(internship => (
              <div key={internship._id} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{internship.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${internship.status === 'open' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'}`}>
                    {internship.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{internship.description}</p>
                <div className="flex gap-4 text-sm text-zinc-500">
                  <span><strong className="text-zinc-700 dark:text-zinc-300">Duration:</strong> {internship.duration}</span>
                  <span><strong className="text-zinc-700 dark:text-zinc-300">Requirements:</strong> {internship.requirements}</span>
                </div>
              </div>
            ))}
            {internships.length === 0 && <p className="text-zinc-500">You haven't posted any internships yet.</p>}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">CV</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{app.student?.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{app.student?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{app.internship?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={app.cvUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
                        <FileText className="w-4 h-4" /> View CV
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border
                        ${app.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          app.status === 'rejected' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                          'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {app.status === 'pending' && (
                        <div className="flex gap-3">
                          <button onClick={() => handleUpdateStatus(app._id, 'approved')} className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"><CheckCircle className="w-5 h-5" /></button>
                          <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"><XCircle className="w-5 h-5" /></button>
                        </div>
                      )}
                      {app.status === 'approved' && (
                        <button onClick={() => handleWeeklyReport(app.student._id)} className="text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors">
                          Add Weekly Report
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {applications.length === 0 && <div className="p-8 text-center text-zinc-500">No applications received yet.</div>}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <div key={student._id} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 w-12 h-12 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30 transition-colors">
                  <Users className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{student.user?.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{student.user?.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                <p><strong className="text-zinc-700 dark:text-zinc-300">GPA:</strong> {student.gpa || 'N/A'}</p>
                <p><strong className="text-zinc-700 dark:text-zinc-300">Year:</strong> {student.year || 'N/A'}</p>
                <p><strong className="text-zinc-700 dark:text-zinc-300">Contact:</strong> {student.contact || 'N/A'}</p>
              </div>
              {student.cvUrl && (
                <a href={student.cvUrl} target="_blank" rel="noreferrer" className="block text-center w-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 py-3 rounded-xl font-medium hover:bg-indigo-200 dark:hover:bg-indigo-500/20 transition-colors">
                  View Profile/CV
                </a>
              )}
            </div>
          ))}
          {students.length === 0 && <p className="text-zinc-500 col-span-3">No available students found.</p>}
        </div>
      )}
    </div>
  );
}
