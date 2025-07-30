"use client";

import { useState } from 'react';
import { useUser } from '@/hooks/api/use-user';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/Avatar';
import { CameraIcon, SaveIcon } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { data: user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
  });

  const [privacy, setPrivacy] = useState({
    showSubscriptions: true,
    showLikedVideos: false,
    showWatchHistory: false,
  });

  const [notifications, setNotifications] = useState({
    comments: true,
    mentions: true,
    subscribers: true,
    videoRecommendations: false,
    emailDigest: 'weekly',
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving profile:', profile);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving privacy settings:', privacy);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving notification settings:', notifications);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={user?.avatarUrl}
                  alt={user?.name || 'User'}
                  size="xl"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors">
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="font-medium mb-1">Profile Picture</h3>
                <p className="text-sm text-gray-400">
                  Click the camera icon to upload a new photo
                </p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your display name"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="@username"
                />
                <p className="text-xs text-gray-400 mt-1">
                  fabl.com/channel/{profile.username || 'username'}
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell viewers about yourself"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Privacy Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Subscriptions</h3>
                  <p className="text-sm text-gray-400">
                    Allow others to see channels you&apos;re subscribed to
                  </p>
                </div>
                <Switch
                  checked={privacy.showSubscriptions}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, showSubscriptions: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Liked Videos</h3>
                  <p className="text-sm text-gray-400">
                    Make your liked videos playlist public
                  </p>
                </div>
                <Switch
                  checked={privacy.showLikedVideos}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, showLikedVideos: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Watch History</h3>
                  <p className="text-sm text-gray-400">
                    Allow your watch history to influence recommendations
                  </p>
                </div>
                <Switch
                  checked={privacy.showWatchHistory}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, showWatchHistory: checked })
                  }
                />
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleSavePrivacy}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Privacy Settings'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-gray-400 uppercase">
                Push Notifications
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Comments</h4>
                  <p className="text-sm text-gray-400">
                    When someone comments on your videos
                  </p>
                </div>
                <Switch
                  checked={notifications.comments}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, comments: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mentions</h4>
                  <p className="text-sm text-gray-400">
                    When someone mentions you in a comment
                  </p>
                </div>
                <Switch
                  checked={notifications.mentions}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, mentions: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New Subscribers</h4>
                  <p className="text-sm text-gray-400">
                    When someone subscribes to your channel
                  </p>
                </div>
                <Switch
                  checked={notifications.subscribers}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, subscribers: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Video Recommendations</h4>
                  <p className="text-sm text-gray-400">
                    Personalized video suggestions
                  </p>
                </div>
                <Switch
                  checked={notifications.videoRecommendations}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, videoRecommendations: checked })
                  }
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <Label htmlFor="email-digest">Email Digest</Label>
              <select
                id="email-digest"
                value={notifications.emailDigest}
                onChange={(e) => 
                  setNotifications({ ...notifications, emailDigest: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 mt-1"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>

            <Button
              variant="primary"
              onClick={handleSaveNotifications}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Notification Settings'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Change Password</h3>
                <Button variant="outline">
                  Update Password
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Connected Accounts</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span>Google</span>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span>Twitter</span>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h3 className="font-medium text-red-500 mb-2">Danger Zone</h3>
                <Button variant="outline" className="text-red-400 border-red-400 hover:bg-red-400/10">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}