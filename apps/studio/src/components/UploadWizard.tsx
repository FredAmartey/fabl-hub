'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import CustomDropdown from './CustomDropdown'
import ToggleSwitch from './ToggleSwitch'

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
}

interface VideoDetails {
  title: string
  description: string
  thumbnail: string | null
  category: string
  language: string
  tags: string[]
  playlist?: string
}

interface VisibilitySettings {
  visibility: 'public' | 'unlisted' | 'private'
  scheduledDate?: Date
  allowComments: boolean
  allowRatings: boolean
  license: string
  isForKids: boolean
}

interface UploadWizardProps {
  onClose: () => void
  onMultipleUploads?: (files: UploadFile[]) => void
}

interface PublishedVideo {
  id: string
  title: string
  url: string
  thumbnail: string
  uploadDate: string
  duration: string
}

export default function UploadWizard({ onClose, onMultipleUploads }: UploadWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([])
  const [videoDetails, setVideoDetails] = useState<VideoDetails>({
    title: '',
    description: '',
    thumbnail: null,
    category: 'entertainment',
    language: 'en',
    tags: []
  })
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    visibility: 'private',
    allowComments: true,
    allowRatings: true,
    license: 'standard',
    isForKids: false
  })
  const [selectedThumbnail, setSelectedThumbnail] = useState(1)
  const [tagInput, setTagInput] = useState('')
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [publishedVideo, setPublishedVideo] = useState<PublishedVideo | null>(null)
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set())

  useEffect(() => {
    return () => {
      // Clean up all intervals when component unmounts
      intervalsRef.current.forEach(interval => clearInterval(interval))
    }
  }, [])

  // Auto-advance to next step when single video upload completes
  useEffect(() => {
    console.log('Auto-advance check:', { currentStep, filesCount: uploadedFiles.length, isAutoAdvancing, files: uploadedFiles })
    
    if (currentStep === 1 && uploadedFiles.length === 1 && !isAutoAdvancing) {
      const file = uploadedFiles[0]
      console.log('Checking file for auto-advance:', file)
      
      if (file && file.status === 'completed') {
        console.log('Auto-advancing to step 2, file status:', file.status)
        setIsAutoAdvancing(true)
        
        // Small delay to let user see completion, then auto-advance
        const timer = setTimeout(() => {
          console.log('Executing auto-advance to step 2')
          setCurrentStep(2)
          setIsAutoAdvancing(false)
          console.log('Auto-advance complete, now on step 2')
        }, 800)
        
        return () => {
          console.log('Cleaning up auto-advance timer')
          clearTimeout(timer)
        }
      }
    }
  }, [uploadedFiles, currentStep, isAutoAdvancing])

  const steps = [
    { id: 1, title: "Upload", description: "Select files to upload" },
    { id: 2, title: "Details", description: "Add title, description & thumbnail" },
    { id: 3, title: "Visibility", description: "Choose who can see your video" },
    { id: 4, title: "Review", description: "Review and publish" }
  ]

  const categoryOptions = [
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "gaming", label: "Gaming", icon: "🎮" },
    { value: "music", label: "Music", icon: "🎵" },
    { value: "technology", label: "Technology", icon: "💻" },
    { value: "lifestyle", label: "Lifestyle", icon: "✨" },
    { value: "sports", label: "Sports", icon: "⚽" },
    { value: "news", label: "News & Politics", icon: "📰" }
  ]

  const languageOptions = [
    { value: "en", label: "English", icon: "🇺🇸" },
    { value: "es", label: "Spanish", icon: "🇪🇸" },
    { value: "fr", label: "French", icon: "🇫🇷" },
    { value: "de", label: "German", icon: "🇩🇪" }
  ]

  const playlistOptions = [
    { value: "", label: "Select playlist (optional)", icon: "📁" },
    { value: "recent", label: "Recent uploads", icon: "🆕" },
    { value: "favorites", label: "My favorites", icon: "⭐" },
    { value: "tutorials", label: "Tutorials", icon: "📚" },
    { value: "vlogs", label: "Vlogs", icon: "🎥" }
  ]

  const visibilityOptions = [
    { value: "public", label: "Public", icon: "🌍" },
    { value: "unlisted", label: "Unlisted", icon: "🔗" },
    { value: "private", label: "Private", icon: "🔒" }
  ]

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files)
    console.log('handleFileUpload called with', fileArray.length, 'files')
    
    // If multiple files, redirect to progress tracker
    if (fileArray.length > 1) {
      console.log('Multiple files detected, creating upload objects...')
      const newFiles: UploadFile[] = fileArray.map((file, index) => ({
        id: Date.now() + index + '',
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      }))
      
      console.log('Created files:', newFiles)
      
      // Call the multiple uploads handler if provided
      if (onMultipleUploads) {
        console.log('Calling onMultipleUploads...')
        onMultipleUploads(newFiles)
      } else {
        console.log('onMultipleUploads not provided!')
      }
      
      // Close the wizard
      console.log('Closing wizard...')
      onClose()
      return
    }
    
    // Single file - continue with wizard flow
    console.log('Single file detected, processing for wizard...')
    const newFiles: UploadFile[] = fileArray.map((file, index) => ({
      id: Date.now() + index + '',
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }))
    
    console.log('Setting uploaded files:', newFiles)
    setUploadedFiles(newFiles) // Replace instead of append to ensure clean state
    
    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      console.log('Starting upload simulation for file:', file.id)
      simulateUploadProgress(file.id)
    })
  }

  const simulateUploadProgress = (fileId: string) => {
    let currentProgress = 0
    
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 10 // Increment by 10-25% each time
      
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(currentProgress, 100)
          const newStatus = newProgress >= 100 ? 'completed' : 'uploading'
          
          console.log(`File ${fileId} progress: ${newProgress}%, status: ${newStatus}`)
          
          if (newProgress >= 100) {
            console.log('Upload completed for file:', fileId)
            
            // Trigger auto-advance directly for single file uploads
            if (currentStep === 1 && !isAutoAdvancing) {
              console.log('Triggering immediate auto-advance')
              setIsAutoAdvancing(true)
              setTimeout(() => {
                console.log('Auto-advancing to step 2')
                setCurrentStep(2)
                setIsAutoAdvancing(false)
              }, 800)
            }
          }
          
          return { 
            ...file, 
            progress: newProgress, 
            status: newStatus
          }
        }
        return file
      }))
      
      if (currentProgress >= 100) {
        clearInterval(interval)
        intervalsRef.current.delete(interval)
      }
    }, 300) // Faster updates
    
    intervalsRef.current.add(interval)
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !videoDetails.tags.includes(newTag)) {
        setVideoDetails(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
        setTagInput('')
      }
    }
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Check if the last character is a comma
    if (value.endsWith(',')) {
      const newTag = value.slice(0, -1).trim()
      if (newTag && !videoDetails.tags.includes(newTag)) {
        setVideoDetails(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
        setTagInput('')
      } else {
        setTagInput('')
      }
    } else {
      setTagInput(value)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setVideoDetails(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePublish = () => {
    // Simulate publishing process
    const videoId = 'abc123def456'
    const mockPublishedVideo: PublishedVideo = {
      id: videoId,
      title: videoDetails.title || 'Untitled Video',
      url: `https://fabl.tv/watch/${videoId}`,
      thumbnail: '/api/placeholder/320/180', // Mock thumbnail
      uploadDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      duration: '2:34' // Mock duration
    }
    
    setPublishedVideo(mockPublishedVideo)
    setIsPublished(true)
  }

  const copyVideoLink = () => {
    if (publishedVideo) {
      navigator.clipboard.writeText(publishedVideo.url)
      // Could add a toast notification here
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: 
        // For step 1, only show continue button if files are completed and not auto-advancing
        if (uploadedFiles.length === 1) {
          const file = uploadedFiles[0]
          return file && file.status === 'completed'
        }
        return uploadedFiles.length > 0 && uploadedFiles.some(f => f.status === 'completed')
      case 2: return videoDetails.title.trim().length > 0
      case 3: return true
      case 4: return true
      default: return false
    }
  }

  // Show success modal if video is published
  if (isPublished && publishedVideo) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Success Header */}
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Video published!</h2>
              <p className="text-gray-600">Your video is now live and ready to be shared.</p>
            </div>

            {/* Video Preview Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur-lg opacity-20"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-2xl">🎥</span>
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {publishedVideo.duration}
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 text-lg">{publishedVideo.title}</h3>
                    <p className="text-gray-500 text-sm">Uploaded {publishedVideo.uploadDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Share your video</h3>
              
              {/* Social Share Buttons */}
              <div className="flex justify-center gap-4 flex-wrap">
                <button className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-white text-xl">💬</span>
                </button>
                <button className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-white text-xl">f</span>
                </button>
                <button className="w-16 h-16 bg-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-white text-xl">𝕏</span>
                </button>
                <button className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-white text-xl">✉️</span>
                </button>
                <button className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-white text-xl">R</span>
                </button>
              </div>

              {/* Video Link */}
              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Video link</p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={publishedVideo.url}
                    readOnly
                    className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-blue-600 text-sm"
                  />
                  <button
                    onClick={copyVideoLink}
                    className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    <span className="text-gray-700">📋</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/content'}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                View in Content
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Steps */}
      <div className="flex-shrink-0 px-8 py-4">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100/50 rounded-full transition-all duration-200 hover:scale-105"
              title="Close upload"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">Upload Content</h2>
              <p className="text-gray-500 font-medium">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
        </div>
        
        {/* Progress Steps - Centered with Optical Balance */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle with Perfect Alignment */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-purple-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-600'
                  }`} style={{ 
                    borderRadius: '50%', 
                    width: '40px', 
                    height: '40px',
                    minWidth: '40px', 
                    minHeight: '40px'
                  }}>
                    {step.id}
                  </div>
                  
                  {/* Step Label - Optically Centered */}
                  <div className="text-center">
                    <div className={`text-sm font-semibold transition-colors duration-300 ${
                      currentStep >= step.id ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-tight">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="flex items-center mx-6 mb-6">
                    <div className={`h-0.5 w-16 transition-colors duration-300 ${
                      currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto border-t border-white/20">
        <div className="px-8 py-6">
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select files to upload</h3>
              <p className="text-gray-600">Upload a single video to use the guided wizard, or multiple videos for batch processing.</p>
            </div>

            {/* Upload Area */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-3xl">📁</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Drag and drop video files to upload</h4>
                <p className="text-gray-600 mb-6">Your videos will be private until you publish them</p>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                  SELECT FILES
                </button>
              </div>
            </div>

            {/* Upload Status - Fixed Position */}
            {uploadedFiles.length > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
                <div className="bg-white/95 backdrop-blur-xl rounded-xl p-3 border border-white/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🎥</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 truncate text-sm">{uploadedFiles[0]?.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadedFiles[0]?.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-purple-600 whitespace-nowrap">
                          {uploadedFiles[0]?.status === 'completed' ? '✅ Ready' :
                           uploadedFiles[0]?.status === 'uploading' ? `${Math.round(uploadedFiles[0]?.progress || 0)}%` :
                           'Processing...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add details</h3>
              <p className="text-gray-600">Add a title, description and thumbnail for your video</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Video Preview */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-10"></div>
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-3 border border-white/50">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-4xl">🎥</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Thumbnail</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[1,2,3].map(i => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedThumbnail(i)}
                          className={`aspect-video bg-gray-100 rounded border-2 cursor-pointer transition-colors ${
                            selectedThumbnail === i ? 'border-purple-400 bg-purple-50' : 'border-transparent hover:border-purple-400'
                          }`}
                        >
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            {selectedThumbnail === i ? '✓' : i}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Upload custom thumbnail
                    </button>
                  </div>
                </div>
              </div>

              {/* Details Form */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (required)</label>
                  <input
                    type="text"
                    value={videoDetails.title}
                    onChange={(e) => setVideoDetails(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Add a title that describes your video"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">{videoDetails.title.length}/100</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={videoDetails.description}
                    onChange={(e) => setVideoDetails(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell viewers about your video"
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 resize-none bg-white text-gray-900 placeholder-gray-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">{videoDetails.description.length}/5000</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <CustomDropdown
                      options={categoryOptions}
                      value={videoDetails.category}
                      onChange={(value) => setVideoDetails(prev => ({ ...prev, category: value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <CustomDropdown
                      options={languageOptions}
                      value={videoDetails.language}
                      onChange={(value) => setVideoDetails(prev => ({ ...prev, language: value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Playlist</label>
                  <CustomDropdown
                    options={playlistOptions}
                    value={videoDetails.playlist || ""}
                    onChange={(value) => setVideoDetails(prev => ({ ...prev, playlist: value }))}
                  />
                  <div className="text-xs text-gray-500 mt-1">Add your video to a playlist to organize your content</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  {videoDetails.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {videoDetails.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {tag}
                          <button 
                            onClick={() => removeTag(tag)}
                            className="hover:text-purple-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyPress}
                    placeholder="Add tags separated by commas or press Enter"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Tags help people find your video. Press Enter or comma to add.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Visibility */}
        {currentStep === 3 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visibility</h3>
              <p className="text-gray-600">Choose when to publish and who can see your video</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Save or publish</label>
                <CustomDropdown
                  options={visibilityOptions}
                  value={visibilitySettings.visibility}
                  onChange={(value) => setVisibilitySettings(prev => ({ ...prev, visibility: value as any }))}
                />
                <div className="mt-2 text-sm text-gray-600">
                  {visibilitySettings.visibility === 'public' && "Everyone can search for and view"}
                  {visibilitySettings.visibility === 'unlisted' && "Anyone with the link can view"}
                  {visibilitySettings.visibility === 'private' && "Only you can view"}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Audience</h4>
                  <p className="text-sm text-gray-600 mb-3">You're legally required to tell us whether your videos are made for kids.</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">Is this video made for kids?</span>
                      <p className="text-sm text-gray-600">This affects features like personalized ads and notifications</p>
                    </div>
                    <ToggleSwitch
                      checked={visibilitySettings.isForKids}
                      onChange={(checked) => setVisibilitySettings(prev => ({ ...prev, isForKids: checked }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Allow comments</span>
                    <p className="text-sm text-gray-600">Viewers can comment on your video</p>
                  </div>
                  <ToggleSwitch
                    checked={visibilitySettings.allowComments}
                    onChange={(checked) => setVisibilitySettings(prev => ({ ...prev, allowComments: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Allow ratings</span>
                    <p className="text-sm text-gray-600">Viewers can like or dislike your video</p>
                  </div>
                  <ToggleSwitch
                    checked={visibilitySettings.allowRatings}
                    onChange={(checked) => setVisibilitySettings(prev => ({ ...prev, allowRatings: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Review and publish</h3>
              <p className="text-gray-600">Make sure everything looks good before publishing</p>
            </div>

            {/* Content Checks */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur-lg opacity-10"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Content Checks
                </h4>
                <div className="space-y-3">
                  {/* Basic validation checks */}
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-sm">✅</span>
                    <span className="text-sm text-gray-700">Video uploaded successfully</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {videoDetails.title.trim() ? (
                      <>
                        <span className="text-green-600 text-sm">✅</span>
                        <span className="text-sm text-gray-700">Title provided</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-600 text-sm">❌</span>
                        <span className="text-sm text-red-700">Title is required</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {videoDetails.description.length > 0 ? (
                      <>
                        <span className="text-green-600 text-sm">✅</span>
                        <span className="text-sm text-gray-700">Description added</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-600 text-sm">⚠️</span>
                        <span className="text-sm text-amber-700">Consider adding a description for better discoverability</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {videoDetails.tags.length > 0 ? (
                      <>
                        <span className="text-green-600 text-sm">✅</span>
                        <span className="text-sm text-gray-700">{videoDetails.tags.length} tags added</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-600 text-sm">⚠️</span>
                        <span className="text-sm text-amber-700">Consider adding tags to help viewers find your video</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {visibilitySettings.visibility === 'public' ? (
                      <>
                        <span className="text-blue-600 text-sm">🌍</span>
                        <span className="text-sm text-gray-700">Video will be public</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600 text-sm">🔒</span>
                        <span className="text-sm text-gray-700">Video will be {visibilitySettings.visibility}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-sm">✅</span>
                    <span className="text-sm text-gray-700">
                      Content suitable for {visibilitySettings.isForKids ? 'kids' : 'general audiences'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  💡 These are basic content checks. Your video may be reviewed after publishing.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Details - Left Side */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-10"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
                  <h4 className="font-bold text-gray-900 mb-4">Video Details</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Title:</span>
                      <p className="text-gray-900 font-medium">{videoDetails.title || 'Untitled'}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Description:</span>
                      <p className="text-gray-700 text-sm mt-1 line-clamp-3">
                        {videoDetails.description || 'No description provided'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Visibility:</span>
                        <p className="text-gray-900 capitalize">{visibilitySettings.visibility}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Audience:</span>
                        <p className="text-gray-900">{visibilitySettings.isForKids ? 'Kids' : 'General'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Category:</span>
                        <p className="text-gray-900">{categoryOptions.find(c => c.value === videoDetails.category)?.label}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Language:</span>
                        <p className="text-gray-900">{languageOptions.find(l => l.value === videoDetails.language)?.label}</p>
                      </div>
                    </div>
                    
                    {videoDetails.playlist && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Playlist:</span>
                        <p className="text-gray-900">{playlistOptions.find(p => p.value === videoDetails.playlist)?.label}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Tags:</span>
                      {videoDetails.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {videoDetails.tags.slice(0, 4).map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {videoDetails.tags.length > 4 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{videoDetails.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No tags added</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Preview - Right Side */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-10"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
                  <h4 className="font-bold text-gray-900 mb-4">Video Preview</h4>
                  
                  {/* Video Preview Window */}
                  <div className="aspect-video bg-gray-900 rounded-xl mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      {uploadedFiles[0] ? (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-white/30 transition-colors">
                            <span className="text-3xl">▶️</span>
                          </div>
                          <p className="text-white text-sm font-medium">{uploadedFiles[0].name}</p>
                          <p className="text-gray-300 text-xs mt-1">
                            {(uploadedFiles[0].size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-4xl mb-2 block">🎥</span>
                          <p className="text-gray-400 text-sm">No video uploaded</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Video Status Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex items-center gap-2">
                        {uploadedFiles[0]?.status === 'completed' ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-white text-xs">Ready to publish</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs">Processing...</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    💡 This is how your video will appear to viewers
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Footer with Navigation - Hide on step 1 since it auto-advances */}
      {currentStep > 1 && (
        <div className="flex-shrink-0 border-t border-white/20 px-8 py-4 flex items-center justify-between bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-all duration-200 font-medium hover:bg-gray-100/50 rounded-lg text-sm"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 text-sm"
              >
                Continue
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
              >
                <span className="text-base">🚀</span>
                Publish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}