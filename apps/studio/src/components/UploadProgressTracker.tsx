'use client'

import { useState, useEffect } from 'react'
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  thumbnail?: string
}

interface UploadProgressTrackerProps {
  files: UploadFile[]
  onClose: () => void
  onEditVideo: (fileId: string) => void
  onRemoveFile: (fileId: string) => void
  isVisible: boolean
}

export default function UploadProgressTracker({ 
  files, 
  onClose, 
  onEditVideo, 
  onRemoveFile,
  isVisible 
}: UploadProgressTrackerProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const completed = files.filter(file => file.status === 'completed').length
    setCompletedCount(completed)
  }, [files])

  const totalFiles = files.length
  const uploadingFiles = files.filter(file => file.status === 'uploading' || file.status === 'processing')
  const errorFiles = files.filter(file => file.status === 'error')

  if (!isVisible || totalFiles === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      {/* Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-t-2xl blur-lg opacity-20"></div>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-t-2xl border border-white/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📤</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {completedCount === totalFiles ? 'Uploads Complete' : 'Uploading...'}
                </h3>
                <p className="text-sm text-gray-600">
                  {completedCount} of {totalFiles} videos processed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalFiles) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* File List */}
      {!isMinimized && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-b-2xl blur-lg opacity-20"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-b-2xl border-x border-b border-white/50 max-h-80 overflow-y-auto">
            <div className="p-4 space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {file.thumbnail ? (
                      <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">🎥</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            file.status === 'completed' ? 'bg-green-500' :
                            file.status === 'error' ? 'bg-red-500' :
                            'bg-gradient-to-r from-purple-600 to-pink-600'
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        file.status === 'completed' ? 'text-green-600' :
                        file.status === 'error' ? 'text-red-600' :
                        'text-purple-600'
                      }`}>
                        {file.status === 'completed' ? 'Done' :
                         file.status === 'error' ? 'Error' :
                         `${Math.round(file.progress)}%`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {file.status === 'completed' && (
                      <button
                        onClick={() => onEditVideo(file.id)}
                        className="p-2 hover:bg-purple-100 rounded-lg transition-colors group"
                        title="Edit video details"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                      </button>
                    )}
                    <button
                      onClick={() => onRemoveFile(file.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                      title="Remove from queue"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            {completedCount === totalFiles && totalFiles > 0 && (
              <div className="border-t border-gray-200 p-4 bg-green-50/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-lg">✅</span>
                    <span className="font-medium text-green-700">All uploads complete!</span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/content'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    View Content
                  </button>
                </div>
              </div>
            )}

            {errorFiles.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-red-50/80">
                <div className="flex items-center gap-2">
                  <span className="text-red-600 text-lg">⚠️</span>
                  <span className="font-medium text-red-700">
                    {errorFiles.length} upload{errorFiles.length > 1 ? 's' : ''} failed
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}