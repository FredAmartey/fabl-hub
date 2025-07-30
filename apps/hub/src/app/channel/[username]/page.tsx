import { notFound } from 'next/navigation';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelTabs } from '@/components/ChannelTabs';
import { VideoGrid } from '@/components/VideoGrid';
import { getChannelByUsername, getChannelVideos } from '@/lib/api/channels';

interface ChannelPageProps {
  params: {
    username: string;
  };
  searchParams: {
    tab?: string;
  };
}

export default async function ChannelPage({ params, searchParams }: ChannelPageProps) {
  const channel = await getChannelByUsername(params.username);
  
  if (!channel) {
    notFound();
  }

  const currentTab = searchParams.tab || 'videos';
  
  // Get content based on current tab
  let content;
  switch (currentTab) {
    case 'videos':
      const videos = await getChannelVideos(channel.id);
      content = <VideoGrid videos={videos} />;
      break;
    case 'playlists':
      content = (
        <div className="text-center py-12 text-gray-400">
          <p>No playlists yet</p>
        </div>
      );
      break;
    case 'about':
      content = (
        <div className="max-w-4xl">
          <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 whitespace-pre-wrap">
                {channel.description || 'No description provided'}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Joined</p>
                  <p className="font-medium">
                    {new Date(channel.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total views</p>
                  <p className="font-medium">{channel.totalViews?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Videos</p>
                  <p className="font-medium">{channel.videoCount || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="font-medium">{channel.location || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {channel.links && channel.links.length > 0 && (
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Links</h3>
                <div className="space-y-2">
                  {channel.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 block"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
      break;
    default:
      content = <VideoGrid videos={[]} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ChannelHeader channel={channel} />
      <ChannelTabs currentTab={currentTab} username={params.username} />
      <div className="mt-6">
        {content}
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ChannelPageProps) {
  const channel = await getChannelByUsername(params.username);
  
  if (!channel) {
    return {
      title: 'Channel Not Found - Fabl',
    };
  }
  
  return {
    title: `${channel.name} - Fabl`,
    description: channel.description || `Watch videos from ${channel.name} on Fabl`,
    openGraph: {
      title: channel.name,
      description: channel.description || `Watch videos from ${channel.name} on Fabl`,
      images: [channel.avatarUrl || ''],
    },
  };
}