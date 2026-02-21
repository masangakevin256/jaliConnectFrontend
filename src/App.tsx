import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/Auth/RequireAuth';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginUser';
import { RegisterUser } from './pages/RegisterUser';
import { RegisterCounselor } from './pages/RegisterCounselor';
import { RegisterAdmin } from './pages/RegisterAdmin';
import { UserDashboard } from './pages/UserDashboard';
import { CounselorDashboard } from './pages/CounselorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ROLE_LIST } from './types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route path="/login/user" element={<LoginPage role="user" />} />
          <Route path="/login/counselor" element={<LoginPage role="counselor" />} />
          <Route path="/login/admin" element={<LoginPage role="admin" />} />

          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/counselor" element={<RegisterCounselor />} />
          <Route path="/register/admin" element={<RegisterAdmin />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth allowedRoles={[ROLE_LIST.User]} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/:tab" element={<UserDashboard />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLE_LIST.Counselor]} />}>
            <Route path="/counselor" element={<CounselorDashboard />} />
            <Route path="/counselor/:tab" element={<CounselorDashboard />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLE_LIST.Admin]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/:tab" element={<AdminDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
