'use client'

import { useState } from 'react'
import type { ChannelSettings, AudienceType } from '@/types/channel-settings'
import { AUDIENCE_SETTINGS } from '@/types/channel-settings'

interface ChannelSettingsProps {
  onSave?: (settings: ChannelSettings) => void
}

export default function ChannelSettings({ onSave }: ChannelSettingsProps) {
  const [settings, setSettings] = useState<ChannelSettings>({
    audienceType: 'not-kids',
    googleAdsLinked: false,
    hideInappropriateWords: true,
    disableInterestBasedAds: false,
    allowViewerClips: true,
    allowAiTraining: false,
    updatedAt: new Date().toISOString()
  })

  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = <K extends keyof ChannelSettings>(
    key: K,
    value: ChannelSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave?.(settings)
    setHasChanges(false)
  }

  const selectedAudienceSetting = AUDIENCE_SETTINGS.find(
    setting => setting.type === settings.audienceType
  )

  return (
    <div className="space-y-6">
      {/* Save button */}
      {hasChanges && (
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Audience Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-orange-500">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900">Audience</h3>
        </div>
        <p className="text-sm text-gray-600">
          Simplify your workflow by selecting a channel setting. This setting will affect existing and future videos.
        </p>

        <div>
          <p className="font-medium text-gray-900 mb-3">Do you want to set your channel as made for kids?</p>
          <p className="text-xs text-gray-600 mb-4">
            You're legally required to comply with COPPA and/or other laws. You're required to tell us whether your videos are made for kids.{' '}
            <button className="text-blue-600 hover:underline">What's content made for kids?</button>
          </p>
        </div>

        <div className="space-y-3">
          {AUDIENCE_SETTINGS.map((option) => (
            <div key={option.type} className="space-y-2">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id={option.type}
                  name="audienceType"
                  value={option.type}
                  checked={settings.audienceType === option.type}
                  onChange={(e) => updateSetting('audienceType', e.target.value as AudienceType)}
                  className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-300"
                />
                <div className="space-y-1 flex-1">
                  <label htmlFor={option.type} className="font-medium text-gray-900 cursor-pointer">
                    {option.label}
                  </label>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              {option.type === settings.audienceType && option.changes.length > 0 && (
                <div className="ml-7 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 text-sm">ℹ️</div>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Changes to your channel:</p>
                      <ul className="mt-1 space-y-1 text-sm text-blue-800">
                        {option.changes.map((change, index) => (
                          <li key={index}>• {change}</li>
                        ))}
                      </ul>
                      <button className="text-blue-600 hover:underline text-sm mt-2">
                        See all changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Google Ads Account Linking */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Google Ads account linking</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 mr-4">
            <p className="font-medium text-gray-900">Link account</p>
            <p className="text-sm text-gray-600">
              Link your channel to a Google Ads account to run ads based on interactions with your videos.{' '}
              <button className="text-blue-600 hover:underline">Learn more</button>
            </p>
          </div>
          <button 
            onClick={() => updateSetting('googleAdsLinked', !settings.googleAdsLinked)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              settings.googleAdsLinked 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {settings.googleAdsLinked ? 'Unlink' : 'Link account'}
          </button>
        </div>
      </div>

      {/* Automatic Captions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Automatic captions</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 mr-4">
            <p className="font-medium text-gray-900">Don't show potentially inappropriate words</p>
            <p className="text-sm text-gray-600">
              Auto-captioning occasionally makes mistakes. This setting prevents potentially inappropriate words from being displayed.{' '}
              <button className="text-blue-600 hover:underline">Learn more</button>
            </p>
          </div>
          <button
            onClick={() => updateSetting('hideInappropriateWords', !settings.hideInappropriateWords)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              settings.hideInappropriateWords ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              settings.hideInappropriateWords ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Advertisements */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Advertisements</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 mr-4">
            <p className="font-medium text-gray-900">Disable interest-based ads</p>
            <p className="text-sm text-gray-600">
              If you select this option, personalized ads will not be shown on videos on your channel. 
              This may significantly reduce your channel's revenue.
            </p>
          </div>
          <button
            onClick={() => updateSetting('disableInterestBasedAds', !settings.disableInterestBasedAds)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              settings.disableInterestBasedAds ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              settings.disableInterestBasedAds ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Clips */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Clips</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 mr-4">
            <p className="font-medium text-gray-900">Allow viewers to clip my content</p>
            <p className="text-sm text-gray-600">
              If you deselect this option, viewers will not be able to clip your content, 
              and existing clips will be disabled.
            </p>
          </div>
          <button
            onClick={() => updateSetting('allowViewerClips', !settings.allowViewerClips)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              settings.allowViewerClips ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              settings.allowViewerClips ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Third-party Training */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Third-party training</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 mr-4">
            <p className="font-medium text-gray-900">Allow third-party companies to train AI models using my channel content</p>
            <p className="text-sm text-gray-600">
              If you select this option, we may share your videos with third-party companies. 
              The training permission status will be available through a publicly accessible interface.{' '}
              <button className="text-blue-600 hover:underline">Learn more</button>
            </p>
          </div>
          <button
            onClick={() => updateSetting('allowAiTraining', !settings.allowAiTraining)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              settings.allowAiTraining ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              settings.allowAiTraining ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Other Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Other settings</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-start gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
            <span>🔗</span>
            Manage YouTube account
          </button>
          <button className="w-full flex items-center justify-start gap-2 p-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600 font-medium">
            <span>🗑️</span>
            Remove YouTube content
          </button>
        </div>
      </div>
    </div>
  )
}