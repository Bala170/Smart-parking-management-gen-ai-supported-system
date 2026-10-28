import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { UserLayout } from './components/layout/UserLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// User Portal Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { ActiveParking } from './pages/user/ActiveParking';
import { DigitalToken } from './pages/user/DigitalToken';
import { LostTokenRecovery } from './pages/user/LostTokenRecovery';
import { DelegatedRetrieval } from './pages/user/DelegatedRetrieval';
import { VehicleManagement } from './pages/user/VehicleManagement';
import { ParkingHistory } from './pages/user/ParkingHistory';
import { Payments } from './pages/user/Payments';
import { Notifications } from './pages/user/Notifications';
import { UserProfile } from './pages/user/UserProfile';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SlotManagement } from './pages/admin/SlotManagement';
import { ActiveSessions } from './pages/admin/ActiveSessions';
import { RetrievalManagement } from './pages/admin/RetrievalManagement';
import { DelegationManagement } from './pages/admin/DelegationManagement';
import { AdminVehicles } from './pages/admin/AdminVehicles';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AuditLogs } from './pages/admin/AuditLogs';
import { SecurityMonitoring } from './pages/admin/SecurityMonitoring';
import { LiveMonitoring } from './pages/admin/LiveMonitoring';

// Fallback Pages
import { NotFound } from './pages/NotFound';
import { Unauthorized } from './pages/Unauthorized';

// Protected Admin Guard
const AdminRoute = ({ children }) => {
  const { role } = useAuth();
  if (role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Entry */}
            <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User / Vehicle Owner Experience */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="parking" element={<ActiveParking />} />
              <Route path="token" element={<DigitalToken />} />
              <Route path="recovery" element={<LostTokenRecovery />} />
              <Route path="delegation" element={<DelegatedRetrieval />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="payments" element={<Payments />} />
              <Route path="history" element={<ParkingHistory />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Admin / Parking Operator Dashboard */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="parking-slots" element={<SlotManagement />} />
              <Route path="sessions" element={<ActiveSessions />} />
              <Route path="retrievals" element={<RetrievalManagement />} />
              <Route path="delegations" element={<DelegationManagement />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="security" element={<SecurityMonitoring />} />
              <Route path="live-monitoring" element={<LiveMonitoring />} />
            </Route>

            {/* Special routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
