import React from 'react';
import { useRouter } from 'next/navigation';
import { deleteChat } from '@/utils/api';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string; // or number, depending on your data
  onDelete: (chatId: string) => void; // or (chatId: number) => void
  currentChatId: string; // or number
}

export default function DeleteModal({
  isOpen,
  onClose,
  chatId,
  onDelete,
  currentChatId,
}: DeleteModalProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteChat(chatId);
      onDelete(chatId);
      if (chatId === currentChatId) {
        // Redirect if the deleted chat is the currently viewed chat
        router.push('/chat');
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
      className="modal modal-middle z-[10001]"
      open={isOpen}
      onClick={handleClose}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg text-slate-600">
          Are you sure you want to delete this chat?
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
