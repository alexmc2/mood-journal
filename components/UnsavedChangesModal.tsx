/* UnsavedChangesModal.tsx */

import React from 'react';
import Link from '@/components/link/Link';
import { Modal } from '@nextui-org/react';



import { IUnsavedChangesContext } from '@/utils/unsavedChanges.types';

const UnsavedChangesModal: React.FC<IUnsavedChangesContext> = ({
  modalContent,
  setModalContent,
  showModal,
  setShowModal,
}) => (


<Modal
    isOpen={showModal}
    onClose={() => {
      setShowModal(false);
    }}
  >
    <div className="modal-content">
    <p>{modalContent?.message || 'You have unsaved changes.'}</p>

      <button
        onClick={() => {
          setShowModal(false);
        }}
      >
        {modalContent?.dismissButtonLabel ?? 'Back to page'}
      </button>

      <Link
        href={modalContent?.proceedLinkHref || '/'}
        onClick={() => {
          setShowModal(false);
          setModalContent(undefined);
        }}
      >
        {modalContent?.proceedLinkLabel ?? "I don't want to save changes"}
      </Link>
    </div>
  </Modal>
);

export default UnsavedChangesModal;
