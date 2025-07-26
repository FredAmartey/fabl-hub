import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, ThumbsUpIcon, MessageCircleIcon, UserPlusIcon, PlayIcon, VideoIcon, SettingsIcon, TrashIcon, CheckIcon } from 'lucide-react';
import { Button } from '../Button';
export function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const notifications = [{
    id: 1,
    type: 'like',
    user: {
      name: 'Maya Rivera',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces',
      id: 'mayarivera'
    },
    content: 'liked your video',
    video: {
      id: 101,
      title: 'Creating Digital Art with Neural Style Transfer',
      thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop'
    },
    timestamp: '2 hours ago',
    read: false
  }, {
    id: 2,
    type: 'comment',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&auto=format&fit=crop&crop=faces',
      id: 'alexjohnson'
    },
    content: 'commented on your video',
    comment: 'This is absolutely mind-blowing! The AI has captured the essence perfectly.',
    video: {
      id: 101,
      title: 'Creating Digital Art with Neural Style Transfer',
      thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop'
    },
    timestamp: '5 hours ago',
    read: false
  }, {
    id: 3,
    type: 'subscribe',
    user: {
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop&crop=faces',
      id: 'sophiachen'
    },
    content: 'subscribed to your channel',
    timestamp: '1 day ago',
    read: true
  }, {
    id: 4,
    type: 'mention',
    user: {
      name: 'Neural Films',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&auto=format&fit=crop&crop=faces',
      id: 'neuralfilms'
    },
    content: 'mentioned you in a comment',
    comment: "Check out @alexneural's channel for more amazing AI art tutorials!",
    video: {
      id: 7,
      title: 'AI Cinematics: The Silent Observer',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop'
    },
    timestamp: '2 days ago',
    read: true
  }, {
    id: 5,
    type: 'upload',
    user: {
      name: 'StoryForge AI',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces',
      id: 'storyforge'
    },
    content: 'uploaded a new video',
    video: {
      id: 201,
      title: 'The Quantum Dreamer: AI-Generated Sci-Fi Short',
      thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop'
    },
    timestamp: '3 days ago',
    read: true
  }];
  const filteredNotifications = filter === 'all' ? notifications : notifications.filter(notification => notification.type === filter);
  const toggleSelectNotification = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };
  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };
  const markSelectedAsRead = () => {
    // In a real app, this would update the read status in the database
    alert(`Marked ${selectedNotifications.length} notifications as read`);
    setSelectedNotifications([]);
    setSelectMode(false);
  };
  const deleteSelected = () => {
    // In a real app, this would delete the notifications from the database
    alert(`Deleted ${selectedNotifications.length} notifications`);
    setSelectedNotifications([]);
    setSelectMode(false);
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUpIcon className="w-5 h-5 text-red-400" />;
      case 'comment':
        return <MessageCircleIcon className="w-5 h-5 text-blue-400" />;
      case 'subscribe':
        return <UserPlusIcon className="w-5 h-5 text-green-400" />;
      case 'mention':
        return <MessageCircleIcon className="w-5 h-5 text-purple-400" />;
      case 'upload':
        return <VideoIcon className="w-5 h-5 text-yellow-400" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-400" />;
    }
  };
  return <div className="px-6 pt-6 pb-12 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <BellIcon className="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
              Notifications
            </h1>
            <p className="text-gray-400 mt-1">
              Stay updated with the latest activity
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSelectMode(!selectMode)}>
          {selectMode ? 'Cancel' : 'Manage'}
        </Button>
      </div>
      {/* Filters */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        <button className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : 'bg-[#1a1230] hover:bg-purple-500/30 text-gray-300'}`} onClick={() => setFilter('all')}>
          All
        </button>
        <button className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center ${filter === 'like' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : 'bg-[#1a1230] hover:bg-purple-500/30 text-gray-300'}`} onClick={() => setFilter('like')}>
          <ThumbsUpIcon className="w-3 h-3 mr-1" /> Likes
        </button>
        <button className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center ${filter === 'comment' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : 'bg-[#1a1230] hover:bg-purple-500/30 text-gray-300'}`} onClick={() => setFilter('comment')}>
          <MessageCircleIcon className="w-3 h-3 mr-1" /> Comments
        </button>
        <button className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center ${filter === 'subscribe' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : 'bg-[#1a1230] hover:bg-purple-500/30 text-gray-300'}`} onClick={() => setFilter('subscribe')}>
          <UserPlusIcon className="w-3 h-3 mr-1" /> Subscriptions
        </button>
        <button className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center ${filter === 'mention' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : 'bg-[#1a1230] hover:bg-purple-500/30 text-gray-300'}`} onClick={() => setFilter('mention')}>
          <MessageCircleIcon className="w-3 h-3 mr-1" /> Mentions
        </button>
        <button className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center ${filter === 'upload' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : 'bg-[#1a1230] hover:bg-purple-500/30 text-gray-300'}`} onClick={() => setFilter('upload')}>
          <VideoIcon className="w-3 h-3 mr-1" /> Uploads
        </button>
      </div>
      {/* Selection Controls */}
      {selectMode && <div className="flex items-center justify-between mb-4 p-3 bg-[#1a1230] rounded-lg">
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 rounded bg-[#241a38] border-purple-500/50 text-purple-500 focus:ring-purple-500/30 mr-2" checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0} onChange={toggleSelectAll} />
            <span className="text-sm font-medium">
              {selectedNotifications.length} selected
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={markSelectedAsRead} disabled={selectedNotifications.length === 0}>
              <CheckIcon className="w-4 h-4 mr-1" />
              Mark as read
            </Button>
            <Button variant="ghost" size="sm" onClick={deleteSelected} disabled={selectedNotifications.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>}
      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? filteredNotifications.map(notification => <div key={notification.id} className={`
                flex items-start p-4 rounded-xl transition-all
                ${notification.read ? 'bg-[#1a1230]' : 'bg-[#241a38] border-l-4 border-purple-500'}
                ${selectMode ? 'cursor-pointer hover:bg-[#2a1f45]' : ''}
              `} onClick={() => selectMode && toggleSelectNotification(notification.id)}>
              {selectMode && <div className="mr-3 mt-1">
                  <input type="checkbox" className="w-4 h-4 rounded bg-[#241a38] border-purple-500/50 text-purple-500 focus:ring-purple-500/30" checked={selectedNotifications.includes(notification.id)} onChange={() => toggleSelectNotification(notification.id)} onClick={e => e.stopPropagation()} />
                </div>}
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <Link to={`/channel/${notification.user.id}`}>
                  <img src={notification.user.avatar} alt={notification.user.name} className="w-full h-full object-cover" />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">
                      <Link to={`/channel/${notification.user.id}`} className="hover:text-purple-400 transition-colors">
                        {notification.user.name}
                      </Link>{' '}
                      <span className="text-gray-400">
                        {notification.content}
                      </span>
                    </div>
                    {notification.comment && <div className="mt-1 text-sm text-gray-300 bg-[#0f0a1e] p-2 rounded">
                        "{notification.comment}"
                      </div>}
                    {notification.video && <Link to={`/video/${notification.video.id}`} className="mt-2 flex items-start hover:bg-[#0f0a1e] p-1 rounded transition-colors">
                        <div className="w-16 h-9 rounded overflow-hidden flex-shrink-0 mr-2 relative">
                          <img src={notification.video.thumbnail} alt={notification.video.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                            <PlayIcon className="w-4 h-4" />
                          </div>
                        </div>
                        <span className="text-sm text-gray-300 line-clamp-1">
                          {notification.video.title}
                        </span>
                      </Link>}
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {notification.timestamp}
                    </span>
                    <div className="ml-2">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                </div>
              </div>
            </div>) : <div className="text-center py-16 bg-[#1a1230] rounded-xl">
            <BellIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">No notifications</h2>
            <p className="text-gray-400 mb-6">
              You don't have any {filter !== 'all' ? filter : ''} notifications
              yet
            </p>
            {filter !== 'all' && <Button variant="primary" onClick={() => setFilter('all')}>
                View All Notifications
              </Button>}
          </div>}
      </div>
      {/* Settings Link */}
      <div className="mt-6 text-center">
        <Link to="/settings/notifications" className="inline-flex items-center text-sm text-gray-400 hover:text-purple-400 transition-colors">
          <SettingsIcon className="w-4 h-4 mr-1" />
          Notification Settings
        </Link>
      </div>
    </div>;
}