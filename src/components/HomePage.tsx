import React from 'react';
import { User } from '../types/User';
import { LogOut, User as UserIcon, GraduationCap, Calendar, BookOpen, Zap, Camera, Users, ClipboardList, Edit3, Save, X } from 'lucide-react';

interface HomePageProps {
  user: User | null;
  onLogout: () => void;
}

interface AttendanceRecord {
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
}

interface StudentAttendanceRecord {
  studentName: string;
  rollNumber: string;
  subject: string;
  totalClasses: number;
  attendedClasses: number;
}

const HomePage: React.FC<HomePageProps> = ({ user, onLogout }) => {
  if (!user) return null;

  const [currentView, setCurrentView] = React.useState<'dashboard' | 'attendance'>('dashboard');
  const [editingRecord, setEditingRecord] = React.useState<number | null>(null);
  const [tempAttendance, setTempAttendance] = React.useState<{ total: number; attended: number }>({ total: 0, attended: 0 });

  const [profilePhoto, setProfilePhoto] = React.useState<string>(() => {
    // Load saved photo from localStorage or use default
    const savedPhoto = localStorage.getItem(`profile_photo_${user.username}`);
    return savedPhoto || user.photo;
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        event.target.value = ''; // Reset input
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        event.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result as string;
          setProfilePhoto(imageUrl);
          // Save to localStorage
          localStorage.setItem(`profile_photo_${user.username}`, imageUrl);
        }
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        event.target.value = ''; // Reset input
      };
      reader.readAsDataURL(file);
      
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  // Sample attendance data for students
  const studentAttendanceData: AttendanceRecord[] = [
    { subjectCode: 'PC-EE301', subjectName: 'ELECTRIC CIRCUIT THEORY', totalClasses: 45, attendedClasses: 38 },
    { subjectCode: 'PC-EE302', subjectName: 'ANALOG ELECTRONICS', totalClasses: 40, attendedClasses: 35 },
    { subjectCode: 'PC-EE303', subjectName: 'ELECTROMAGNETIC FIELD THEORY', totalClasses: 42, attendedClasses: 40 },
    { subjectCode: 'ES-ME301', subjectName: 'ENGINEERING MECHANICS', totalClasses: 38, attendedClasses: 32 },
    { subjectCode: 'BS-M301', subjectName: 'MATHEMATICS III', totalClasses: 20, attendedClasses: 18 },
    { subjectCode: 'BS-EE301', subjectName: 'BIOLOGY FOR ENGINEERS', totalClasses: 18, attendedClasses: 16 },
    { subjectCode: 'MC-EE301', subjectName: 'INDIAN CONSTITUTION', totalClasses: 16, attendedClasses: 15 },
    { subjectCode: 'PC-EE391', subjectName: 'ELECTRIC CIRCUIT THEORY LABORATORY', totalClasses: 16, attendedClasses: 15 },
    { subjectCode: 'PC-EE392', subjectName: 'ANALOG ELECTRONICS LABORATORY', totalClasses: 16, attendedClasses: 15 },
    { subjectCode: 'PC-CS391', subjectName: 'NUMERICAL METHODS LABORATORY', totalClasses: 16, attendedClasses: 15 },
  ];

  // Sample attendance data for teachers (managing students)
  const [teacherAttendanceData, setTeacherAttendanceData] = React.useState<StudentAttendanceRecord[]>([
    { studentName: 'SHAYAN KUMAR DAS', rollNumber: '11901624001', subject: 'ELECTRIC CIRCUIT THEOR', totalClasses: 45, attendedClasses: 38 },
    { studentName: 'DIVYANSH KUMAR', rollNumber: '11901624002', subject: 'ANALOG ELECTRONICS', totalClasses: 45, attendedClasses: 42 },
    { studentName: 'HIRANYA DAS', rollNumber: '11901624003', subject: 'ELECTROMAGNETIC FIELD THEORY', totalClasses: 45, attendedClasses: 35 },
    { studentName: 'NITIN ROY', rollNumber: '11901624004', subject: 'MATHEMATICS III', totalClasses: 45, attendedClasses: 40 },
  ]);

  const calculateAttendancePercentage = (attended: number, total: number): number => {
    return total > 0 ? Math.round((attended / total) * 100) : 0;
  };

  const getAttendanceColor = (percentage: number): string => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleEditAttendance = (index: number) => {
    setEditingRecord(index);
    setTempAttendance({
      total: teacherAttendanceData[index].totalClasses,
      attended: teacherAttendanceData[index].attendedClasses
    });
  };

  const handleSaveAttendance = (index: number) => {
    const updatedData = [...teacherAttendanceData];
    updatedData[index] = {
      ...updatedData[index],
      totalClasses: tempAttendance.total,
      attendedClasses: tempAttendance.attended
    };
    setTeacherAttendanceData(updatedData);
    setEditingRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setTempAttendance({ total: 0, attended: 0 });
  };

  const triggerFileInput = () => {
    document.getElementById('photo-upload')?.click();
  };
  const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (currentView === 'attendance') {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="bg-blue-600 p-2 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Attendance Records</h1>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {user.role === 'student' ? 'My Attendance' : 'Student Attendance Management'}
            </h2>
            <p className="text-gray-600">
              {user.role === 'student' 
                ? 'View your attendance records for all subjects' 
                : 'Manage and update student attendance records'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {user.role === 'student' ? (
                      <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject Code</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject Name</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total Classes</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Classes Attended</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Attendance %</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Roll Number</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total Classes</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Classes Attended</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Attendance %</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.role === 'student' ? (
                    studentAttendanceData.map((record, index) => {
                      const percentage = calculateAttendancePercentage(record.attendedClasses, record.totalClasses);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.subjectCode}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{record.subjectName}</td>
                          <td className="px-6 py-4 text-sm text-center text-gray-900">{record.totalClasses}</td>
                          <td className="px-6 py-4 text-sm text-center text-gray-900">{record.attendedClasses}</td>
                          <td className={`px-6 py-4 text-sm text-center font-semibold ${getAttendanceColor(percentage)}`}>
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    teacherAttendanceData.map((record, index) => {
                      const percentage = calculateAttendancePercentage(record.attendedClasses, record.totalClasses);
                      const isEditing = editingRecord === index;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.studentName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono">{record.rollNumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{record.subject}</td>
                          <td className="px-6 py-4 text-sm text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                value={tempAttendance.total}
                                onChange={(e) => setTempAttendance(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                              />
                            ) : (
                              <span className="text-gray-900">{record.totalClasses}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                value={tempAttendance.attended}
                                onChange={(e) => setTempAttendance(prev => ({ ...prev, attended: parseInt(e.target.value) || 0 }))}
                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                max={tempAttendance.total}
                              />
                            ) : (
                              <span className="text-gray-900">{record.attendedClasses}</span>
                            )}
                          </td>
                          <td className={`px-6 py-4 text-sm text-center font-semibold ${getAttendanceColor(percentage)}`}>
                            {isEditing ? `${calculateAttendancePercentage(tempAttendance.attended, tempAttendance.total)}%` : `${percentage}%`}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleSaveAttendance(index)}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Save changes"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Cancel editing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEditAttendance(index)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Edit attendance"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {user.role === 'student' && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Attendance Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Minimum 75% attendance required for semester examination</li>
                    <li>• Attendance below 60% may result in academic probation</li>
                    <li>• Contact your faculty advisor if attendance is below requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Electrical Department</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            {user.role === 'student' ? 'Student Portal' : 'Faculty Portal'}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0 relative group">
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <img
                src={profilePhoto}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer transition-all duration-200 hover:brightness-75"
                onClick={triggerFileInput}
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:brightness-75" onClick={triggerFileInput}>
                <UserIcon className="w-16 h-16 text-white" />
              </div>
              
              {/* Camera overlay */}
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center cursor-pointer" onClick={triggerFileInput}>
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Click to change photo
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h3>
              <p className="text-lg text-gray-600 mb-4 capitalize">{user.role}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Username</p>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                
                {user.rollNo !== '-' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Roll Number</p>
                    <p className="text-gray-900 font-mono">{user.rollNo}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Department</p>
                  <p className="text-gray-900">{user.department}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Info Cards */}
        {user.role === 'student' && user.sem !== '-' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfoCard
              icon={<BookOpen className="w-6 h-6 text-blue-600" />}
              label="Current Semester"
              value={user.sem}
            />
            <InfoCard
              icon={<Calendar className="w-6 h-6 text-teal-600" />}
              label="Academic Year"
              value={user.year}
            />
            <InfoCard
              icon={<GraduationCap className="w-6 h-6 text-purple-600" />}
              label="Program"
              value="B.Tech Electrical"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h4 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => setCurrentView('attendance')}
              className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <ClipboardList className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                <h5 className="font-semibold text-blue-900">Attendance Records</h5>
              </div>
              <p className="text-sm text-blue-700">
                {user.role === 'student' 
                  ? 'View your attendance for all subjects' 
                  : 'Manage student attendance records'}
              </p>
            </button>
            
            <button className="p-4 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200 group">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="w-6 h-6 text-teal-600 group-hover:text-teal-700" />
                <h5 className="font-semibold text-teal-900">
                  {user.role === 'student' ? 'Course Materials' : 'Manage Courses'}
                </h5>
              </div>
              <p className="text-sm text-teal-700">
                {user.role === 'student' 
                  ? 'Access lecture notes and resources' 
                  : 'Create and edit course content'}
              </p>
            </button>
            
            <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 group">
              <div className="flex items-center space-x-3 mb-2">
                {user.role === 'student' ? (
                  <GraduationCap className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
                ) : (
                  <Users className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
                )}
                <h5 className="font-semibold text-purple-900">
                  {user.role === 'student' ? 'Academic Progress' : 'Student Records'}
                </h5>
              </div>
              <p className="text-sm text-purple-700">
                {user.role === 'student' 
                  ? 'View grades and performance metrics' 
                  : 'View and manage student information'}
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
