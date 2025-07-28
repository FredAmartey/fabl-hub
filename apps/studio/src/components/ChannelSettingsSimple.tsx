'use client'

import { useState } from 'react'

export default function ChannelSettingsSimple() {
  const [audienceType, setAudienceType] = useState('not-kids')
  const [googleAdsLinked, setGoogleAdsLinked] = useState(false)
  const [hideInappropriateWords, setHideInappropriateWords] = useState(true)

  const handleManageFablAccount = () => {
    // Navigate to Hub app's user account settings page
    // TODO: Replace with actual Hub app URL when available
    const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || 'http://localhost:3000'
    window.open(`${hubUrl}/settings`, '_blank')
  }

  const handleRemoveContent = () => {
    // Navigate to content management page with deletion tools
    window.location.href = '/content?action=manage'
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Channel Settings</h3>
      
      {/* Audience Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-orange-500">⚠️</span>
          <h4 className="text-lg font-semibold text-gray-900">Audience</h4>
        </div>
        <p className="text-sm text-gray-600">
          Set your channel as made for kids to comply with COPPA regulations.
        </p>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id="kids"
              name="audience"
              value="kids"
              checked={audienceType === 'kids'}
              onChange={(e) => setAudienceType(e.target.value)}
              className="mt-0.5 w-4 h-4 text-purple-600"
            />
            <div>
              <label htmlFor="kids" className="font-medium text-gray-900 cursor-pointer">
                Yes, set this channel as made for kids
              </label>
              <p className="text-sm text-gray-600">I mostly upload content made for kids</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id="not-kids"
              name="audience"
              value="not-kids"
              checked={audienceType === 'not-kids'}
              onChange={(e) => setAudienceType(e.target.value)}
              className="mt-0.5 w-4 h-4 text-purple-600"
            />
            <div>
              <label htmlFor="not-kids" className="font-medium text-gray-900 cursor-pointer">
                No, set this channel as not made for kids
              </label>
              <p className="text-sm text-gray-600">I almost never upload content made for kids</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id="review"
              name="audience"
              value="review"
              checked={audienceType === 'review'}
              onChange={(e) => setAudienceType(e.target.value)}
              className="mt-0.5 w-4 h-4 text-purple-600"
            />
            <div>
              <label htmlFor="review" className="font-medium text-gray-900 cursor-pointer">
                I want to review this setting for every video
              </label>
              <p className="text-sm text-gray-600">You'll identify each video individually</p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Ads Section */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-900">Google Ads account linking</h4>
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="font-medium text-gray-900">Link account</p>
            <p className="text-sm text-gray-600">
              Link your channel to a Google Ads account to run targeted ads
            </p>
          </div>
          <button 
            onClick={() => setGoogleAdsLinked(!googleAdsLinked)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              googleAdsLinked 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {googleAdsLinked ? 'Unlink' : 'Link account'}
          </button>
        </div>
      </div>

      {/* Automatic Captions */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-900">Automatic captions</h4>
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="font-medium text-gray-900">Hide inappropriate words</p>
            <p className="text-sm text-gray-600">
              Prevent potentially inappropriate words from showing in auto-captions
            </p>
          </div>
          <button
            onClick={() => setHideInappropriateWords(!hideInappropriateWords)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              hideInappropriateWords ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              hideInappropriateWords ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Other Settings */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-900">Other settings</h4>
        <div className="space-y-2">
          <button 
            onClick={handleManageFablAccount}
            className="w-full flex items-center justify-start gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            🔗 Manage Fabl Account
          </button>
          <button 
            onClick={handleRemoveContent}
            className="w-full flex items-center justify-start gap-2 p-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600 font-medium"
          >
            🗑️ Remove content
          </button>
        </div>
      </div>
    </div>
  )
}