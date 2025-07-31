"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchIndexingService = void 0;
class SearchIndexingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Extract search terms from video content
    extractSearchTerms(title, description) {
        const text = `${title} ${description || ''}`.toLowerCase();
        // Remove punctuation and split into words
        const words = text
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2) // Filter out short words
            .filter(word => !this.isStopWord(word));
        // Remove duplicates
        return [...new Set(words)];
    }
    // Common stop words to filter out
    isStopWord(word) {
        const stopWords = new Set([
            'the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was',
            'with', 'for', 'an', 'be', 'have', 'it', 'in', 'you', 'of', 'we', 'if',
            'this', 'that', 'but', 'by', 'from', 'up', 'about', 'into', 'over', 'after'
        ]);
        return stopWords.has(word);
    }
    // Generate search suggestions based on popular search patterns
    generateSearchSuggestions(searchTerms) {
        const suggestions = [];
        // Add common patterns
        searchTerms.forEach(term => {
            if (term.length > 3) {
                suggestions.push(`${term} tutorial`);
                suggestions.push(`how to ${term}`);
                suggestions.push(`${term} guide`);
                suggestions.push(`best ${term}`);
            }
        });
        return suggestions;
    }
    // Build search index for a single video
    async indexVideo(videoId) {
        try {
            const video = await this.prisma.video.findUnique({
                where: { id: videoId },
                include: {
                    creator: {
                        select: {
                            name: true,
                            username: true
                        }
                    }
                }
            });
            if (!video || video.status !== 'PUBLISHED' || !video.isApproved) {
                return null;
            }
            const searchTerms = this.extractSearchTerms(video.title, video.description);
            const tags = this.extractTags(video.description);
            const category = this.inferCategory(video.title, video.description);
            return {
                id: video.id,
                title: video.title,
                description: video.description,
                searchTerms,
                tags,
                category,
                creatorName: video.creator.name,
                views: video.views,
                createdAt: video.createdAt,
                publishedAt: video.publishedAt
            };
        }
        catch (error) {
            console.error(`Failed to index video ${videoId}:`, error);
            return null;
        }
    }
    // Extract hashtags and categories from description
    extractTags(description) {
        if (!description)
            return [];
        const hashtags = description.match(/#\w+/g) || [];
        return hashtags.map(tag => tag.slice(1).toLowerCase());
    }
    // Infer category from title and description
    inferCategory(title, description) {
        const content = `${title} ${description || ''}`.toLowerCase();
        const categories = {
            'tutorial': ['tutorial', 'how to', 'guide', 'learn', 'course'],
            'music': ['music', 'song', 'beat', 'melody', 'audio'],
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'neural', 'algorithm'],
            'art': ['art', 'design', 'creative', 'visual', 'drawing'],
            'tech': ['tech', 'technology', 'coding', 'programming', 'software'],
            'gaming': ['game', 'gaming', 'play', 'gameplay', 'stream'],
            'entertainment': ['entertainment', 'comedy', 'funny', 'meme', 'story']
        };
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => content.includes(keyword))) {
                return category;
            }
        }
        return null;
    }
    // Rebuild search index for all videos
    async rebuildSearchIndex() {
        let indexed = 0;
        let errors = 0;
        try {
            // Get all published and approved videos
            const videos = await this.prisma.video.findMany({
                where: {
                    status: 'PUBLISHED',
                    isApproved: true
                },
                select: { id: true }
            });
            console.log(`Rebuilding search index for ${videos.length} videos...`);
            // Process videos in batches to avoid memory issues
            const batchSize = 100;
            for (let i = 0; i < videos.length; i += batchSize) {
                const batch = videos.slice(i, i + batchSize);
                const indexPromises = batch.map(async (video) => {
                    try {
                        const indexData = await this.indexVideo(video.id);
                        if (indexData) {
                            indexed++;
                            return indexData;
                        }
                    }
                    catch (error) {
                        console.error(`Failed to index video ${video.id}:`, error);
                        errors++;
                    }
                });
                await Promise.all(indexPromises);
                // Log progress
                if (i % (batchSize * 5) === 0) {
                    console.log(`Search indexing progress: ${i + batch.length}/${videos.length} videos processed`);
                }
            }
            console.log(`Search index rebuild complete. Indexed: ${indexed}, Errors: ${errors}`);
            return { indexed, errors };
        }
        catch (error) {
            console.error('Failed to rebuild search index:', error);
            throw error;
        }
    }
    // Enhanced search with fuzzy matching and relevance scoring
    async searchVideos(query, options = {}) {
        const { limit = 20, offset = 0, category, sortBy = 'relevance' } = options;
        if (!query.trim()) {
            return { videos: [], total: 0, suggestions: [] };
        }
        const searchTerms = this.extractSearchTerms(query);
        const searchQuery = query.toLowerCase();
        try {
            // Build search conditions
            const searchConditions = {
                AND: [
                    { status: 'PUBLISHED' },
                    { isApproved: true },
                    {
                        OR: [
                            // Exact title match (highest priority)
                            { title: { contains: query, mode: 'insensitive' } },
                            // Description match
                            { description: { contains: query, mode: 'insensitive' } },
                            // Creator name match
                            { creator: { name: { contains: query, mode: 'insensitive' } } },
                            // Fuzzy search for individual terms
                            ...searchTerms.map(term => ({
                                OR: [
                                    { title: { contains: term, mode: 'insensitive' } },
                                    { description: { contains: term, mode: 'insensitive' } }
                                ]
                            }))
                        ]
                    }
                ]
            };
            // Add category filter if specified
            if (category) {
                // Note: This would require storing category in the video model
                // For now, we'll do a simple keyword-based filter
                searchConditions.AND.push({
                    OR: [
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                });
            }
            // Determine sort order
            let orderBy = { publishedAt: 'desc' }; // Default to recent
            if (sortBy === 'views') {
                orderBy = { views: 'desc' };
            }
            else if (sortBy === 'relevance') {
                // For relevance, we'll use views as a proxy since Prisma doesn't support full-text scoring
                orderBy = [{ views: 'desc' }, { publishedAt: 'desc' }];
            }
            // Execute search
            const [videos, total] = await Promise.all([
                this.prisma.video.findMany({
                    where: searchConditions,
                    include: {
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                avatarUrl: true
                            }
                        }
                    },
                    orderBy,
                    skip: offset,
                    take: limit
                }),
                this.prisma.video.count({
                    where: searchConditions
                })
            ]);
            // Generate search suggestions
            const suggestions = this.generateSearchSuggestions([query, ...searchTerms])
                .slice(0, 6);
            return {
                videos,
                total,
                suggestions
            };
        }
        catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    }
    // Get trending search terms based on video titles and descriptions
    async getTrendingSearchTerms(limit = 10) {
        try {
            // Get recent popular videos (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentPopularVideos = await this.prisma.video.findMany({
                where: {
                    status: 'PUBLISHED',
                    isApproved: true,
                    publishedAt: { gte: thirtyDaysAgo },
                    views: { gte: 100 } // Minimum view threshold
                },
                select: {
                    title: true,
                    description: true,
                    views: true
                },
                orderBy: { views: 'desc' },
                take: 100
            });
            // Extract and weight search terms by video popularity
            const termWeights = new Map();
            recentPopularVideos.forEach(video => {
                const terms = this.extractSearchTerms(video.title, video.description);
                const weight = Math.log(video.views + 1); // Logarithmic weighting to prevent extreme outliers
                terms.forEach(term => {
                    termWeights.set(term, (termWeights.get(term) || 0) + weight);
                });
            });
            // Sort by weight and return top terms
            return Array.from(termWeights.entries())
                .sort(([, a], [, b]) => b - a)
                .slice(0, limit)
                .map(([term]) => term);
        }
        catch (error) {
            console.error('Failed to get trending search terms:', error);
            return [];
        }
    }
}
exports.SearchIndexingService = SearchIndexingService;
