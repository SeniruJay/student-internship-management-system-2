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
      <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 overflow-x-auto">
        <button onClick={() => setActiveTab('students')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'students' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Student Progress</button>
        <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'reports' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Reports</button>
        <button onClick={() => setActiveTab('viva')} className={`px-4 py-2 font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'viva' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>Viva & Grading</button>
      </div>

      {activeTab === 'students' && (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">GPA / Year</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Internship Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {students.map(student => (
                  <tr key={student._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded-full flex items-center justify-center transition-colors">
                          <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{student.user?.name}</div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">{student.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      <div>{student.gpa ? `GPA: ${student.gpa}` : 'N/A'}</div>
                      <div className="text-xs text-zinc-500">{student.year || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.internship ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          <CheckCircle className="w-3 h-3 mr-1 mt-0.5" /> Placed
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                          <Clock className="w-3 h-3 mr-1 mt-0.5" /> Seeking
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                      {student.internship ? (
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-50">{student.internship.company?.name}</div>
                          <div className="text-xs text-zinc-500">{student.internship.title}</div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {students.length === 0 && <div className="p-8 text-center text-zinc-500">No students found.</div>}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map(report => (
            <div key={report._id} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg border border-indigo-200 dark:border-indigo-500/20 transition-colors">
                    <FileText className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{report.type === 'weekly' ? `Weekly Report (Week ${report.weekNumber})` : 'Final Report'}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${report.type === 'final' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}`}>
                  {report.type.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 space-y-2">
                <p><strong className="text-zinc-700 dark:text-zinc-300">Student:</strong> {report.student?.name}</p>
                {report.company && <p><strong className="text-zinc-700 dark:text-zinc-300">Company:</strong> {report.company?.name}</p>}
                <p><strong className="text-zinc-700 dark:text-zinc-300">Submitted:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 mb-5 border border-zinc-200 dark:border-zinc-800/50 transition-colors">
                {report.content}
              </div>
              {report.fileUrl && (
                <a href={report.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors">
                  <FileText className="w-4 h-4" /> View Attached File
                </a>
              )}
            </div>
          ))}
          {reports.length === 0 && <p className="text-zinc-500 col-span-2">No reports submitted yet.</p>}
        </div>
      )}

      {activeTab === 'viva' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 h-fit transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><Calendar className="text-indigo-600 dark:text-indigo-400" /> Schedule Viva</h2>
            <form onSubmit={handleScheduleViva} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Select Student</label>
                <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50 appearance-none">
                  <option value="" className="bg-white dark:bg-zinc-900">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.user._id} value={s.user._id} className="bg-white dark:bg-zinc-900">{s.user.name} ({s.user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50 dark:[color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Time</label>
                <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50 dark:[color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Instructions</label>
                <textarea required value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} className="w-full px-4 py-3 bg-white dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-zinc-900 dark:text-zinc-50" placeholder="e.g. Prepare a 10 min presentation..."></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-colors">Schedule Viva</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Scheduled Vivas & Grades</h2>
            {vivas.map(viva => (
              <div key={viva._id} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{viva.student?.name}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{viva.student?.email}</p>
                  </div>
                  {viva.grade ? (
                    <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 rounded-full text-sm font-bold">Grade: {viva.grade}</span>
                  ) : (
                    <button onClick={() => handleGradeViva(viva._id)} className="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-500/20 transition-colors">
                      Assign Grade
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/50 p-5 rounded-xl transition-colors">
                  <div><strong className="text-zinc-700 dark:text-zinc-300">Date:</strong> {viva.date}</div>
                  <div><strong className="text-zinc-700 dark:text-zinc-300">Time:</strong> {viva.time}</div>
                  <div className="col-span-2"><strong className="text-zinc-700 dark:text-zinc-300">Instructions:</strong> {viva.instructions}</div>
                </div>
              </div>
            ))}
            {vivas.length === 0 && <p className="text-zinc-500">No vivas scheduled yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
