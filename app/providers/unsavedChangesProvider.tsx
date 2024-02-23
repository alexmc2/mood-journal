'use client';

import React, {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import {
  IUnsavedChangesContext,
  IUnsavedChangesModalContent,
} from '@/utils/unsavedChanges.types';
import config from 'next/config';
const UnsavedChangesContext = createContext<IUnsavedChangesContext | undefined>(
  undefined
);

const UnsavedChangesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [modalContent, setModalContent] = useState<
    IUnsavedChangesModalContent | undefined
  >(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);

  const context = useMemo(
    (): IUnsavedChangesContext => ({
      modalContent,
      setModalContent,
      showModal,
      setShowModal,
    }),
    [modalContent, setModalContent, showModal, setShowModal]
  );

  return (
    <UnsavedChangesContext.Provider value={context}>
      {children}
      <UnsavedChangesModal {...context} />
    </UnsavedChangesContext.Provider>
  );
};

export default UnsavedChangesProvider;

export function useSetUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);

  if (context === undefined) {
    throw new Error(
      'useSetUnsavedChanges must be called within <UnsavedChangesProvider />'
    );
  }

  const { setModalContent } = context;

  const setUnsavedChanges = useCallback(
    (modalContent: Omit<IUnsavedChangesModalContent, 'proceedLinkHref'>) => {
      setModalContent(modalContent); // Pass the correct argument
    },
    [setModalContent]
  );

  const clearUnsavedChanges = useCallback(() => {
    setModalContent(undefined);
  }, [setModalContent]);

  return useMemo(
    () => ({
      setUnsavedChanges,
      clearUnsavedChanges,
    }),
    [setUnsavedChanges, clearUnsavedChanges]
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);

  if (context === undefined) {
    throw new Error(
      'useUnsavedChanges must be called within <UnsavedChangesProvider />'
    );
  }

  const { modalContent, setModalContent, setShowModal } = context;

  const showUnsavedChangesModal = useCallback(
    (proceedLinkHref: string) => {
      setModalContent((currentContent) => ({
        ...currentContent,
        proceedLinkHref,
      }));
      setShowModal(true);
    },
    [setModalContent, setShowModal]
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (modalContent !== undefined) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [modalContent]);

  return useMemo(
    () => ({
      currentPageHasUnsavedChanges: modalContent !== undefined,
      showUnsavedChangesModal,
    }),
    [modalContent, showUnsavedChangesModal]
  );
}
