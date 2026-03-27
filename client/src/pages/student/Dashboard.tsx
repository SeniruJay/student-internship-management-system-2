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
      <div className="border-b border-zinc-100 dark:border-zinc-900 overflow-x-auto mb-10">
        <nav className="flex space-x-6 px-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'profile' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Profile</button>
          <button onClick={() => setActiveTab('internships')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'internships' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Find Internships</button>
          <button onClick={() => setActiveTab('applications')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'applications' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>My Applications</button>
          <button onClick={() => setActiveTab('viva')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'viva' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Viva & Reports</button>
        </nav>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-50"><FileText className="text-zinc-900 dark:text-white h-6 w-6" /> My Profile</h2>
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">GPA</label>
              <input type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">University Year</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" placeholder="e.g. 3rd Year" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Contact Number</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">CV Link (Google Drive, etc.)</label>
              <input type="url" value={cvUrl} onChange={e => setCvUrl(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Additional Details</label>
              <textarea value={additionalDetails} onChange={e => setAdditionalDetails(e.target.value)} rows={4} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow"></textarea>
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3.5 rounded-full text-base font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-white">Save Profile</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'internships' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 tracking-tight">Available Internships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map(internship => (
              <div key={internship._id} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1 tracking-tight">{internship.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-4">{internship.company?.name}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed flex-grow">{internship.description}</p>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Duration</span>
                    <span>{internship.duration}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleApply(internship._id)}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3.5 rounded-full text-base font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-sm transition-all focus:outline-none"
                >
                  Apply Now
                </button>
              </div>
            ))}
            {internships.length === 0 && <p className="text-zinc-500 font-medium">No internships available at the moment.</p>}
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Company</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{app.internship?.company?.name}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-zinc-600 dark:text-zinc-300">{app.internship?.title}</td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                        ${app.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          app.status === 'rejected' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                          'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'}`}>
                        {app.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1.5" />}
                        {app.status === 'approved' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                        {app.status === 'rejected' && <XCircle className="w-3.5 h-3.5 mr-1.5" />}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-zinc-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {applications.length === 0 && <div className="p-12 text-center text-zinc-500 font-medium">You haven't applied to any internships yet.</div>}
        </div>
      )}

      {activeTab === 'viva' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-zinc-50 tracking-tight">Submit Final Report</h2>
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Report Description/Summary</label>
                <textarea name="content" required rows={5} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Report Link (Google Drive, etc.)</label>
                <input type="url" name="fileUrl" required className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" placeholder="https://..." />
              </div>
              <button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3.5 rounded-full text-base font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-md transition-all focus:outline-none">Submit Report</button>
            </form>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-zinc-50 tracking-tight">Viva Schedules</h2>
            <div className="space-y-4">
              {vivas.map(viva => (
                <div key={viva._id} className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 bg-white dark:bg-zinc-950 shadow-sm transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Lecturer: {viva.lecturer?.name}</h3>
                    {viva.grade && <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Grade: {viva.grade}</span>}
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl space-y-2">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400"><strong className="text-zinc-900 dark:text-zinc-200">Date:</strong> {viva.date} at {viva.time}</p>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400"><strong className="text-zinc-900 dark:text-zinc-200">Instructions:</strong> {viva.instructions}</p>
                  </div>
                </div>
              ))}
              {vivas.length === 0 && <p className="text-base text-zinc-500 font-medium">No viva scheduled yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
