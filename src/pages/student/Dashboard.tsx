import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [internships, setInternships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [vivas, setVivas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [gpa, setGpa] = useState('');
  const [address, setAddress] = useState('');
  const [year, setYear] = useState('');
  const [contact, setContact] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [profRes, intRes, appRes, vivaRes] = await Promise.all([
        fetch('/api/students/profile', { headers }),
        fetch('/api/students/internships', { headers }),
        fetch('/api/students/applications', { headers }),
        fetch('/api/students/viva', { headers })
      ]);

      const profData = await profRes.json();
      const intData = await intRes.json();
      const appData = await appRes.json();
      const vivaData = await vivaRes.json();

      if (profData.profile) {
        setProfile(profData.profile);
        setGpa(profData.profile.gpa ?? '');
        setAddress(profData.profile.address || '');
        setYear(profData.profile.year || '');
        setContact(profData.profile.contact || '');
        setCvUrl(profData.profile.cvUrl || '');
        setAdditionalDetails(profData.profile.additionalDetails || '');
      }
      setInternships(intData.internships || []);
      setApplications(appData.applications || []);
      setVivas(vivaData.vivas || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ gpa, address, year, contact, cvUrl, additionalDetails })
      });
      if (res.ok) {
        alert('Profile updated successfully');
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the profile');
    }
  };

  const handleApply = async (internshipId: string) => {
    if (!cvUrl) {
      alert('Please update your profile with a CV link first.');
      return;
    }
    try {
      const res = await fetch('/api/students/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ internshipId, cvUrl })
      });
      if (res.ok) {
        alert('Applied successfully');
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = (e.target as any).content.value;
    const fileUrl = (e.target as any).fileUrl.value;
    try {
      const res = await fetch('/api/students/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content, fileUrl })
      });
      if (res.ok) {
        alert('Report submitted successfully');
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 overflow-x-auto">
        <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Profile</button>
        <button onClick={() => setActiveTab('internships')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'internships' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Find Internships</button>
        <button onClick={() => setActiveTab('applications')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'applications' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>My Applications</button>
        <button onClick={() => setActiveTab('viva')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'viva' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Viva & Reports</button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><FileText className="text-indigo-600 dark:text-indigo-400" /> My Profile</h2>
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">GPA</label>
              <input type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">University Year</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" placeholder="e.g. 3rd Year" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Contact Number</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">CV Link (Google Drive, etc.)</label>
              <input type="url" value={cvUrl} onChange={e => setCvUrl(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Additional Details</label>
              <textarea value={additionalDetails} onChange={e => setAdditionalDetails(e.target.value)} rows={3} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50"></textarea>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-colors">Save Profile</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'internships' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><Briefcase className="text-indigo-600 dark:text-indigo-400" /> Available Internships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internships.map(internship => (
              <div key={internship._id} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors duration-300">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{internship.title}</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-4">{internship.company?.name}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3">{internship.description}</p>
                <div className="text-sm text-zinc-500 mb-4">
                  <strong className="text-zinc-700 dark:text-zinc-300">Duration:</strong> {internship.duration}
                </div>
                <button 
                  onClick={() => handleApply(internship._id)}
                  className="w-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 py-3 rounded-xl font-medium hover:bg-indigo-200 dark:hover:bg-indigo-500/20 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            ))}
            {internships.length === 0 && <p className="text-zinc-500">No internships available at the moment.</p>}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">{app.internship?.company?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{app.internship?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border
                        ${app.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          app.status === 'rejected' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                          'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'}`}>
                        {app.status === 'pending' && <Clock className="w-3 h-3 mr-1 mt-0.5" />}
                        {app.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1 mt-0.5" />}
                        {app.status === 'rejected' && <XCircle className="w-3 h-3 mr-1 mt-0.5" />}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {applications.length === 0 && <div className="p-8 text-center text-zinc-500">You haven't applied to any internships yet.</div>}
        </div>
      )}

      {activeTab === 'viva' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Submit Final Report</h2>
            <form onSubmit={handleReportSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Report Description/Summary</label>
                <textarea name="content" required rows={4} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Report Link (Google Drive, etc.)</label>
                <input type="url" name="fileUrl" required className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" placeholder="https://..." />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-colors">Submit Report</button>
            </form>
          </div>

          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Viva Schedules</h2>
            <div className="space-y-4">
              {vivas.map(viva => (
                <div key={viva._id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Scheduled by: {viva.lecturer?.name}</h3>
                    {viva.grade && <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full">Grade: {viva.grade}</span>}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2"><strong className="text-zinc-700 dark:text-zinc-300">Date:</strong> {viva.date} at {viva.time}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400"><strong className="text-zinc-700 dark:text-zinc-300">Instructions:</strong> {viva.instructions}</p>
                </div>
              ))}
              {vivas.length === 0 && <p className="text-zinc-500">No viva scheduled yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
