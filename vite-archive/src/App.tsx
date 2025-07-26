import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HomePage } from './components/pages/HomePage';
import { TrendingPage } from './components/pages/TrendingPage';
import { SubscriptionsPage } from './components/pages/SubscriptionsPage';
import { WatchLaterPage } from './components/pages/WatchLaterPage';
import { FavoritesPage } from './components/pages/FavoritesPage';
import { CategoryPage } from './components/pages/CategoryPage';
import { VideoPage } from './components/pages/VideoPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { UploadPage } from './components/pages/UploadPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return <BrowserRouter>
      <div className="flex flex-col w-full min-h-screen bg-[#0f0a1e] text-white overflow-hidden relative">
        <AnimatedBackground />
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 relative z-10">
          <Sidebar isOpen={sidebarOpen} />
          <main className="flex-1 overflow-auto pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/watch-later" element={<WatchLaterPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/video/:videoId" element={<VideoPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>;
}