// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/psychologist/Home';
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/psychologist/home" />} />
      <Route path="/psychologist/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}