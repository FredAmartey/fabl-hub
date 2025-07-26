'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CustomSelect } from '@/components/ui/custom-select'
import { Checkbox } from '@/components/ui/checkbox'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('permissions')

  const tabs = [
    { id: 'permissions', name: 'Permissions' },
    { id: 'defaults', name: 'Defaults' },
    { id: 'advanced', name: 'Advanced' }
  ]

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-afacad text-white mb-2">Settings</h1>
          <p className="text-white/60 font-afacad">Manage your studio preferences and configurations</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 px-6 py-3 text-sm font-afacad font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeSettingsTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'permissions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold font-afacad text-white mb-6">Content Permissions</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Allow comments</p>
                      <p className="text-white/60 font-afacad text-sm">Users can comment on your videos</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Allow likes/dislikes</p>
                      <p className="text-white/60 font-afacad text-sm">Users can rate your content</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Allow sharing</p>
                      <p className="text-white/60 font-afacad text-sm">Users can share your videos</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Allow embedding</p>
                      <p className="text-white/60 font-afacad text-sm">Videos can be embedded on other sites</p>
                    </div>
                    <Checkbox />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold font-afacad text-white mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Show subscriber count</p>
                      <p className="text-white/60 font-afacad text-sm">Display your subscriber count publicly</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Allow channel mentions</p>
                      <p className="text-white/60 font-afacad text-sm">Others can mention your channel</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Show activity feed</p>
                      <p className="text-white/60 font-afacad text-sm">Display your public activity</p>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Allow direct messages</p>
                      <p className="text-white/60 font-afacad text-sm">Users can send you private messages</p>
                    </div>
                    <Checkbox />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'defaults' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold font-afacad text-white mb-6">Upload Defaults</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-afacad font-semibold mb-2">Default visibility</label>
                    <CustomSelect
                      options={[
                        { value: 'public', label: 'Public' },
                        { value: 'unlisted', label: 'Unlisted' },
                        { value: 'private', label: 'Private' }
                      ]}
                      defaultValue="public"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-afacad font-semibold mb-2">Default category</label>
                    <CustomSelect
                      options={[
                        { value: 'gaming', label: 'Gaming' },
                        { value: 'tech', label: 'Technology' },
                        { value: 'education', label: 'Education' },
                        { value: 'entertainment', label: 'Entertainment' }
                      ]}
                      defaultValue="tech"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-afacad font-semibold mb-2">Default language</label>
                    <CustomSelect
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' }
                      ]}
                      defaultValue="en"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold font-afacad text-white mb-6">Content Defaults</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Auto-generate subtitles</p>
                      <p className="text-white/60 font-afacad text-sm">Automatically create subtitles for uploads</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Enable comments by default</p>
                      <p className="text-white/60 font-afacad text-sm">Allow comments on new uploads</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Notify subscribers</p>
                      <p className="text-white/60 font-afacad text-sm">Send notifications for new uploads</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Add to channel trailer</p>
                      <p className="text-white/60 font-afacad text-sm">Consider for channel trailer rotation</p>
                    </div>
                    <Checkbox />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold font-afacad text-white mb-6">Advanced Features</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-afacad font-semibold mb-2">Video quality</label>
                    <CustomSelect
                      options={[
                        { value: '4k', label: '4K (2160p)' },
                        { value: '1440p', label: '1440p' },
                        { value: '1080p', label: '1080p' },
                        { value: '720p', label: '720p' }
                      ]}
                      defaultValue="1080p"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-afacad font-semibold mb-2">Encoding preset</label>
                    <CustomSelect
                      options={[
                        { value: 'fast', label: 'Fast' },
                        { value: 'balanced', label: 'Balanced' },
                        { value: 'quality', label: 'High Quality' }
                      ]}
                      defaultValue="balanced"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Enable HDR</p>
                      <p className="text-white/60 font-afacad text-sm">High Dynamic Range support</p>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Auto-enhance audio</p>
                      <p className="text-white/60 font-afacad text-sm">Automatically improve audio quality</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold font-afacad text-white mb-6">API & Integrations</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Enable API access</p>
                      <p className="text-white/60 font-afacad text-sm">Allow third-party integrations</p>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-afacad font-semibold">Webhook notifications</p>
                      <p className="text-white/60 font-afacad text-sm">Send events to external services</p>
                    </div>
                    <Checkbox />
                  </div>
                  <div>
                    <label className="block text-white font-afacad font-semibold mb-2">Backup frequency</label>
                    <CustomSelect
                      options={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'never', label: 'Never' }
                      ]}
                      defaultValue="weekly"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-afacad font-semibold transition-all duration-200">
                      Export Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}