import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, TrendingUpIcon, BookmarkIcon, ClockIcon, HeartIcon, ZapIcon, SparklesIcon, BrainIcon, CameraIcon, MusicIcon, PaletteIcon } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
}
export function Sidebar({
  isOpen
}: SidebarProps) {
  const location = useLocation();
  const navigationItems = [{
    icon: <HomeIcon />,
    label: 'Home',
    path: '/'
  }, {
    icon: <TrendingUpIcon />,
    label: 'Trending',
    path: '/trending'
  }, {
    icon: <BookmarkIcon />,
    label: 'Subscriptions',
    path: '/subscriptions'
  }, {
    icon: <ClockIcon />,
    label: 'Watch Later',
    path: '/watch-later'
  }, {
    icon: <HeartIcon />,
    label: 'Favorites',
    path: '/favorites'
  }];
  const categoryItems = [{
    icon: <ZapIcon className="text-yellow-400" />,
    label: 'AI Cinematics',
    path: '/category/ai-cinematics'
  }, {
    icon: <SparklesIcon className="text-purple-400" />,
    label: 'Neural Dreams',
    path: '/category/neural-dreams'
  }, {
    icon: <BrainIcon className="text-blue-400" />,
    label: 'Synthetic Stories',
    path: '/category/synthetic-stories'
  }, {
    icon: <CameraIcon className="text-green-400" />,
    label: 'Visual Wonders',
    path: '/category/visual-wonders'
  }, {
    icon: <MusicIcon className="text-pink-400" />,
    label: 'AI Music',
    path: '/category/ai-music'
  }, {
    icon: <PaletteIcon className="text-orange-400" />,
    label: 'Digital Art',
    path: '/category/digital-art'
  }, {
    icon: <div className="text-teal-400" />,
    label: 'Robot Creations',
    path: '/category/robot-creations'
  }];
  return <aside className={`
        ${isOpen ? 'w-56' : 'w-20'} 
        transition-all duration-300 ease-in-out 
        bg-[#120c24]/80 backdrop-blur-md 
        border-r border-purple-500/20
        overflow-hidden
        h-[calc(100vh-64px)]
        sticky top-[64px]
        z-10
      `}>
      <div className="py-4">
        <div className="px-4 mb-6">
          <h3 className={`text-sm font-medium text-gray-400 ${!isOpen && 'text-center'}`}>
            {isOpen ? 'Navigation' : '•••'}
          </h3>
        </div>
        {navigationItems.map(item => <NavItem key={item.path} icon={item.icon} label={item.label} path={item.path} isOpen={isOpen} active={location.pathname === item.path} />)}
        <div className="mt-8 px-4 mb-2">
          <h3 className={`text-sm font-medium text-gray-400 ${!isOpen && 'text-center'}`}>
            {isOpen ? 'AI Categories' : '•••'}
          </h3>
        </div>
        {categoryItems.map(item => <NavItem key={item.path} icon={item.icon} label={item.label} path={item.path} isOpen={isOpen} active={location.pathname === item.path} />)}
      </div>
    </aside>;
}
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isOpen: boolean;
  active?: boolean;
}
function NavItem({
  icon,
  label,
  path,
  isOpen,
  active
}: NavItemProps) {
  return <Link to={path} className={`
        flex items-center px-4 py-3 
        ${active ? 'bg-purple-500/20 border-l-4 border-purple-500' : 'hover:bg-purple-500/10 border-l-4 border-transparent'} 
        cursor-pointer
        transition-all
        ${!isOpen && 'justify-center'}
      `}>
      <div className={`${active ? 'text-purple-400' : 'text-gray-300'} ${!isOpen && 'mx-auto'}`}>
        {icon}
      </div>
      {isOpen && <span className="ml-3 text-sm">{label}</span>}
    </Link>;
}