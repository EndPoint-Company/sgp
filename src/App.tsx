// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/psychologist/Home";
import Appointments from "./pages/psychologist/Appintments";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/psychologist/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/psychologist/appointments" element={<Appointments />} />
    </Routes>
  );
}
