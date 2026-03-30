import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function LecturerDashboard() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [vivas, setVivas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('students');

  // Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [duration, setDuration] = useState('');
  const [topics, setTopics] = useState('');

  // Viva Validation Errors
  const [durationError, setDurationError] = useState('');
  const [instructionsError, setInstructionsError] = useState('');
  const [topicsError, setTopicsError] = useState('');

  // Grading State
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState('');
  const [attendance, setAttendance] = useState('');
  const [vivaMarks, setVivaMarks] = useState('');
  const [reportMarks, setReportMarks] = useState('');
  const [companyReview, setCompanyReview] = useState('');
  const [finalGrade, setFinalGrade] = useState('');
  const [sortByStatus, setSortByStatus] = useState('all');
  const [gradedStudents, setGradedStudents] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState('');

  // Validation Errors
  const [attendanceError, setAttendanceError] = useState('');
  const [vivaMarksError, setVivaMarksError] = useState('');
  const [reportMarksError, setReportMarksError] = useState('');
  const [companyReviewError, setCompanyReviewError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [stuRes, repRes, vivaRes, gradeRes] = await Promise.all([
        fetch('/api/lecturers/students', { headers }),
        fetch('/api/lecturers/reports', { headers }),
        fetch('/api/lecturers/viva', { headers }),
        fetch('/api/lecturers/final-grades', { headers })
      ]);
      
      const [stuData, repData, vivaData, gradeData] = await Promise.all([
        stuRes.json(),
        repRes.json(),
        vivaRes.json(),
        gradeRes.json()
      ]);
      
      setStudents(stuData.students || []);
      setReports(repData.reports || []);
      setVivas(vivaData.vivas || []);
      
      // Set graded students
      const gradedIds = new Set<string>((gradeData.finalGrades || []).map((grade: any) => grade.student._id.toString()));
      setGradedStudents(gradedIds);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleFinalGrading = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleFinalGrading called');
    console.log('selectedStudentForGrading:', selectedStudentForGrading);
    console.log('attendance:', attendance);
    console.log('vivaMarks:', vivaMarks);
    console.log('reportMarks:', reportMarks);
    console.log('companyReview:', companyReview);
    console.log('token:', token ? 'exists' : 'missing');
    
    if (!selectedStudentForGrading || !attendance || !vivaMarks || !reportMarks || !companyReview) {
      alert('Please fill all required fields');
      return;
    }
    
    // Calculate final grade automatically
    const attendanceWeight = 0.3;
    const vivaWeight = 0.4;
    const reportWeight = 0.3;
    
    const attendanceScore = parseFloat(attendance) * attendanceWeight;
    const vivaScore = parseFloat(vivaMarks) * vivaWeight;
    const reportScore = parseFloat(reportMarks) * reportWeight;
    
    const finalScore = attendanceScore + vivaScore + reportScore;
    
    let calculatedGrade = '';
    if (finalScore >= 85) calculatedGrade = 'A+';
    else if (finalScore >= 80) calculatedGrade = 'A';
    else if (finalScore >= 75) calculatedGrade = 'A-';
    else if (finalScore >= 70) calculatedGrade = 'B+';
    else if (finalScore >= 65) calculatedGrade = 'B';
    else if (finalScore >= 60) calculatedGrade = 'B-';
    else if (finalScore >= 55) calculatedGrade = 'C+';
    else if (finalScore >= 50) calculatedGrade = 'C';
    else calculatedGrade = 'F';
    
    setFinalGrade(calculatedGrade);
    
    try {
      console.log('Sending grade to:', `/api/lecturers/final-grade/${selectedStudentForGrading}`);
      const res = await fetch(`/api/lecturers/final-grade/${selectedStudentForGrading}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          attendance, 
          vivaMarks, 
          reportMarks, 
          companyReview, 
          finalScore: finalScore.toFixed(2), 
          finalGrade: calculatedGrade 
        })
      });
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (res.ok) {
        // Add student to graded list
        setGradedStudents(prev => new Set(prev).add(selectedStudentForGrading));
        
        // Get student name for success message
        const studentName = students.find(s => s._id === selectedStudentForGrading)?.user?.name;
        
        // Show success message
        setSuccessMessage(`Final grade submitted successfully for ${studentName}! Final Score: ${finalScore.toFixed(2)}%, Grade: ${calculatedGrade}`);
        
        // Clear form and return to student list
        setSelectedStudentForGrading(''); 
        setAttendance(''); 
        setVivaMarks(''); 
        setReportMarks(''); 
        setCompanyReview(''); 
        setFinalGrade('');
        
        // Refresh data
        fetchData();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        const errorData = await res.json();
        console.error('Server error:', errorData);
        const errorMessage = errorData.details || errorData.error || 'Unknown error';
        alert(`Error submitting grade: ${errorMessage}`);
        if (errorData.stack && process.env.NODE_ENV === 'development') {
          console.error('Stack trace:', errorData.stack);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please check your connection and try again.');
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
              <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'students' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Student Progress</button>
              <button onClick={() => setActiveTab('reports')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'reports' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Reports</button>
              <button onClick={() => setActiveTab('viva')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'viva' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Viva Scheduling</button>
              <button onClick={() => setActiveTab('grading')} className={`whitespace-nowrap py-4 px-1 border-b-[3px] font-semibold text-sm transition-colors ${activeTab === 'grading' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}>Final Grading</button>
            </nav>
          </div>

          {activeTab === 'students' && (
            <div className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/30 dark:border-zinc-700/30 overflow-hidden transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                  <thead className="bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Student</th>
                      <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">GPA / Year</th>
                      <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Internship Status</th>
                      <th className="px-8 py-5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Company</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {students.map(student => (
                      <tr key={student._id} className="hover:bg-white/10 dark:hover:bg-zinc-800/10 backdrop-blur-sm transition-colors">
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm border border-white/30 dark:border-zinc-700/50 rounded-2xl flex items-center justify-center transition-colors">
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
                            <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Placed
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-amber-50/50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
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
                <div key={report._id} className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/30 dark:border-zinc-700/30 transition-colors duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center transition-colors border border-white/30 dark:border-zinc-700/50">
                        <FileText className="text-zinc-900 dark:text-white w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{report.type === 'weekly' ? `Weekly Report (Week ${report.weekNumber})` : 'Final Report'}</h3>
                    </div>
                    <span className={`px-3 py-1 ml-2 text-xs font-bold rounded-full border backdrop-blur-sm ${report.type === 'final' ? 'bg-purple-50/50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20' : 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20'}`}>
                      {report.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6 space-y-2">
                    <p><strong className="text-zinc-900 dark:text-zinc-200">Student:</strong> {report.student?.name}</p>
                    {report.company && <p><strong className="text-zinc-900 dark:text-zinc-200">Company:</strong> {report.company?.name}</p>}
                    <p><strong className="text-zinc-900 dark:text-zinc-200">Submitted:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm p-5 rounded-2xl text-sm text-zinc-700 dark:text-zinc-300 mb-6 border border-white/20 dark:border-zinc-700/50 transition-colors leading-relaxed">
                    {report.content}
                  </div>
                  {report.fileUrl && (
                    <a href={report.fileUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 bg-white/30 dark:bg-zinc-800/30 backdrop-blur-sm text-zinc-900 dark:text-zinc-50 py-3.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md border border-white/40 dark:border-zinc-600/40">
                      <FileText className="w-4 h-4" /> View Attached File
                    </a>
                  )}
                </div>
              ))}
              {reports.length === 0 && <p className="text-zinc-500 font-medium col-span-2">No reports submitted yet.</p>}
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/30 dark:border-zinc-700/30 transition-colors duration-300 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-50 tracking-tight">
                <Calendar className="text-zinc-900 dark:text-white h-6 w-6" /> 
                Schedule Viva Examination
              </h2>
              <form onSubmit={handleScheduleViva} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Select Student</label>
                    <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow appearance-none cursor-pointer">
                      <option value="">-- Select Student --</option>
                      {students.map(s => (
                        <option key={s.user._id} value={s.user._id}>{s.user.name} ({s.user.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Viva Type</label>
                    <select required className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow appearance-none cursor-pointer">
                      <option value="">-- Select Viva Type --</option>
                      <option value="midterm">Midterm Viva</option>
                      <option value="final">Final Viva</option>
                      <option value="review">Progress Review</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Date</label>
                    <input type="date" required value={date} onChange={e => {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Set to start of day for comparison
                      
                      if (selectedDate < today) {
                        setDate('');
                        alert('Please select a date that is today or in the future');
                      } else {
                        setDate(e.target.value);
                      }
                    }} min={new Date().toISOString().split('T')[0]} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow dark:[color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Time</label>
                    <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow dark:[color-scheme:dark]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Duration (minutes)</label>
                  <input type="number" required min="15" max="120" step="1" placeholder="30" 
                    onChange={e => {
                      const value = e.target.value;
                      if (value === '' || (parseInt(value) >= 15 && parseInt(value) <= 120)) {
                        setDuration(value);
                        setDurationError('');
                      } else {
                        setDurationError('Duration must be between 15 and 120 minutes');
                      }
                    }}
                    onKeyPress={e => {
                      if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow" />
                </div>
                {durationError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{durationError}</p>}

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Viva Instructions</label>
                  <textarea required value={instructions} onChange={e => {
                      const value = e.target.value;
                      if (value.length <= 1000) {
                        setInstructions(value);
                        setInstructionsError('');
                      } else {
                        setInstructionsError('Instructions must be 1000 characters or less');
                      }
                    }} rows={4} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow" placeholder="Provide detailed instructions for the viva examination (max 1000 characters)"></textarea>
                  {instructionsError && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{instructionsError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Examination Topics *</label>
                  <textarea onChange={e => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        setTopics(value);
                        setTopicsError('');
                      } else {
                        setTopicsError('Topics must be 500 characters or less');
                      }
                    }} rows={3} className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 sm:text-sm sm:leading-6 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow" placeholder="List the topics to be covered during the viva (max 500 characters)"></textarea>
                  {topicsError && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{topicsError}</p>}
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-white/30 dark:bg-zinc-800/30 backdrop-blur-sm text-zinc-900 dark:text-zinc-50 px-6 py-3 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-md border border-white/40 dark:border-zinc-600/40 transition-all focus:outline-none">
                    Schedule Viva
                  </button>
                  <button type="button" onClick={() => {setSelectedStudent(''); setDate(''); setTime(''); setInstructions('');}} className="px-6 py-3 rounded-full text-sm font-semibold bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 transition-colors border border-zinc-300/50 dark:border-zinc-600/50">
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'grading' && (
            <div className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/30 dark:border-zinc-700/30 transition-colors duration-300 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-zinc-900 dark:text-zinc-50 tracking-tight">
                <FileText className="text-zinc-900 dark:text-white h-6 w-6" /> 
                Final Internship Grading
              </h2>
              
              <div className="mb-8">
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                          {successMessage}
                        </p>
                      </div>
                      <button
                        onClick={() => setSuccessMessage('')}
                        className="flex-shrink-0 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Students with Internship Status</h3>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Filter by Status:</label>
                    <select 
                      value={sortByStatus} 
                      onChange={e => setSortByStatus(e.target.value)}
                      className="block rounded-lg border-0 py-2 px-3 text-sm text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow appearance-none cursor-pointer"
                    >
                      <option value="all">All Students</option>
                      <option value="completed">Completed Internship</option>
                      <option value="ongoing">Ongoing Internship</option>
                      <option value="seeking">Seeking Internship</option>
                    </select>
                  </div>
                </div>
                
                {!selectedStudentForGrading ? (
                  <div className="space-y-4 mb-8">
                    {students
                      .filter(student => {
                        if (sortByStatus === 'all') return true;
                        if (sortByStatus === 'completed' && student.internship) return true;
                        if (sortByStatus === 'ongoing' && student.internship) return true;
                        if (sortByStatus === 'seeking' && !student.internship) return true;
                        return false;
                      })
                      .map(student => (
                      <div key={student._id} className="bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-zinc-700/50 transition-colors hover:shadow-md hover:-translate-y-1 cursor-pointer">
                        <div 
                          onClick={() => student.internship && !gradedStudents.has(student.user._id.toString()) && setSelectedStudentForGrading(student._id)}
                          className="flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{student.user?.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                  student.internship 
                                    ? 'bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20' 
                                    : 'bg-amber-50/50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'
                                }`}>
                                  {student.internship ? 'Completed' : 'Seeking'}
                                </span>
                                {gradedStudents.has(student._id) && (
                                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20">
                                    Graded ✓
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">{student.user?.email}</p>
                            {student.internship && (
                              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                <p><strong className="text-zinc-700 dark:text-zinc-300">Company:</strong> {student.internship.company?.name}</p>
                                <p><strong className="text-zinc-700 dark:text-zinc-300">Position:</strong> {student.internship.title}</p>
                              </div>
                            )}
                          </div>
                          {student.internship && !gradedStudents.has(student.user._id.toString()) && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentForGrading(student._id);
                              }}
                              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                                'bg-white/30 dark:bg-zinc-800/30 text-zinc-900 dark:text-zinc-50 hover:bg-white/40 dark:hover:bg-zinc-700/40 border border-white/40 dark:border-zinc-600/40'
                              }`}
                            >
                              Grade Now →
                            </button>
                          )}
                          {gradedStudents.has(student.user._id.toString()) && (
                            <div className="px-6 py-3 rounded-full text-sm font-semibold bg-blue-500/20 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20">
                              Graded ✓
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {students.filter(student => {
                      if (sortByStatus === 'all') return false;
                      if (sortByStatus === 'completed' && student.internship) return false;
                      if (sortByStatus === 'ongoing' && student.internship) return false;
                      if (sortByStatus === 'seeking' && !student.internship) return false;
                      return true;
                    }).length === 0 && (
                      <p className="text-zinc-500 font-medium text-center py-8">
                        {sortByStatus === 'completed' && 'No students have completed their internship yet.'}
                        {sortByStatus === 'ongoing' && 'No students with ongoing internships.'}
                        {sortByStatus === 'seeking' && 'No students seeking internships.'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <button 
                      onClick={() => setSelectedStudentForGrading('')}
                      className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 mb-4 flex items-center gap-2"
                    >
                      ← Back to Student List
                    </button>
                  </div>
                )}
              </div>

              {selectedStudentForGrading && students.find(s => s._id === selectedStudentForGrading)?.internship && (
                <form onSubmit={handleFinalGrading} className="space-y-6">
                  <div className="bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-zinc-700/50">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                      Grading for: {students.find(s => s._id === selectedStudentForGrading)?.user?.name}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Company: {students.find(s => s._id === selectedStudentForGrading)?.internship?.company?.name} | 
                      Position: {students.find(s => s._id === selectedStudentForGrading)?.internship?.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Attendance Score (0-100)</label>
                      <input 
                        type="number" 
                        required 
                        min="0" 
                        max="100" 
                        step="0.01"
                        value={attendance}
                        onChange={e => {
                          const value = e.target.value;
                          if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                            setAttendance(value);
                            setAttendanceError('');
                          } else {
                            setAttendanceError('Please enter a value between 0 and 100');
                          }
                        }}
                        onKeyPress={e => {
                          if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        placeholder="85" 
                        className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 text-sm bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow" 
                      />
                      {attendanceError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{attendanceError}</p>}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Weight: 30%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Final Viva Marks (0-100)</label>
                      <input 
                        type="number" 
                        required 
                        min="0" 
                        max="100" 
                        step="0.01"
                        value={vivaMarks}
                        onChange={e => {
                          const value = e.target.value;
                          if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                            setVivaMarks(value);
                            setVivaMarksError('');
                          } else {
                            setVivaMarksError('Please enter a value between 0 and 100');
                          }
                        }}
                        onKeyPress={e => {
                          if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        placeholder="78" 
                        className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 text-sm bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow" 
                      />
                      {vivaMarksError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{vivaMarksError}</p>}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Weight: 40%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Final Report Marks (0-100)</label>
                      <input 
                        type="number" 
                        required 
                        min="0" 
                        max="100" 
                        step="0.01"
                        value={reportMarks}
                        onChange={e => {
                          const value = e.target.value;
                          if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                            setReportMarks(value);
                            setReportMarksError('');
                          } else {
                            setReportMarksError('Please enter a value between 0 and 100');
                          }
                        }}
                        onKeyPress={e => {
                          if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        placeholder="92" 
                        className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 text-sm bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow" 
                      />
                      {reportMarksError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{reportMarksError}</p>}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Weight: 30%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Company Review Score (0-100) *</label>
                      <input 
                        type="number" 
                        required 
                        min="0" 
                        max="100" 
                        step="0.01"
                        value={companyReview}
                        onChange={e => {
                          const value = e.target.value;
                          if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                            setCompanyReview(value);
                            setCompanyReviewError('');
                          } else {
                            setCompanyReviewError('Please enter a value between 0 and 100');
                          }
                        }}
                        onKeyPress={e => {
                          if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        placeholder="88" 
                        className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 dark:text-zinc-50 shadow-sm ring-1 ring-inset ring-white/30 dark:ring-zinc-700/50 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-white/50 dark:focus:ring-zinc-600/50 text-sm bg-white/10 dark:bg-zinc-800/10 backdrop-blur-sm transition-shadow" 
                      />
                      {companyReviewError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{companyReviewError}</p>}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Additional consideration</p>
                    </div>
                  </div>

                  {/* Auto-calculated final grade display */}
                  {attendance && vivaMarks && reportMarks && (
                    <div className="bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm p-6 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-4">Calculated Final Grade</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-emerald-700 dark:text-emerald-300">
                          <span className="font-medium">Attendance (30%):</span> {(parseFloat(attendance) * 0.3).toFixed(2)}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-300">
                          <span className="font-medium">Viva (40%):</span> {(parseFloat(vivaMarks) * 0.4).toFixed(2)}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-300">
                          <span className="font-medium">Report (30%):</span> {(parseFloat(reportMarks) * 0.3).toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-emerald-700/50">
                        <div className="text-lg font-bold text-emerald-800 dark:text-emerald-100">
                          Final Score: {((parseFloat(attendance) * 0.3) + (parseFloat(vivaMarks) * 0.4) + (parseFloat(reportMarks) * 0.3)).toFixed(2)}%
                        </div>
                        <div className="text-lg font-bold text-emerald-800 dark:text-emerald-100">
                          Grade: {(() => {
                            const finalScore = (parseFloat(attendance) * 0.3) + (parseFloat(vivaMarks) * 0.4) + (parseFloat(reportMarks) * 0.3);
                            if (finalScore >= 85) return 'A+';
                            else if (finalScore >= 80) return 'A';
                            else if (finalScore >= 75) return 'A-';
                            else if (finalScore >= 70) return 'B+';
                            else if (finalScore >= 65) return 'B';
                            else if (finalScore >= 60) return 'B-';
                            else if (finalScore >= 55) return 'C+';
                            else if (finalScore >= 50) return 'C';
                            else return 'F';
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-emerald-500/80 hover:bg-emerald-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] shadow-md transition-all focus:outline-none">
                      Submit Final Grade
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setSelectedStudentForGrading(''); 
                        setAttendance(''); 
                        setVivaMarks(''); 
                        setReportMarks(''); 
                        setCompanyReview(''); 
                        setFinalGrade('');
                      }} 
                      className="px-6 py-3 rounded-full text-sm font-semibold bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 transition-colors border border-zinc-300/50 dark:border-zinc-600/50"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
