import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/psychologist/Home";
import Appointments from "./pages/psychologist/Appintments";
import Schedule from "./pages/psychologist/Schedule"; 
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import StudentHomePage from './pages/student/Home';
import StudentAppointments from './pages/student/Appointments';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/psychologist/home" element={<Home />} />
      <Route path="/psychologist/appointments" element={<Appointments />} />
      <Route path="/psychologist/schedule" element={<Schedule />} />

      <Route path="/student/home" element={<StudentHomePage />} />
      <Route path="/student/appointments" element={<StudentAppointments />} />
    </Routes>
  );
}