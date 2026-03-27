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
        body: JSON.stringify({ title, description, requirements, duration, deadline })
      });
      if (res.ok) {
        alert('Internship posted successfully');
        setTitle(''); setDescription(''); setRequirements(''); setDuration(''); setDeadline('');
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
      <div className="border-b border-zinc-100 dark:border-zinc-900 overflow-x-auto mb-10">
        <nav className="flex space-x-6 px-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('post')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'post' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Post Internship</button>
          <button onClick={() => setActiveTab('manage')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'manage' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Manage Internships</button>
          <button onClick={() => setActiveTab('applications')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'applications' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Review Applications</button>
          <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'students' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Browse Students</button>
        </nav>
      </div>

      {activeTab === 'post' && (
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-50"><PlusCircle className="text-zinc-900 dark:text-white h-6 w-6" /> Create New Posting</h2>
          <form onSubmit={handlePostInternship} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Job Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" placeholder="e.g. Software Engineering Intern" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Description & Requirements</label>
              <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" placeholder="Describe the role, responsibilities, and required skills..."></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Duration</label>
                <input type="text" required value={duration} onChange={e => setDuration(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" placeholder="e.g. 6 Months" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Application Deadline</label>
                <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow w-full" />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3.5 rounded-full text-base font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-white">Publish Internship</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 tracking-tight">Your Active Postings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map(internship => (
              <div key={internship._id} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1 tracking-tight">{internship.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium mb-4">Posted on {new Date(internship.createdAt).toLocaleDateString()}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed flex-grow">{internship.description}</p>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-auto bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
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
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50">
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
                  <tr key={app._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
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
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : app.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
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
                        <button onClick={() => handleWeeklyReport(app.student._id)} className="text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 rounded-full transition-colors shadow-sm">
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
            <div key={student._id} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-5 mb-6">
                <div className="bg-zinc-100 dark:bg-zinc-800 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors">
                  <Users className="text-zinc-900 dark:text-zinc-50 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{student.user?.name}</h3>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{student.user?.email}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 mb-8 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                <div className="flex justify-between"><strong className="text-zinc-700 dark:text-zinc-200">GPA</strong> <span>{student.gpa || 'N/A'}</span></div>
                <div className="flex justify-between"><strong className="text-zinc-700 dark:text-zinc-200">Year</strong> <span>{student.year || 'N/A'}</span></div>
                <div className="flex justify-between"><strong className="text-zinc-700 dark:text-zinc-200">Contact</strong> <span>{student.contact || 'N/A'}</span></div>
              </div>
              {student.cvUrl && (
                <a href={student.cvUrl} target="_blank" rel="noreferrer" className="block text-center w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md">
                  View Profile
                </a>
              )}
            </div>
          ))}
          {students.length === 0 && <p className="text-zinc-500 text-base col-span-full">No students available.</p>}
        </div>
      )}
    </div>
  );
}
