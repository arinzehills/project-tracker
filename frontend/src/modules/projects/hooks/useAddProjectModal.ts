import { useState } from 'react';

/**
 * Custom hook to manage Add Project Modal state globally
 * Allows any component to open/close the modal without prop drilling
 */
export const useAddProjectModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
