// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';

const ManagerView = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-50">
      <Sidebar/>
      <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}!</h1>
      <button 
        onClick={logout} 
        className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default ManagerView;