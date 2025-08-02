import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PageLayout } from '../components/layout/PageLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { ProjectProvider } from '../contexts/ProjectContext';

// A layout for authenticated users, now including the project provider and page layout
const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <ProjectProvider>
      <PageLayout>
        <Outlet />
      </PageLayout>
    </ProjectProvider>
  );
};

// A layout for public pages (login, register)
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};


export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardPage />} />
        {/* Add other protected routes here, e.g., /project/:id */}
      </Route>
    </Routes>
  );
};
