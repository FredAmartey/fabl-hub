'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useRequestUploadUrl, useCompleteUpload } from '@/hooks/use-upload'

interface UploadState {
  isOpen: boolean
  uploadId: string | null
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error'
  progress: number
  error: string | null
}

interface UploadContextType {
  uploadState: UploadState
  openUploadModal: () => void
  closeUploadModal: () => void
  startUpload: (file: File, metadata?: {
    title: string
    description?: string
    visibility: string
  }) => Promise<void>
  completeUpload: (metadata: {
    title: string
    description?: string
    visibility: string
  }) => Promise<void>
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isOpen: false,
    uploadId: null,
    status: 'idle',
    progress: 0,
    error: null,
  })


  const requestUploadUrl = useRequestUploadUrl()
  const completeUpload = useCompleteUpload()

  const openUploadModal = () => {
    setUploadState(prev => ({ ...prev, isOpen: true, status: 'idle', error: null }))
  }

  const closeUploadModal = () => {
    setUploadState(prev => ({ 
      ...prev, 
      isOpen: false, 
      status: 'idle', 
      uploadId: null, 
      progress: 0, 
      error: null 
    }))
  }

  const startUpload = async (file: File, metadata?: {
    title: string
    description?: string
    visibility: string
  }) => {
    try {
      setUploadState(prev => ({ ...prev, status: 'uploading', progress: 0, error: null }))

      console.log('🚀 Starting upload for file:', file.name, file.size, file.type)

      // Request upload URL
      const response = await requestUploadUrl.mutateAsync({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      })

      console.log('✅ Upload URL response:', response)

      setUploadState(prev => ({ ...prev, uploadId: response.uploadId }))

      console.log('📤 Uploading file to Mux URL:', response.uploadUrl)
      console.log('📄 File details:', { name: file.name, size: file.size, type: file.type })

      // Check if this is a mock upload (fake URL)
      const isMockUpload = response.uploadUrl.includes('example.com/mock-upload')
      
      if (isMockUpload) {
        console.log('🎭 Mock upload detected - skipping actual file upload')
        // For mock uploads, just simulate the upload without actually uploading
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload delay
      } else {
        // Real Mux upload
        const uploadResponse = await fetch(response.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })

        console.log('📥 Mux upload response:', uploadResponse.status, uploadResponse.statusText)

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`)
        }
      }

      setUploadState(prev => ({ ...prev, status: 'processing', progress: 100 }))

      // For mock uploads with metadata, automatically complete the upload
      if (isMockUpload && metadata) {
        console.log('🎯 Auto-completing mock upload with metadata...')
        
        try {
          await completeUpload.mutateAsync({
            uploadId: response.uploadId,
            ...metadata,
          })
          
          setUploadState(prev => ({ ...prev, status: 'complete' }))
          console.log('✅ Mock upload completed successfully!')
        } catch (completeError) {
          console.error('❌ Failed to complete mock upload:', completeError)
          throw completeError
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }))
    }
  }

  const completeUploadFn = async (metadata: {
    title: string
    description?: string
    visibility: string
  }) => {
    if (!uploadState.uploadId) {
      throw new Error('No upload in progress')
    }

    try {
      await completeUpload.mutateAsync({
        uploadId: uploadState.uploadId,
        ...metadata,
      })

      setUploadState(prev => ({ ...prev, status: 'complete' }))
    } catch (error) {
      console.error('Complete upload failed:', error)
      setUploadState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Failed to complete upload' 
      }))
    }
  }

  return (
    <UploadContext.Provider
      value={{
        uploadState,
        openUploadModal,
        closeUploadModal,
        startUpload,
        completeUpload: completeUploadFn,
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload() {
  const context = useContext(UploadContext)
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider')
  }
  return context
}