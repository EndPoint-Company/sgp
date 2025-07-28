import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./features/auth/hooks/useAuth";

// 1. Importe o seu provedor de contexto
import { UserDataProvider } from "./contexts/UserDataProvider";

// Importações das páginas e componentes
import PsychologistHomePage from "./pages/psychologist/PsychologistHome";
import Appointments from "./pages/psychologist/PsychologistAppointments";

import SchedulePsychologist from "./pages/psychologist/PsychologistSchedulePage";
import ScheduleStudent from "./pages/student/ScheduleStudent";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import StudentHomePage from "./pages/student/StudentHome";
import StudentAppointmentsPage from "./pages/student/StudentAppointments";
import LoadingScreen from "./components/LoadingScreen";
import Unauthorized from "./pages/Unauthorized";

// Rotas protegidas para usuários autenticados (qualquer tipo)
function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Rotas específicas para psicólogos
function PsychologistRoute() {
  const { user, role, isLoading } = useAuth();
  if (isLoading || role === undefined) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "psychologist") return <Unauthorized />;
  return <Outlet />;
}

// Rotas específicas para alunos
function StudentRoute() {
  const { user, role, isLoading } = useAuth();
  if (isLoading || role === undefined) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "student") return <Unauthorized />;
  return <Outlet />;
}

// Redireciona dinamicamente após o login com base no perfil
function RedirectAfterLogin() {
  const { user, role, isLoading } = useAuth();
  if (isLoading || role === undefined) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === "student") return <Navigate to="/student/home" replace />;
  if (role === "psychologist")
    return <Navigate to="/psychologist/home" replace />;
  return <Unauthorized />;
}

export default function App() {
  return (
    // 2. Envolva todo o seu sistema de rotas com o UserDataProvider
    <UserDataProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rota intermediária segura para redirecionamento pós-login */}
        <Route path="/after-login" element={<RedirectAfterLogin />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PsychologistRoute />}>
            <Route
              path="/psychologist/home"
              element={<PsychologistHomePage />}
            />
            <Route
              path="/psychologist/appointments"
              element={<Appointments />}
            />
            <Route
              path="/psychologist/schedule"
              element={<SchedulePsychologist />}
            />
          </Route>

          <Route element={<StudentRoute />}>
            <Route path="/student/home" element={<StudentHomePage />} />
            <Route
              path="/student/appointments"
              element={<StudentAppointmentsPage />}
            />
            <Route path="/student/schedule" element={<ScheduleStudent />} />
          </Route>
        </Route>

        {/* Rota fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </UserDataProvider>
  );
}
