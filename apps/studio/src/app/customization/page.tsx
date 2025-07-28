"use client";

import { useState } from "react";
import {
  PhotoIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CameraIcon,
  DocumentTextIcon,
  TagIcon,
  AtSymbolIcon,
  PaintBrushIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function CustomizationPage() {
  const [activeSection, setActiveSection] = useState("banner");
  const [links, setLinks] = useState([
    { id: 1, title: "Website", url: "https://example.com" },
    { id: 2, title: "Twitter", url: "https://twitter.com/username" }
  ]);

  const channelData = {
    name: "Fred A",
    handle: "Fred-xh7gl",
    channelUrl: "https://www.fabl.tv/channel/UCeXfIwHJkwMqdsFRWjBwoQw",
    description: "",
    contactEmail: "",
    pronouns: "",
    bannerImage: null,
    profilePicture: null,
    watermark: null
  };

  const sections = [
    { id: "banner", name: "Banner Image", icon: PhotoIcon },
    { id: "profile", name: "Profile Picture", icon: UserIcon },
    { id: "basic", name: "Basic Info", icon: DocumentTextIcon },
    { id: "links", name: "Links", icon: LinkIcon },
    { id: "watermark", name: "Video Watermark", icon: TagIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <PaintBrushIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Channel customization</h1>
              </div>
              <p className="text-lg text-gray-600">
                Customize your channel's appearance and information
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="group relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border border-white/50">
                  <EyeIcon className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-900">View Channel</span>
                </div>
              </button>
              <button className="group relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border border-white/50">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-gray-900">Publish Changes</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Banner Image Section */}
        {activeSection === "banner" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-10"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <PhotoIcon className="w-6 h-6 text-purple-600" />
                      Banner image
                    </h2>
                    <p className="text-gray-600 mt-2">This image will appear across the top of your channel</p>
                  </div>
                </div>

                {/* Banner Preview Area */}
                <div className="mb-6">
                  <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No banner image uploaded</p>
                      <p className="text-sm text-gray-500">Recommended: 2048 x 1152 pixels</p>
                    </div>
                  </div>
                </div>

                {/* Upload Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Upload guidelines</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• For the best results on all devices, use an image that's at least 2048 x 1152 pixels</li>
                        <li>• Maximum file size: 6MB or less</li>
                        <li>• Supported formats: JPG, PNG, BMP, or non-animated GIF</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Upload Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                    <PhotoIcon className="w-5 h-5" />
                    Upload
                  </button>
                  <button className="px-4 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-all">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Picture Section */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-10"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <UserIcon className="w-6 h-6 text-purple-600" />
                      Profile picture
                    </h2>
                    <p className="text-gray-600 mt-2">Your profile picture will appear where your channel is presented on Fabl, like next to your videos and comments</p>
                  </div>
                </div>

                {/* Profile Picture Preview */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Current profile picture</h3>
                    <p className="text-gray-600 mb-4">No profile picture uploaded</p>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <InformationCircleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-900 mb-1">Image requirements</h4>
                          <ul className="text-sm text-amber-800 space-y-1">
                            <li>• It's recommended to use a picture that's at least 98 x 98 pixels</li>
                            <li>• Maximum file size: 4MB or less</li>
                            <li>• Use a PNG or GIF (no animations) file</li>
                            <li>• Make sure your picture follows the Fabl Community Guidelines</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                    <PhotoIcon className="w-5 h-5" />
                    Change
                  </button>
                  <button className="px-4 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-all">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Info Section */}
        {activeSection === "basic" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-10"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                  <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                  Basic information
                </h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <p className="text-sm text-gray-600 mb-3">
                      Choose a channel name that represents you and your content. Changes made to your name and picture are visible only on Fabl. You can change your name twice in 14 days.
                    </p>
                    <input
                      type="text"
                      defaultValue={channelData.name}
                      className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-gray-900"
                    />
                  </div>

                  {/* Handle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Handle</label>
                    <p className="text-sm text-gray-600 mb-3">
                      Choose your unique handle by adding letters and numbers. You can change your handle back within 14 days. Handles can be changed twice every 14 days.
                    </p>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-600 font-medium">
                        @
                      </span>
                      <input
                        type="text"
                        defaultValue={channelData.handle}
                        className="flex-1 p-3 bg-white/80 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-gray-900"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      https://www.fabl.tv/@{channelData.handle}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-sm text-gray-600 mb-3">
                      Let people know how to contact you with business inquiries. The email address you enter may appear in the About section of your channel and be visible to viewers.
                    </p>
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>


                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places."
                      className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 resize-none text-gray-900 placeholder-gray-500"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Add language
                      </button>
                      <span className="text-xs text-gray-500">0 / 1000</span>
                    </div>
                  </div>

                  {/* Channel URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Channel URL</label>
                    <p className="text-sm text-gray-600 mb-3">
                      This is the standard web address for your channel. It includes your unique channel ID, which is the numbers and letters at the end of the URL.
                    </p>
                    <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className="text-gray-900 font-mono text-sm">{channelData.channelUrl}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links Section */}
        {activeSection === "links" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-10"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <LinkIcon className="w-6 h-6 text-purple-600" />
                      Links
                    </h2>
                    <p className="text-gray-600 mt-2">Share external links with your viewers. They'll be visible on your channel profile and about page.</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                    <PlusIcon className="w-4 h-4" />
                    Add link
                  </button>
                </div>

                <div className="space-y-4">
                  {links.map((link) => (
                    <div key={link.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{link.title}</h3>
                        <p className="text-sm text-gray-600">{link.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <PencilIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <TrashIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {links.length === 0 && (
                    <div className="text-center py-8">
                      <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No links added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Video Watermark Section */}
        {activeSection === "watermark" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-10"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                  <TagIcon className="w-6 h-6 text-purple-600" />
                  Video watermark
                </h2>

                <div className="space-y-6">
                  <p className="text-gray-600">
                    The watermark will appear on your videos in the right-hand corner of the video player
                  </p>

                  {/* Watermark Preview */}
                  <div className="bg-gray-100 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TagIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No watermark uploaded</p>
                    <p className="text-sm text-gray-500">150 x 150 pixels recommended</p>
                  </div>

                  {/* Upload Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Upload guidelines</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• An image that's 150 x 150 pixels is recommended</li>
                          <li>• Use a PNG, GIF (no animations), BMP, or JPEG file</li>
                          <li>• Maximum file size: 1MB or less</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Upload Actions */}
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                      <PhotoIcon className="w-5 h-5" />
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
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