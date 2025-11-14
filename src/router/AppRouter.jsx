import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardHomePage from '../pages/dashboard/DashboardHomePage';
import ProceduresPage from '../pages/dashboard/ProceduresPage';
import ReportsPage from '../pages/dashboard/ReportsPage';
import SimulatorPage from '../pages/dashboard/SimulatorPage';
import AssistantPage from '../pages/dashboard/AssistantPage';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Ruta raíz redirige a login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas del dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardHomePage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/procedures" 
        element={
          <PrivateRoute>
            <ProceduresPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/reports" 
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/simulator" 
        element={
          <PrivateRoute>
            <SimulatorPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/assistant" 
        element={
          <PrivateRoute>
            <AssistantPage />
          </PrivateRoute>
        } 
      />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
