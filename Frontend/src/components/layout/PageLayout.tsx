import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CreateProjectModal } from '../features/project/CreateProjectModal';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header onNewProjectClick={() => setIsModalOpen(true)} />
        <div className="flex-1 overflow-y-auto p-6">
          {children} {/* The nested content (e.g., Outlet) is rendered here */}
        </div>
      </main>
      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
