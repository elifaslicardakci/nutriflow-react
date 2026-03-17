import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import './styles/global.css';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Danisanlar from './pages/Danisanlar';
import Randevular from './pages/Randevular';
import { Programlar, Olcumler, Tarifler } from './pages/KlinikPages';
import { GelirGider, Raporlar, WebSitem, Ayarlar } from './pages/IsletmePages';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/"            element={<Landing />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/danisanlar"  element={<Danisanlar />} />
          <Route path="/randevular"  element={<Randevular />} />
          <Route path="/programlar"  element={<Programlar />} />
          <Route path="/olcumler"    element={<Olcumler />} />
          <Route path="/tarifler"    element={<Tarifler />} />
          <Route path="/gelir-gider" element={<GelirGider />} />
          <Route path="/raporlar"    element={<Raporlar />} />
          <Route path="/web-sitem"   element={<WebSitem />} />
          <Route path="/ayarlar"     element={<Ayarlar />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
