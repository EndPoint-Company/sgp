// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/psychologist/Home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/psychologist/home" />} />
      <Route path="/psychologist/home" element={<Home />} />
    </Routes>
  );
}