import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MissionsProvider } from './context/MissionsContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Transparency } from './pages/Transparency';
import { Missions } from './pages/Missions';
import { Gallery } from './pages/Gallery';
import { Studies } from './pages/Studies';
import { StudyDetail } from './pages/StudyDetail';
import { Donate } from './pages/Donate';
import { MissionDetail } from './pages/MissionDetail';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <CurrencyProvider>
      <MissionsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="sobre" element={<About />} />
              <Route path="transparencia" element={<Transparency />} />
              <Route path="missoes" element={<Missions />} />
              <Route path="missao/:id" element={<MissionDetail />} />
              <Route path="galeria" element={<Gallery />} />
              <Route path="estudos" element={<Studies />} />
              <Route path="estudo/:id" element={<StudyDetail />} />
              <Route path="doar" element={<Donate />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MissionsProvider>
    </CurrencyProvider>
  );
}
