'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useUpload } from '@/contexts/UploadContext'

export function UploadModal() {
  const { uploadState, closeUploadModal, startUpload, completeUpload } = useUpload()
  const [mounted, setMounted] = useState(false)
  
  // Ensure component only renders on client to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('private')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        setSelectedFile(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('video/')) {
        setSelectedFile(file)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return

    try {
      await startUpload(selectedFile, {
        title: title.trim(),
        description: description.trim() || undefined,
        visibility,
      })
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleComplete = async () => {
    if (!title.trim()) return

    try {
      await completeUpload({
        title: title.trim(),
        description: description.trim() || undefined,
        visibility,
      })
      
      // Reset form and close modal
      setSelectedFile(null)
      setTitle('')
      setDescription('')
      setVisibility('private')
      closeUploadModal()
    } catch (error) {
      console.error('Complete upload failed:', error)
    }
  }

  const handleClose = () => {
    if (uploadState.status === 'uploading' || uploadState.status === 'processing') {
      // Don't allow closing during upload
      return
    }
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setVisibility('private')
    closeUploadModal()
  }

  // Debug: Force show modal in development for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Debug mode - uploadState:', uploadState)
  }
  
  // Don't render until mounted on client (prevents hydration issues)
  if (!mounted) return null
  
  // Temporary: Force modal to show for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Render check - mounted:', mounted, 'isOpen:', uploadState.isOpen)
  }
  
  // TEMPORARY: Force modal to always show for testing
  // if (!uploadState.isOpen) return null
  
  // Show modal if mounted and state is open
  if (!mounted) return null
  if (!uploadState.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Upload Video</h2>
          <button
            onClick={handleClose}
            disabled={uploadState.status === 'uploading' || uploadState.status === 'processing'}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!selectedFile && uploadState.status === 'idle' && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-lg font-medium">Drag and drop your video here</p>
                <p className="text-gray-500 mt-1">or</p>
                <button
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: MP4, MOV, AVI, WEBM (Max 2GB)
              </p>
            </div>
          )}

          {selectedFile && uploadState.status === 'idle' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Selected file:</p>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title"
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter video description"
                    maxLength={5000}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <select
                    id="visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!title.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </div>
          )}

          {uploadState.status === 'uploading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 font-medium">Uploading video...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {uploadState.status === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 font-medium">Processing video...</p>
              <p className="text-sm text-gray-500">This may take a few minutes</p>
            </div>
          )}

          {uploadState.status === 'complete' && (
            <div className="text-center py-8">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 font-medium">Upload complete!</p>
              <p className="text-sm text-gray-500">Your video is being processed and will be available shortly.</p>
              <button
                onClick={handleClose}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          )}

          {uploadState.status === 'error' && (
            <div className="text-center py-8">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XMarkIcon className="w-5 h-5 text-red-600" />
              </div>
              <p className="mt-4 font-medium">Upload failed</p>
              <p className="text-sm text-red-600">{uploadState.error}</p>
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedFile) {
                      handleUpload()
                    }
                  }}
                  disabled={!selectedFile}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}