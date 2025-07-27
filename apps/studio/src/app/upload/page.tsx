"use client";

import { useState } from "react";
import {
  CloudArrowUpIcon,
  PhotoIcon,
  FilmIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  GlobeAltIcon,
  LockClosedIcon,
  TagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  LanguageIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function UploadPage() {
  const [uploadStep, setUploadStep] = useState("upload"); // upload, processing, details, publish
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file drop
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleFileInput = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: any[]) => {
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading", // uploading, processing, completed, error
      thumbnail: getFileThumbnail(file.type),
      uploadedAt: new Date()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: number) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(file => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 15, 100);
            const newStatus = newProgress >= 100 ? "processing" : "uploading";
            
            if (newProgress >= 100) {
              clearInterval(interval);
              // Start processing simulation
              setTimeout(() => {
                setUploadedFiles(prev2 => 
                  prev2.map(f => 
                    f.id === fileId ? { ...f, status: "completed" } : f
                  )
                );
              }, 2000);
            }
            
            return { ...file, progress: newProgress, status: newStatus };
          }
          return file;
        })
      );
    }, 200);
  };

  const getFileThumbnail = (type: string) => {
    if (type.startsWith("video/")) return "🎬";
    if (type.startsWith("audio/")) return "🎵";
    if (type.startsWith("image/")) return "🖼️";
    return "📄";
  };

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith("video/")) return FilmIcon;
    if (type.startsWith("audio/")) return MusicalNoteIcon;
    if (type.startsWith("image/")) return PhotoIcon;
    return DocumentTextIcon;
  };

  const mockVideoDetails = {
    title: "",
    description: "",
    thumbnail: null,
    visibility: "public",
    category: "Education",
    tags: [],
    monetization: false,
    scheduledDate: "",
    language: "English",
    caption: true,
    allowComments: true,
    allowLikes: true
  };

  const categories = [
    "Education", "Entertainment", "Gaming", "Music", "News", 
    "Sports", "Technology", "Travel", "Cooking", "Fashion"
  ];

  const languages = [
    "English", "Spanish", "French", "German", "Italian", 
    "Portuguese", "Russian", "Japanese", "Korean", "Chinese"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl">
                  <CloudArrowUpIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Upload Studio
                </h1>
                <p className="text-xl text-gray-600 font-light mt-1">Share your creativity with the world</p>
              </div>
              <span className="text-4xl ml-4">🚀</span>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-3">
              {[
                { id: "upload", label: "Upload", icon: "📁" },
                { id: "processing", label: "Process", icon: "⚙️" },
                { id: "details", label: "Details", icon: "📝" },
                { id: "publish", label: "Publish", icon: "🌟" }
              ].map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    uploadStep === step.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white/80 text-gray-600"
                  }`}>
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <span className={`font-bold ${
                    uploadStep === step.id ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {uploadStep === "upload" && (
          <div className="space-y-8">
            {/* Drag & Drop Zone */}
            <div
              className={`relative group transition-all duration-300 ${
                dragActive ? "scale-105" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity ${
                dragActive ? "opacity-70" : ""
              }`}></div>
              
              <div className={`relative bg-white/80 backdrop-blur-xl rounded-3xl border-4 border-dashed transition-all duration-300 ${
                dragActive 
                  ? "border-blue-400 bg-blue-50/50" 
                  : "border-gray-300 hover:border-blue-400"
              }`}>
                <div className="p-16 text-center">
                  <div className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    dragActive
                      ? "bg-gradient-to-br from-blue-100 to-purple-100 scale-110"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-purple-100"
                  }`}>
                    <CloudArrowUpIcon className={`w-16 h-16 transition-colors ${
                      dragActive ? "text-blue-600" : "text-gray-600 group-hover:text-blue-600"
                    }`} />
                  </div>
                  
                  <h2 className="text-4xl font-black text-gray-900 mb-4">
                    {dragActive ? "Drop your files here! 🎯" : "Drag & drop your masterpiece"}
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    or click to browse your device
                  </p>
                  
                  <input
                    type="file"
                    multiple
                    accept="video/*,audio/*,image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all cursor-pointer"
                  >
                    <PlusIcon className="w-6 h-6" />
                    Choose Files
                    <SparklesIcon className="w-6 h-6" />
                  </label>
                  
                  <div className="flex items-center justify-center gap-8 mt-8 text-gray-500">
                    <div className="flex items-center gap-2">
                      <FilmIcon className="w-6 h-6" />
                      <span>Videos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MusicalNoteIcon className="w-6 h-6" />
                      <span>Audio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhotoIcon className="w-6 h-6" />
                      <span>Images</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Queue */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-gray-900">Upload Queue 📤</h3>
                
                {uploadedFiles.map((file) => {
                  const FileIcon = getFileTypeIcon(file.type);
                  
                  return (
                    <div key={file.id} className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      
                      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg">
                        <div className="flex items-center gap-6">
                          {/* File Icon */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">{file.thumbnail}</span>
                          </div>
                          
                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-gray-900 truncate">{file.name}</h4>
                            <p className="text-sm text-gray-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                            </p>
                            
                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {file.status === "uploading" && "Uploading..."}
                                  {file.status === "processing" && "Processing..."}
                                  {file.status === "completed" && "Upload complete!"}
                                  {file.status === "error" && "Upload failed"}
                                </span>
                                <span className="text-sm text-gray-600">{Math.round(file.progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    file.status === "completed" 
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                      : file.status === "error"
                                      ? "bg-gradient-to-r from-red-500 to-pink-500"
                                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                                  }`}
                                  style={{ width: `${file.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Icon */}
                          <div className="flex items-center gap-3">
                            {file.status === "uploading" && (
                              <ArrowPathIcon className="w-6 h-6 text-blue-600 animate-spin" />
                            )}
                            {file.status === "processing" && (
                              <ClockIcon className="w-6 h-6 text-amber-600" />
                            )}
                            {file.status === "completed" && (
                              <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                            )}
                            {file.status === "error" && (
                              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                            )}
                            
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <XMarkIcon className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Continue Button */}
                {uploadedFiles.some(file => file.status === "completed") && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setUploadStep("details")}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all"
                    >
                      Continue to Details →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Details Form */}
        {uploadStep === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-lg opacity-10"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-3xl">📝</span>
                    Basic Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-2">Title *</label>
                      <input
                        type="text"
                        placeholder="Give your content an amazing title..."
                        className="w-full p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-2">Description</label>
                      <textarea
                        rows={6}
                        placeholder="Tell your audience what this is about..."
                        className="w-full p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-2">Category</label>
                        <select className="w-full p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-2">Language</label>
                        <select className="w-full p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-2">Tags</label>
                      <input
                        type="text"
                        placeholder="Add tags separated by commas..."
                        className="w-full p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-lg opacity-10"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-3xl">⚙️</span>
                    Settings & Privacy
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Visibility */}
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-4">Visibility</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: "public", label: "Public", icon: GlobeAltIcon, desc: "Everyone can see" },
                          { id: "unlisted", label: "Unlisted", icon: EyeIcon, desc: "Only with link" },
                          { id: "private", label: "Private", icon: LockClosedIcon, desc: "Only you" }
                        ].map((option) => (
                          <div key={option.id} className="relative">
                            <input
                              type="radio"
                              id={option.id}
                              name="visibility"
                              value={option.id}
                              defaultChecked={option.id === "public"}
                              className="hidden"
                            />
                            <label
                              htmlFor={option.id}
                              className="block p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition-all"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <option.icon className="w-6 h-6 text-blue-600" />
                                <span className="font-bold text-gray-900">{option.label}</span>
                              </div>
                              <p className="text-sm text-gray-600">{option.desc}</p>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Monetization */}
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
                        <div>
                          <h4 className="font-bold text-gray-900">Enable Monetization</h4>
                          <p className="text-sm text-gray-600">Earn revenue from this content</p>
                        </div>
                      </div>
                      <input type="checkbox" className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview Panel */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-lg opacity-20"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <EyeIcon className="w-6 h-6" />
                    Preview
                  </h3>
                  
                  <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-4">
                    <span className="text-6xl">🎬</span>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2">Your amazing title here</h4>
                  <p className="text-sm text-gray-600 mb-4">Channel Name • Just now</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>0 views</span>
                    <span>•</span>
                    <span>0 likes</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Tips */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-lg opacity-20"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6" />
                    Quick Tips
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">💡</span>
                      <div>
                        <p className="font-bold text-gray-900">Great titles get more views</p>
                        <p className="text-gray-600">Use clear, descriptive titles that grab attention</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-xl">🎯</span>
                      <div>
                        <p className="font-bold text-gray-900">Tags help discovery</p>
                        <p className="text-gray-600">Add relevant tags to help people find your content</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-xl">👀</span>
                      <div>
                        <p className="font-bold text-gray-900">Custom thumbnails work</p>
                        <p className="text-gray-600">Upload a custom thumbnail for better engagement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Publish Button */}
        {uploadStep === "details" && (
          <div className="text-center pt-8">
            <button className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl text-xl hover:shadow-lg transition-all">
              Publish Content 🚀
            </button>
          </div>
        )}

        {/* Add CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            33% {
              transform: translateY(-20px) rotate(5deg);
            }
            66% {
              transform: translateY(10px) rotate(-5deg);
            }
          }
          @keyframes float-delayed {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            33% {
              transform: translateY(15px) rotate(-5deg);
            }
            66% {
              transform: translateY(-25px) rotate(5deg);
            }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </div>
  );
}