'use client';

import { createContext, useContext, ReactNode } from 'react';

interface UploadContextType {
  openUploadModal: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}

interface UploadProviderProps {
  children: ReactNode;
  openUploadModal: () => void;
}

export function UploadProvider({ children, openUploadModal }: UploadProviderProps) {
  return (
    <UploadContext.Provider value={{ openUploadModal }}>
      {children}
    </UploadContext.Provider>
  );
}