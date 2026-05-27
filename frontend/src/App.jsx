import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import WhatsAppButton from './components/WhatsAppButton';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Payments from './pages/student/Payments';
import Classes from './pages/student/Classes';
import Cabalgatas from './pages/student/Cabalgatas';

// Admin
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminStudentDetail from './pages/admin/StudentDetail';
import AdminPayments from './pages/admin/Payments';
import AdminSchedule from './pages/admin/Schedule';
import AdminCabalgatas from './pages/admin/Cabalgatas';

// Landing
import Landing from './pages/Landing';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  if (!adminOnly && user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  return children;
}

function Spinner() {
  return (
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route path="/dashboard" element={
          <ProtectedRoute><StudentLayout /></ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
          <Route path="classes" element={<Classes />} />
          <Route path="cabalgatas" element={<Cabalgatas />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/:id" element={<AdminStudentDetail />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="cabalgatas" element={<AdminCabalgatas />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
