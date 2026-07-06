import { Routes, Route, Navigate } from 'react-router-dom';
import LandingIndex from './pages/LandingIndex';
import LandingChat from './pages/LandingChat';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingIndex />} />
      <Route path="/fale-conosco/:id" element={<LandingChat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
