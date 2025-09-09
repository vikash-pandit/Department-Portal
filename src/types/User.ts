export interface User {
  username: string;
  role: 'student' | 'teacher';
  name: string;
  rollNo: string;
  department: string;
  sem: string;
  year: string;
  photo: string;
}