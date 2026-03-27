import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function LecturerDashboard() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [vivas, setVivas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('students');

  // Viva Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [stuRes, repRes, vivaRes] = await Promise.all([
        fetch('/api/lecturers/students', { headers }),
        fetch('/api/lecturers/reports', { headers }),
        fetch('/api/lecturers/viva', { headers })
      ]);

      const stuData = await stuRes.json();
      const repData = await repRes.json();
      const vivaData = await vivaRes.json();

      setStudents(stuData.students || []);
      setReports(repData.reports || []);
      setVivas(vivaData.vivas || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleScheduleViva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }
    try {
      const res = await fetch('/api/lecturers/viva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId: selectedStudent, date, time, instructions })
      });
      if (res.ok) {
        alert('Viva scheduled successfully');
        setSelectedStudent(''); setDate(''); setTime(''); setInstructions('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeViva = async (vivaId: string) => {
    const grade = prompt('Enter grade (e.g., A, B+, 85%):');
    if (!grade) return;

    try {
      const res = await fetch(`/api/lecturers/viva/${vivaId}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ grade })
      });
      if (res.ok) {
        alert('Grade assigned successfully');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      <div className="border-b border-zinc-100 dark:border-zinc-900 overflow-x-auto mb-10">
        <nav className="flex space-x-6 px-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'students' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Student Progress</button>
          <button onClick={() => setActiveTab('reports')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'reports' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Reports</button>
          <button onClick={() => setActiveTab('viva')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'viva' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Viva & Grading</button>
        </nav>
      </div>

      {activeTab === 'students' && (
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Student</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">GPA / Year</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Internship Status</th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                {students.map(student => (
                  <tr key={student._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center transition-colors">
                          <Users className="h-5 w-5 text-zinc-900 dark:text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{student.user?.name}</div>
                          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{student.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{student.gpa ? `GPA: ${student.gpa}` : 'N/A'}</div>
                      <div className="text-xs font-medium text-zinc-500">{student.year || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {student.internship ? (
                        <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Placed
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5 mr-1" /> Seeking
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      {student.internship ? (
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{student.internship.company?.name}</div>
                          <div className="text-xs font-medium text-zinc-500">{student.internship.title}</div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 font-medium">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {students.length === 0 && <div className="p-12 text-center text-zinc-500 font-medium">No students found.</div>}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map(report => (
            <div key={report._id} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-zinc-100 dark:bg-zinc-800 w-12 h-12 rounded-xl flex items-center justify-center transition-colors">
                    <FileText className="text-zinc-900 dark:text-white w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{report.type === 'weekly' ? `Weekly Report (Week ${report.weekNumber})` : 'Final Report'}</h3>
                </div>
                <span className={`px-3 py-1 ml-2 text-xs font-bold rounded-full border ${report.type === 'final' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}`}>
                  {report.type.toUpperCase()}
                </span>
              </div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6 space-y-2">
                <p><strong className="text-zinc-900 dark:text-zinc-200">Student:</strong> {report.student?.name}</p>
                {report.company && <p><strong className="text-zinc-900 dark:text-zinc-200">Company:</strong> {report.company?.name}</p>}
                <p><strong className="text-zinc-900 dark:text-zinc-200">Submitted:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl text-sm text-zinc-700 dark:text-zinc-300 mb-6 border border-zinc-100 dark:border-zinc-800 transition-colors leading-relaxed">
                {report.content}
              </div>
              {report.fileUrl && (
                <a href={report.fileUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md">
                  <FileText className="w-4 h-4" /> View Attached File
                </a>
              )}
            </div>
          ))}
          {reports.length === 0 && <p className="text-zinc-500 font-medium col-span-2">No reports submitted yet.</p>}
        </div>
      )}

      {activeTab === 'viva' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-10 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 h-fit transition-colors duration-300 max-w-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-50 tracking-tight"><Calendar className="text-zinc-900 dark:text-white h-6 w-6" /> Schedule Viva</h2>
            <form onSubmit={handleScheduleViva} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Select Student</label>
                <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow appearance-none cursor-pointer">
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.user._id} value={s.user._id}>{s.user.name} ({s.user.email})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Date</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow dark:[color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Time</label>
                  <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow dark:[color-scheme:dark]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Instructions</label>
                <textarea required value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:focus:ring-white sm:text-sm sm:leading-6 bg-zinc-50 dark:bg-zinc-950 transition-shadow" placeholder="e.g. Prepare a 10 min presentation..."></textarea>
              </div>
              <button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3.5 rounded-full text-base font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-md transition-all focus:outline-none">Schedule Viva</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 tracking-tight">Scheduled Vivas & Grades</h2>
            {vivas.map(viva => (
              <div key={viva._id} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{viva.student?.name}</h3>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{viva.student?.email}</p>
                  </div>
                  {viva.grade ? (
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Grade: {viva.grade}</span>
                  ) : (
                    <button onClick={() => handleGradeViva(viva._id)} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-sm transition-all focus:outline-none whitespace-nowrap">
                      Assign Grade
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-zinc-700 dark:text-zinc-300 mt-4 bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors">
                  <div><strong className="text-zinc-900 dark:text-zinc-200">Date:</strong> {viva.date}</div>
                  <div><strong className="text-zinc-900 dark:text-zinc-200">Time:</strong> {viva.time}</div>
                  <div className="col-span-2"><strong className="text-zinc-900 dark:text-zinc-200">Instructions:</strong> {viva.instructions}</div>
                </div>
              </div>
            ))}
            {vivas.length === 0 && <p className="text-zinc-500 font-medium">No vivas scheduled yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
