import React from 'react';
import { useRouter } from 'next/navigation';
import { deleteEntry } from '@/utils/api';

interface DeleteEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onDelete: (id: string) => void; 
  currentEntryId: string; 
}

export default function DeleteEntryModal({
  isOpen,
  onClose,
  id,
  onDelete,
  currentEntryId,
}: DeleteEntryModalProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteEntry(id);
      onDelete(id);
      if (id === currentEntryId) {
        // Redirect if the deleted chat is the currently viewed chat
        router.push('/journal');
      } else {
        // Just close the modal if it's not the current chat
        onClose();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleClose = (event: { target: any; currentTarget: any; }) => {
    // Close the modal when the backdrop is clicked
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      className="modal modal-bottom sm:modal-middle"
      open={isOpen}
      onClick={handleClose}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg text-slate-600">
          Are you sure you want to delete this journal entry?
        </h3>
        <div className="modal-action">
          <button className="btn bg-red-400" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn bg-green-400" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
