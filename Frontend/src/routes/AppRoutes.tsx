
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { RegisterPage } from '../pages/RegisterPage';

// This is a placeholder for your main dashboard page after login
const DashboardPage = () => {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
                    <button 
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
                <p className="mt-4">This is your protected dashboard. Your projects and Gantt chart will go here.</p>
            </div>
        </div>
    );
};


// A layout for authenticated users
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// A layout for public pages (login, register)
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
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
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        {/* Add other protected routes here, e.g., /project/:id */}
      </Route>
    </Routes>
  );
};
