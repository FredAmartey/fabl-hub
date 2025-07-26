import React, { useState, useRef } from 'react';
import { Button } from '../Button';
import { UploadIcon, XIcon, CheckIcon, EyeIcon, TagIcon, InfoIcon, LockIcon, GlobeIcon } from 'lucide-react';
export function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ai-cinematics');
  const [visibility, setVisibility] = useState('public');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = (file: File) => {
    setFile(file);
    // Create a preview for video or image
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    // Simulate upload
    setUploading(true);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadComplete(true);
            setUploading(false);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  return <div className="px-6 pt-6 pb-12 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
          Upload AI Content
        </h1>
        <p className="text-gray-400 mt-1">
          Share your AI-generated videos, music, and art with the fabl.tv
          community
        </p>
      </div>
      {uploadComplete ? <div className="text-center py-16 bg-[#1a1230] rounded-xl">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-medium mb-2">Upload Complete!</h2>
          <p className="text-gray-400 mb-6">
            Your content is now being processed and will be available shortly
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
            <Button variant="outline" onClick={() => {
          setFile(null);
          setPreview(null);
          setTitle('');
          setDescription('');
          setUploadComplete(false);
          setUploadProgress(0);
        }}>
              Upload Another
            </Button>
          </div>
        </div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {!file ? <div className={`
                    border-2 border-dashed rounded-xl p-8 text-center
                    ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-purple-500/50 hover:bg-[#1a1230]'}
                    transition-all duration-300 cursor-pointer
                  `} onClick={() => inputRef.current?.click()} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                  <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept="video/*,image/*" />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#241a38] flex items-center justify-center">
                    <UploadIcon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {dragActive ? 'Drop your file here' : 'Drag and drop or click to upload'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Supported formats: MP4, MOV, AVI, PNG, JPG, GIF
                  </p>
                  <Button variant="primary" type="button">
                    Select File
                  </Button>
                </div> : <div className="bg-[#1a1230] rounded-xl overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    {preview && (preview.includes('video') ? <video src={preview} className="w-full h-full object-contain" controls /> : <img src={preview} alt="Preview" className="w-full h-full object-contain" />)}
                    <button type="button" onClick={removeFile} className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-gray-400">
                          Selected file:
                        </span>
                        <div className="font-medium truncate max-w-xs">
                          {file.name}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {Math.round(file.size / 1024 / 1024 * 10) / 10} MB
                      </span>
                    </div>
                    {uploading && <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500" style={{
                    width: `${uploadProgress}%`
                  }} />
                        </div>
                      </div>}
                  </div>
                </div>}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input type="text" className="w-full bg-[#1a1230] border border-purple-500/30 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500 transition-colors" placeholder="Enter a title for your content" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea className="w-full bg-[#1a1230] border border-purple-500/30 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500 transition-colors min-h-[100px]" placeholder="Describe your AI-generated content..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select className="w-full bg-[#1a1230] border border-purple-500/30 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500 transition-colors" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="ai-cinematics">AI Cinematics</option>
                    <option value="neural-dreams">Neural Dreams</option>
                    <option value="synthetic-stories">Synthetic Stories</option>
                    <option value="visual-wonders">Visual Wonders</option>
                    <option value="ai-music">AI Music</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="robot-creations">Robot Creations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Visibility
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    <button type="button" className={`
                        flex items-center p-3 rounded-lg border 
                        ${visibility === 'public' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 hover:border-purple-500/50'}
                        transition-all
                      `} onClick={() => setVisibility('public')}>
                      <GlobeIcon className="w-5 h-5 mr-2 text-purple-400" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Public</div>
                        <div className="text-xs text-gray-400">
                          Everyone can see
                        </div>
                      </div>
                    </button>
                    <button type="button" className={`
                        flex items-center p-3 rounded-lg border 
                        ${visibility === 'unlisted' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 hover:border-purple-500/50'}
                        transition-all
                      `} onClick={() => setVisibility('unlisted')}>
                      <EyeIcon className="w-5 h-5 mr-2 text-purple-400" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Unlisted</div>
                        <div className="text-xs text-gray-400">
                          Only via link
                        </div>
                      </div>
                    </button>
                    <button type="button" className={`
                        flex items-center p-3 rounded-lg border 
                        ${visibility === 'private' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 hover:border-purple-500/50'}
                        transition-all
                      `} onClick={() => setVisibility('private')}>
                      <LockIcon className="w-5 h-5 mr-2 text-purple-400" />
                      <div className="text-left">
                        <div className="font-medium text-sm">Private</div>
                        <div className="text-xs text-gray-400">
                          Only you can see
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="primary" type="submit" className="w-full sm:w-auto" disabled={!file || uploading}>
                    {uploading ? 'Uploading...' : 'Upload Content'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div>
            <div className="bg-[#1a1230] rounded-xl p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <InfoIcon className="w-4 h-4 mr-2 text-purple-400" />
                Upload Guidelines
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>
                    Only upload AI-generated content that you have the rights to
                    share
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Maximum file size: 2GB</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Supported video formats: MP4, MOV, AVI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Supported image formats: PNG, JPG, GIF</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Content must follow our community guidelines</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="font-medium mb-2 flex items-center">
                  <TagIcon className="w-4 h-4 mr-2 text-purple-400" />
                  AI Model Information
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  Help viewers understand how your content was created by
                  providing information about the AI models used.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Add AI Model Details
                </Button>
              </div>
            </div>
            <div className="mt-4 bg-[#1a1230] rounded-xl p-4">
              <h3 className="font-medium mb-3">Processing Time</h3>
              <p className="text-sm text-gray-400">
                After uploading, your content will be processed by our system.
                This may take a few minutes depending on file size and server
                load.
              </p>
            </div>
          </div>
        </div>}
    </div>;
}