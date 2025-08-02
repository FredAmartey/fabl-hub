'use client'

import { useUpload } from '@/contexts/UploadContext'
import UploadWizard from './UploadWizard'

export function UploadWizardModal() {
  const { uploadState, closeUploadModal } = useUpload()

  if (!uploadState.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeUploadModal}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl overflow-hidden">
        <UploadWizard 
          onClose={closeUploadModal}
          onMultipleUploads={(files) => {
            console.log('Multiple uploads:', files)
            // Handle multiple uploads if needed
          }}
        />
      </div>
    </div>
  )
}