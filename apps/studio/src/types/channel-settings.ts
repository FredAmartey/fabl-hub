export type AudienceType = 'kids' | 'not-kids' | 'review-per-video'

export type ChannelSettings = {
  // Audience Settings
  audienceType: AudienceType
  
  // Google Ads Account Linking
  googleAdsLinked: boolean
  googleAdsAccountId?: string
  
  // Automatic Captions
  hideInappropriateWords: boolean
  
  // Advertisements
  disableInterestBasedAds: boolean
  
  // Clips
  allowViewerClips: boolean
  
  // Third-party Training
  allowAiTraining: boolean
  
  // Metadata
  updatedAt: string
  updatedBy?: string
}

export type ChannelSettingsUpdate = Partial<Omit<ChannelSettings, 'updatedAt' | 'updatedBy'>>

export type AudienceSettingInfo = {
  type: AudienceType
  label: string
  description: string
  changes: string[]
}

export const AUDIENCE_SETTINGS: AudienceSettingInfo[] = [
  {
    type: 'kids',
    label: "Yes, set this channel as made for kids.",
    description: "I mostly upload content that's made for kids.",
    changes: [
      "Ads won't be personalized. Viewers can still be shown non-personalized ads.",
      "Notifications, comments, and stories will be disabled."
    ]
  },
  {
    type: 'not-kids',
    label: "No, set this channel as not made for kids.",
    description: "I almost never upload content that's made for kids.",
    changes: []
  },
  {
    type: 'review-per-video',
    label: "I want to review this setting for every video.",
    description: "You'll be required to identify each video individually.",
    changes: []
  }
]