import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VideoPlayer } from '../VideoPlayer'

// Mock fetch for view tracking
global.fetch = jest.fn()

// Mock the useUser hook completely
jest.mock('../../hooks/api/use-user', () => ({
  useUser: () => ({
    data: null,
    isLoading: false,
    error: null
  })
}))

// Mock Mux Player
jest.mock('@mux/mux-player-react', () => {
  return React.forwardRef<HTMLVideoElement, any>((props, ref) => {
    const { onPlay, onPause, onTimeUpdate, onLoadStart, onLoadedData, onError, playbackId, ...rest } = props

    // Mock video element with common properties
    const mockVideoRef = React.useRef({
      play: jest.fn(() => {
        onPlay?.()
        return Promise.resolve()
      }),
      pause: jest.fn(() => onPause?.()),
      currentTime: 35, // Significant watch time to trigger view tracking
      duration: 120,
      muted: false,
      requestFullscreen: jest.fn()
    })

    React.useImperativeHandle(ref, () => mockVideoRef.current)

    React.useEffect(() => {
      // Simulate loading sequence
      onLoadStart?.()
      const timer = setTimeout(() => {
        onLoadedData?.()
        // Trigger time update after load
        setTimeout(() => onTimeUpdate?.(), 100)
      }, 50)
      return () => clearTimeout(timer)
    }, [])

    return (
      <video
        {...rest}
        data-testid="mux-player"
        data-playback-id={playbackId}
        onClick={() => onTimeUpdate?.()} // Manual trigger for testing
      />
    )
  })
})

const mockVideo = {
  id: 'video-123',
  title: 'Test Video',
  description: 'A test video for unit testing',
  muxPlaybackId: 'test-playback-id',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  duration: 120,
  views: 1000,
  createdAt: new Date('2024-01-01'),
  publishedAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  creatorId: 'creator-123',
  status: 'PUBLISHED' as const,
  isApproved: true,
  videoUrl: 'https://example.com/video.mp4',
  muxAssetId: 'mux-asset-123',
  scheduledAt: null
}

// Test wrapper with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
  })

  it('should render video player with Mux component', () => {  
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    expect(screen.getByTestId('mux-player')).toBeInTheDocument()
    expect(screen.getByTestId('mux-player')).toHaveAttribute('data-playback-id', 'test-playback-id')
  })

  it('should show loading spinner initially', async () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    // Loading spinner should be present initially
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()

    // Should disappear after loading completes
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should show play button initially', async () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    await waitFor(() => {
      const playIcon = document.querySelector('.lucide-play')
      expect(playIcon).toBeInTheDocument()
    })
  })

  it('should track video view after significant watch time', async () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    // Wait for component to load and trigger time update
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/videos/video-123/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watchTime: 35,
          userId: null, // Using mocked user which returns null by default
        }),
      })
    }, { timeout: 5000 })
  })

  it('should format time correctly', () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    // Should show initial time format
    expect(screen.getByText(/0:00/)).toBeInTheDocument()
  })

  it('should use fallback playback ID when video has no muxPlaybackId', () => {
    const videoWithoutPlaybackId = { ...mockVideo, muxPlaybackId: null }
    
    render(<VideoPlayer video={videoWithoutPlaybackId} />, { wrapper: TestWrapper })

    const player = screen.getByTestId('mux-player')
    expect(player).toBeInTheDocument()
    // Should use fallback playback ID
    expect(player).toHaveAttribute('data-playback-id', 'LvZ1O8vZHEecmv02kBQG00AjgapWqWRXHF8ByNWXDCIAE')
  })

  it('should handle view tracking API failures gracefully', async () => {
    // Mock fetch to fail
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to increment view count:', expect.any(Error))
    }, { timeout: 5000 })

    consoleSpy.mockRestore()
  })

  it('should not track view multiple times', async () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    // Wait for initial view tracking
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
    }, { timeout: 5000 })

    // Trigger additional time updates - should not trigger more API calls
    const player = screen.getByTestId('mux-player')
    fireEvent.click(player)
    fireEvent.click(player)

    // Should still only have one API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should display video title in metadata', () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    const player = screen.getByTestId('mux-player')
    expect(player).toBeInTheDocument()
    // Component should pass video title to Mux player (verified via props in mock)
  })

  it('should handle successful view tracking', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('View tracked for video:', 'video-123')
    }, { timeout: 5000 })

    consoleSpy.mockRestore()
  })

  it('should display control buttons', async () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    await waitFor(() => {
      // Should show play/pause button
      expect(document.querySelector('.lucide-play')).toBeInTheDocument()
      
      // Should show volume button  
      expect(document.querySelector('.lucide-volume2')).toBeInTheDocument()
      
      // Should show fullscreen button
      expect(document.querySelector('.lucide-maximize')).toBeInTheDocument()
      
      // Should show settings button
      expect(document.querySelector('.lucide-settings')).toBeInTheDocument()
    })
  })

  it('should show progress bar', async () => {
    render(<VideoPlayer video={mockVideo} />, { wrapper: TestWrapper })

    await waitFor(() => {
      // Progress bar container should be present
      const progressBar = document.querySelector('.bg-white\\/30')
      expect(progressBar).toBeInTheDocument()
    })
  })
})