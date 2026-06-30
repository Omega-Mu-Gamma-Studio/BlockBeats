import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import UnitPage from './pages/UnitPage';
import LessonPage from './pages/LessonPage';
import Shop from './pages/Shop';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="unit/:unitId" element={<UnitPage />} />
          <Route path="lesson/:lessonId" element={<LessonPage />} />
          <Route path="shop" element={<Shop />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
