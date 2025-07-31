import { SearchIndexingService } from '../../src/services/search-indexing'
import { mockPrisma, createMockVideo, createMockUser } from '../setup'

describe('SearchIndexingService', () => {
  let searchService: SearchIndexingService

  beforeEach(() => {
    searchService = new SearchIndexingService(mockPrisma)
  })

  describe('searchVideos', () => {
    it('should return relevant results for valid queries', async () => {
      const mockVideos = [
        createMockVideo({ 
          id: 'video-1', 
          title: 'AI Tutorial for Beginners', 
          views: 1000,
          creator: createMockUser({ name: 'Tech Teacher' })
        }),
        createMockVideo({ 
          id: 'video-2', 
          title: 'Machine Learning Basics', 
          views: 500,
          creator: createMockUser({ name: 'ML Expert' })
        })
      ]

      // Mock the raw SQL query for relevance search
      mockPrisma.$queryRaw.mockResolvedValueOnce(mockVideos.map(video => ({
        ...video,
        rank: video.title.toLowerCase().includes('ai') ? 2.5 : 1.5
      })))

      // Mock the count query
      mockPrisma.$queryRaw.mockResolvedValueOnce([{ count: BigInt(2) }])

      // Mock creator lookup
      mockPrisma.user.findMany.mockResolvedValueOnce([
        createMockUser({ id: 'user-1', name: 'Tech Teacher' }),
        createMockUser({ id: 'user-2', name: 'ML Expert' })
      ])

      const result = await searchService.searchVideos('AI tutorial', {
        sortBy: 'relevance',
        limit: 10
      })

      expect(result.videos).toHaveLength(2)
      expect(result.videos[0]).toHaveProperty('title', 'AI Tutorial for Beginners')
      expect(result.videos[0]).toHaveProperty('creator')
      expect(result.total).toBe(2)
      expect(result.suggestions).toBeInstanceOf(Array)
    })

    it('should handle empty queries gracefully', async () => {
      const result = await searchService.searchVideos('')

      expect(result.videos).toEqual([])
      expect(result.total).toBe(0)
      expect(result.suggestions).toEqual([])
      expect(mockPrisma.$queryRaw).not.toHaveBeenCalled()
    })

    it('should handle queries with no results', async () => {
      mockPrisma.$queryRaw.mockResolvedValueOnce([])
      mockPrisma.$queryRaw.mockResolvedValueOnce([{ count: BigInt(0) }])
      mockPrisma.user.findMany.mockResolvedValueOnce([])

      const result = await searchService.searchVideos('nonexistent query', {
        sortBy: 'relevance'
      })

      expect(result.videos).toEqual([])
      expect(result.total).toBe(0)
      expect(result.suggestions).toBeInstanceOf(Array)
    })

    it('should apply category filtering correctly', async () => {
      const mockVideos = [
        createMockVideo({ 
          title: 'Machine Learning Tutorial', 
          description: 'Learn artificial intelligence and neural networks',
          creator: createMockUser({ name: 'AI Expert' })
        }),
        createMockVideo({ 
          title: 'Cooking Tutorial', 
          description: 'Learn to cook delicious meals',
          creator: createMockUser({ name: 'Chef' })
        })
      ]

      // Mock the relevance search query 
      mockPrisma.$queryRaw.mockResolvedValueOnce(mockVideos.map(video => ({
        ...video,
        rank: 2.0
      })))
      mockPrisma.$queryRaw.mockResolvedValueOnce([{ count: BigInt(2) }])
      mockPrisma.user.findMany.mockResolvedValueOnce([
        createMockUser({ name: 'AI Expert' }),
        createMockUser({ name: 'Chef' })
      ])

      const result = await searchService.searchVideos('tutorial', {
        category: 'ai',
        sortBy: 'relevance'
      })

      // Should filter to only AI-related content
      expect(result.videos).toHaveLength(1)
      expect(result.videos[0].title).toContain('Machine Learning')
    })

    it('should handle database errors gracefully', async () => {
      mockPrisma.$queryRaw.mockRejectedValueOnce(new Error('Database connection failed'))

      await expect(
        searchService.searchVideos('test query', { sortBy: 'relevance' })
      ).rejects.toThrow('Database connection failed')
    })
  })

  describe('extractSearchTerms', () => {
    it('should extract meaningful search terms', () => {
      // Access private method for testing
      const extractSearchTerms = (searchService as any).extractSearchTerms.bind(searchService)
      
      const terms = extractSearchTerms('JavaScript Tutorial for Beginners', 'Learn JS basics')
      
      expect(terms).toContain('javascript')
      expect(terms).toContain('tutorial')
      expect(terms).toContain('beginners')
      expect(terms).toContain('learn')
      expect(terms).toContain('basics')
      
      // Should not contain stop words
      expect(terms).not.toContain('for')
      expect(terms).not.toContain('the')
    })

    it('should handle null description', () => {
      const extractSearchTerms = (searchService as any).extractSearchTerms.bind(searchService)
      
      const terms = extractSearchTerms('JavaScript Tutorial', null)
      
      expect(terms).toContain('javascript')
      expect(terms).toContain('tutorial')
      expect(terms).toHaveLength(2)
    })

    it('should remove duplicates', () => {
      const extractSearchTerms = (searchService as any).extractSearchTerms.bind(searchService)
      
      const terms = extractSearchTerms('Tutorial Tutorial', 'Tutorial basics')
      
      expect(terms.filter((term: string) => term === 'tutorial')).toHaveLength(1)
    })
  })

  describe('inferCategory', () => {
    it('should correctly infer AI category', () => {
      const inferCategory = (searchService as any).inferCategory.bind(searchService)
      
      const category = inferCategory('Machine Learning Tutorial', 'Learn AI and neural networks')
      
      expect(category).toBe('ai')
    })

    it('should correctly infer tutorial category', () => {
      const inferCategory = (searchService as any).inferCategory.bind(searchService)
      
      const category = inferCategory('How to Code', 'Complete guide for beginners')
      
      expect(category).toBe('tutorial')
    })

    it('should return null for unclear content', () => {
      const inferCategory = (searchService as any).inferCategory.bind(searchService)
      
      const category = inferCategory('Random Video', 'Some random content')
      
      expect(category).toBeNull()
    })

    it('should score categories and return highest match', () => {
      const inferCategory = (searchService as any).inferCategory.bind(searchService)
      
      const category = inferCategory(
        'Machine Learning AI Guide', 
        'Learn artificial intelligence neural networks deep learning'
      )
      
      // Should prioritize 'ai' over 'tutorial' due to multiple AI-related terms
      expect(category).toBe('ai')
    })
  })

  describe('rebuildSearchIndex', () => {
    it('should process videos in batches with progress tracking', async () => {
      const mockVideos = [
        createMockVideo({ id: 'video-1' }),
        createMockVideo({ id: 'video-2' }),
        createMockVideo({ id: 'video-3' })
      ]

      mockPrisma.video.count.mockResolvedValueOnce(3)
      mockPrisma.video.findMany
        .mockResolvedValueOnce([mockVideos[0], mockVideos[1]])
        .mockResolvedValueOnce([mockVideos[2]])
        .mockResolvedValueOnce([])

      // Mock indexVideo calls
      jest.spyOn(searchService, 'indexVideo')
        .mockResolvedValue(createMockVideo())

      const result = await searchService.rebuildSearchIndex({
        batchSize: 2,
        delayMs: 0
      })

      expect(result.indexed).toBe(3)
      expect(result.errors).toBe(0)
      expect(result.totalProcessed).toBe(3)
      expect(result.progressId).toBeDefined()
      expect(searchService.indexVideo).toHaveBeenCalledTimes(3)
    })

    it('should handle indexing errors gracefully', async () => {
      mockPrisma.video.count.mockResolvedValueOnce(2)
      mockPrisma.video.findMany
        .mockResolvedValueOnce([createMockVideo({ id: 'video-1' }), createMockVideo({ id: 'video-2' })])
        .mockResolvedValueOnce([])

      jest.spyOn(searchService, 'indexVideo')
        .mockResolvedValueOnce(createMockVideo())
        .mockRejectedValueOnce(new Error('Indexing failed'))

      const mockLogger = {
        info: jest.fn(),
        error: jest.fn()
      }

      const result = await searchService.rebuildSearchIndex({
        batchSize: 2,
        delayMs: 0,
        logger: mockLogger
      })

      expect(result.indexed).toBe(1)
      expect(result.errors).toBe(1)
      expect(result.totalProcessed).toBe(2)
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to index video video-2',
        expect.any(Error)
      )
    })

    it('should throw error if initial database query fails', async () => {
      mockPrisma.video.count.mockRejectedValueOnce(new Error('Database error'))

      await expect(
        searchService.rebuildSearchIndex()
      ).rejects.toThrow('Search index rebuild failed after processing 0 videos')
    })
  })

  describe('getTrendingSearchTerms', () => {
    it('should return trending terms from popular videos', async () => {
      const mockVideos = [
        createMockVideo({ title: 'AI Tutorial', views: 1000 }),
        createMockVideo({ title: 'Machine Learning Guide', views: 800 }),
        createMockVideo({ title: 'JavaScript Basics', views: 600 })
      ]

      mockPrisma.video.findMany.mockResolvedValueOnce(mockVideos)

      const trendingTerms = await searchService.getTrendingSearchTerms(5)

      expect(trendingTerms).toBeInstanceOf(Array)
      expect(trendingTerms.length).toBeLessThanOrEqual(5)
      expect(trendingTerms).toContain('tutorial')
    })

    it('should handle empty result set', async () => {
      mockPrisma.video.findMany.mockResolvedValueOnce([])

      const trendingTerms = await searchService.getTrendingSearchTerms(5)

      expect(trendingTerms).toEqual([])
    })

    it('should handle database errors', async () => {
      mockPrisma.video.findMany.mockRejectedValueOnce(new Error('Database error'))

      const trendingTerms = await searchService.getTrendingSearchTerms(5)

      expect(trendingTerms).toEqual([])
    })
  })
})