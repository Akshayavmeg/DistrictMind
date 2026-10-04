import { Route, Routes } from 'react-router';

import { AppLayout } from './layouts/AppLayout';
import { RequireDevSession } from './routes/RequireDevSession';
import { DistrictDetailPage } from './pages/DistrictDetailPage';
import { DistrictsPage } from './pages/DistrictsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Route table. Routes are declared here so tests can render them without a browser router. */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<RequireDevSession />}>
          <Route path="districts" element={<DistrictsPage />} />
          <Route path="districts/:id" element={<DistrictDetailPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
