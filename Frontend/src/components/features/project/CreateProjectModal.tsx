import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { useProjects } from '../../../hooks/useProjects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { addProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    try {
      await addProject({ name, description });
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError('Failed to create project. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            id="projectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Create</button>
        </div>
      </form>
    </Modal>
  );
};
