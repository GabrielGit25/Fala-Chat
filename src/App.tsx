import { Routes, Route, Navigate } from 'react-router-dom';
import LandingIndex from './pages/LandingIndex';
import LandingChat from './pages/LandingChat';
import DashboardLogin from './pages/DashboardLogin';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingIndex />} />
      <Route path="/fale-conosco/:id" element={<LandingChat />} />
      <Route path="/dashboard/login" element={<DashboardLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
