export interface IUnsavedChangesModalContent {
  message?: string;
  dismissButtonLabel?: string;
  proceedLinkLabel?: string;
  proceedLinkHref?: string;
}

export interface IUnsavedChangesContext {
  modalContent: IUnsavedChangesModalContent | undefined;
  setModalContent: React.Dispatch<
    React.SetStateAction<IUnsavedChangesModalContent | undefined>
  >;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
