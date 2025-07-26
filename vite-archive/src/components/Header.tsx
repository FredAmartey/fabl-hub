import React, { useEffect, useState, useRef, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, SearchIcon, BellIcon, UserIcon, UploadIcon, SparklesIcon, LogOutIcon, SettingsIcon, HelpCircleIcon, ThumbsUpIcon, MessageCircleIcon, UserPlusIcon, PlayIcon, ChevronRightIcon, VideoIcon } from 'lucide-react';
import { Button } from './Button';
interface HeaderProps {
  onMenuClick: () => void;
}
export function Header({
  onMenuClick
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchFocused(false);
    }
  };
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Sample notifications for the dropdown
  const recentNotifications = [{
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
  }];
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUpIcon className="w-4 h-4 text-red-400" />;
      case 'comment':
        return <MessageCircleIcon className="w-4 h-4 text-blue-400" />;
      case 'subscribe':
        return <UserPlusIcon className="w-4 h-4 text-green-400" />;
      case 'mention':
        return <MessageCircleIcon className="w-4 h-4 text-purple-400" />;
      case 'upload':
        return <VideoIcon className="w-4 h-4 text-yellow-400" />;
      default:
        return <BellIcon className="w-4 h-4 text-gray-400" />;
    }
  };
  return <header className="sticky top-0 z-20 w-full bg-[#0f0a1e]/80 backdrop-blur-md border-b border-purple-500/20 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-purple-500/20 transition-colors">
            <MenuIcon className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
              fabl<span className="text-white">.tv</span>
            </span>
            <SparklesIcon className="w-5 h-5 ml-1 text-purple-400 animate-pulse" />
          </Link>
        </div>
        <form onSubmit={handleSearch} className={`flex-1 max-w-2xl mx-4 relative ${searchFocused ? 'scale-105' : ''} transition-transform duration-300`}>
          <div className="relative">
            <input type="text" placeholder="Search for magical content..." className="w-full bg-[#1a1230] border border-purple-500/30 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors">
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
          {searchFocused && <div className="absolute top-full mt-2 w-full bg-[#1a1230] rounded-xl border border-purple-500/30 p-2 shadow-lg shadow-purple-500/20">
              <div className="text-sm text-gray-400 px-3 py-1">
                Try searching for:
              </div>
              <div className="hover:bg-purple-500/20 px-3 py-2 rounded-lg cursor-pointer transition-colors" onClick={() => {
            setSearchQuery('AI Generated Music Videos');
            navigate('/search?q=AI%20Generated%20Music%20Videos');
            setSearchFocused(false);
          }}>
                AI Generated Music Videos
              </div>
              <div className="hover:bg-purple-500/20 px-3 py-2 rounded-lg cursor-pointer transition-colors" onClick={() => {
            setSearchQuery('Synthetic Storytelling');
            navigate('/search?q=Synthetic%20Storytelling');
            setSearchFocused(false);
          }}>
                Synthetic Storytelling
              </div>
              <div className="hover:bg-purple-500/20 px-3 py-2 rounded-lg cursor-pointer transition-colors" onClick={() => {
            setSearchQuery('Neural Dreams Art');
            navigate('/search?q=Neural%20Dreams%20Art');
            setSearchFocused(false);
          }}>
                Neural Dreams Art
              </div>
            </div>}
        </form>
        <div className="flex items-center gap-2">
          <Link to="/upload">
            <Button variant="ghost" size="icon">
              <UploadIcon className="w-5 h-5" />
            </Button>
          </Link>
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <Button variant="ghost" size="icon" onClick={() => {
            setNotificationsOpen(!notificationsOpen);
            setProfileOpen(false);
          }} className="relative">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            {notificationsOpen && <div className="absolute right-0 mt-2 w-80 bg-[#1a1230] border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20 overflow-hidden z-30">
                <div className="flex items-center justify-between p-3 border-b border-purple-500/20">
                  <h3 className="font-medium">Notifications</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recentNotifications.map(notification => <div key={notification.id} className={`
                        p-3 hover:bg-purple-500/10 transition-colors cursor-pointer
                        ${notification.read ? '' : 'bg-[#241a38]'}
                        border-b border-purple-500/10
                      `} onClick={() => {
                setNotificationsOpen(false);
                if (notification.video) {
                  navigate(`/video/${notification.video.id}`);
                }
              }}>
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          <img src={notification.user.avatar} alt={notification.user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="w-full pr-2">
                              <div className="text-sm">
                                <span className="font-medium">
                                  {notification.user.name}
                                </span>{' '}
                                <span className="text-gray-400">
                                  {notification.content}
                                </span>
                              </div>
                              {notification.video && <div className="mt-1 flex items-center text-xs text-gray-300">
                                  <PlayIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {notification.video.title}
                                  </span>
                                </div>}
                              <div className="text-xs text-gray-500 mt-1">
                                {notification.timestamp}
                              </div>
                            </div>
                            <div className="ml-1 flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                <Link to="/notifications" className="block p-3 text-center text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-colors border-t border-purple-500/20" onClick={() => setNotificationsOpen(false)}>
                  <div className="flex items-center justify-center">
                    See all notifications
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>}
          </div>
          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => {
            setProfileOpen(!profileOpen);
            setNotificationsOpen(false);
          }} className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <UserIcon className="w-5 h-5 text-white" />
            </button>
            {profileOpen && <div className="absolute right-0 mt-2 w-56 bg-[#1a1230] border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20 overflow-hidden z-30">
                <div className="p-4 border-b border-purple-500/20">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-purple-500 to-blue-400">
                      <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&auto=format&fit=crop&crop=faces" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">Alex Neural</div>
                      <div className="text-xs text-gray-400">@alexneural</div>
                    </div>
                  </div>
                  <Link to="/profile" className="mt-3 block w-full py-1.5 text-center text-sm bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors" onClick={() => setProfileOpen(false)}>
                    View Profile
                  </Link>
                </div>
                <div className="py-1">
                  <Link to="/upload" className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors" onClick={() => setProfileOpen(false)}>
                    <UploadIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Upload Video
                  </Link>
                  <Link to="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors" onClick={() => setProfileOpen(false)}>
                    <SettingsIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Settings
                  </Link>
                  <Link to="/help" className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors" onClick={() => setProfileOpen(false)}>
                    <HelpCircleIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Help & Support
                  </Link>
                </div>
                <div className="border-t border-purple-500/20 py-1">
                  <button className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors w-full text-left" onClick={() => {
                setProfileOpen(false);
                // Handle logout logic here
              }}>
                    <LogOutIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Sign Out
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </header>;
}