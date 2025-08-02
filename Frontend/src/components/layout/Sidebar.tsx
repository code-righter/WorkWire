import react from 'react';
import { useAuth } from '../../hooks/useAuth';

// A simple SVG icon component
const Icon = ({ path }: { path: string }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
  </svg>
);

export const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="text-2xl font-bold text-indigo-600 mb-10">MyT</div>
      <nav className="flex flex-col items-center space-y-6 flex-grow">
        <a href="#" className="p-2 rounded-lg bg-indigo-100 text-indigo-600"><Icon path="M4 6h16M4 12h16M4 18h16" /></a>
        <a href="#" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Icon path="M3 10h18M3 14h18M3 6h18" /></a>
        <a href="#" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></a>
        <a href="#" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></a>
      </nav>
      <div className="mt-auto">
        <button onClick={logout} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
          <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </button>
      </div>
    </div>
  );
};


// File: src/components/layout/Header.tsx
