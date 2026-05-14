import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { ToastProvider } from './lib/toast';
import Login from './pages/Login';
import Layout from './components/Layout';
import ServicesPage from './pages/Services';
import FAQPage from './pages/FAQ';
import PartnersPage from './pages/Partners';
import PlansPage from './pages/Plans';
import ReviewsPage from './pages/Reviews';
import CasesPage from './pages/Cases';
import CaseEdit from './pages/CaseEdit';
import WidgetPage from './pages/Widget';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAuth();
  if (!ready) return <div className="center-screen"><div className="spinner" /></div>;
  if (!user)  return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAuth();
  if (!ready) return <div className="center-screen"><div className="spinner" /></div>;
  if (user)   return <Navigate to="/services" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Navigate to="/services" replace />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/cases"    element={<CasesPage />} />
            <Route path="/cases/:slug" element={<CaseEdit />} />
            <Route path="/plans"    element={<PlansPage />} />
            <Route path="/reviews"  element={<ReviewsPage />} />
            <Route path="/faq"      element={<FAQPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/widget"   element={<WidgetPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/services" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
