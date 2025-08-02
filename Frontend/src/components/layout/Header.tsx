import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onNewProjectClick: () => void;
}

export const Header = ({ onNewProjectClick }: HeaderProps) => {
  const { user } = useAuth();
  return (
    <header className="bg-gray-50 p-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Good Morning, {user?.name}!</h1>
        <p className="text-gray-500">You've got some tasks to do.</p>
      </div>
      <button
        onClick={onNewProjectClick}
        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        + New Project
      </button>
    </header>
  );
};
