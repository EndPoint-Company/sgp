// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/psychologist/Home';
import Appointments from './pages/psychologist/Appintments'; // 1. Import the new component
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/psychologist/home" />} />
      <Route path="/psychologist/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/psychologist/appointments" element={<Appointments />} />
    </Routes>
  );
}
