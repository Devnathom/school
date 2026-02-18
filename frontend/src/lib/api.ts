const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'เกิดข้อผิดพลาด' }));
    throw new Error(error.message);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => fetchAPI('/auth/me'),

  // Dashboard
  getDashboardStats: () => fetchAPI('/dashboard/stats'),
  getActivities: () => fetchAPI('/dashboard/activities'),
  getAttendanceChart: () => fetchAPI('/dashboard/attendance-chart'),
  getGradeDistribution: () => fetchAPI('/dashboard/grade-distribution'),
  getEvents: () => fetchAPI('/dashboard/events'),
  getAnnouncements: () => fetchAPI('/dashboard/announcements'),

  // Students
  getStudents: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/students${query}`);
  },
  getStudent: (id: number) => fetchAPI(`/students/${id}`),
  createStudent: (data: any) => fetchAPI('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id: number, data: any) => fetchAPI(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id: number) => fetchAPI(`/students/${id}`, { method: 'DELETE' }),

  // Teachers
  getTeachers: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/teachers${query}`);
  },
  getTeacher: (id: number) => fetchAPI(`/teachers/${id}`),
  createTeacher: (data: any) => fetchAPI('/teachers', { method: 'POST', body: JSON.stringify(data) }),
  updateTeacher: (id: number, data: any) => fetchAPI(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeacher: (id: number) => fetchAPI(`/teachers/${id}`, { method: 'DELETE' }),

  // Classes
  getClasses: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/classes${query}`);
  },
  getClass: (id: number) => fetchAPI(`/classes/${id}`),
  createClass: (data: any) => fetchAPI('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id: number, data: any) => fetchAPI(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id: number) => fetchAPI(`/classes/${id}`, { method: 'DELETE' }),

  // Subjects
  getSubjects: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/subjects${query}`);
  },
  getSubject: (id: number) => fetchAPI(`/subjects/${id}`),
  createSubject: (data: any) => fetchAPI('/subjects', { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id: number, data: any) => fetchAPI(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubject: (id: number) => fetchAPI(`/subjects/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/attendance${query}`);
  },
  getAttendanceSummary: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/attendance/summary${query}`);
  },
  saveAttendance: (data: any) => fetchAPI('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  saveBulkAttendance: (records: any[]) => fetchAPI('/attendance/bulk', { method: 'POST', body: JSON.stringify({ records }) }),

  // Grades
  getGrades: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/grades${query}`);
  },
  getGradeStatistics: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchAPI(`/grades/statistics${query}`);
  },
  createGrade: (data: any) => fetchAPI('/grades', { method: 'POST', body: JSON.stringify(data) }),
  updateGrade: (id: number, data: any) => fetchAPI(`/grades/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGrade: (id: number) => fetchAPI(`/grades/${id}`, { method: 'DELETE' }),
};
