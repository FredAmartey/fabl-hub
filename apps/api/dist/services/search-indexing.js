"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchIndexingService = void 0;
const uuid_1 = require("uuid");
class SearchIndexingService {
    constructor(prisma, progressTracker) {
        this.prisma = prisma;
        this.progressTracker = null;
        this.progressTracker = progressTracker || null;
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
    // Infer category from title and description with proper word boundary matching
    inferCategory(title, description) {
        const content = `${title} ${description || ''}`.toLowerCase();
        const categories = {
            'tutorial': ['tutorial', 'how to', 'guide', 'learn', 'course', 'lesson', 'education'],
            'music': ['music', 'song', 'beat', 'melody', 'audio', 'soundtrack', 'remix'],
            'ai': ['\\bai\\b', 'artificial intelligence', 'machine learning', 'neural', 'algorithm', 'deep learning'],
            'art': ['\\bart\\b', 'design', 'creative', 'visual', 'drawing', 'painting', 'illustration'],
            'tech': ['tech', 'technology', 'coding', 'programming', 'software', 'developer', 'javascript'],
            'gaming': ['game', 'gaming', 'gameplay', 'stream', 'esports', 'playthrough'],
            'entertainment': ['entertainment', 'comedy', 'funny', 'meme', 'story', 'vlog', 'reaction']
        };
        // Score each category based on keyword matches
        const categoryScores = {};
        for (const [category, keywords] of Object.entries(categories)) {
            let score = 0;
            for (const keyword of keywords) {
                // Use word boundary regex for single words, phrase matching for multi-word
                const regex = keyword.includes(' ')
                    ? new RegExp(keyword, 'i')
                    : new RegExp(`\\b${keyword}\\b`, 'i');
                if (regex.test(content)) {
                    score++;
                }
            }
            if (score > 0) {
                categoryScores[category] = score;
            }
        }
        // Return the category with the highest score
        const topCategory = Object.entries(categoryScores)
            .sort(([, a], [, b]) => b - a)
            .map(([category]) => category)[0];
        return topCategory || null;
    }
    // Rebuild search index for all videos with proper rate limiting and error handling
    async rebuildSearchIndex(options = {}) {
        const { batchSize = 10, // Smaller batch size for safety
        delayMs = 100, // 100ms delay between batches
        logger = {
            info: (msg) => { }, // Silent by default
            error: (msg, error) => { }
        }, progressId = (0, uuid_1.v4)() } = options;
        let indexed = 0;
        let errors = 0;
        let totalProcessed = 0;
        try {
            // Count total videos first to avoid loading all IDs into memory
            const totalVideos = await this.prisma.video.count({
                where: {
                    status: 'PUBLISHED',
                    isApproved: true
                }
            });
            // Create progress tracking entry
            if (this.progressTracker) {
                await this.progressTracker.create(progressId, totalVideos);
                await this.progressTracker.start(progressId);
            }
            logger.info(`Starting search index rebuild for ${totalVideos} videos...`);
            // Process in chunks using cursor-based pagination
            let cursor;
            while (totalProcessed < totalVideos) {
                // Fetch next batch using cursor
                const videos = await this.prisma.video.findMany({
                    where: {
                        status: 'PUBLISHED',
                        isApproved: true
                    },
                    select: { id: true },
                    take: batchSize,
                    skip: cursor ? 1 : 0, // Skip the cursor itself
                    cursor: cursor ? { id: cursor } : undefined,
                    orderBy: { id: 'asc' }
                });
                if (videos.length === 0)
                    break;
                // Process videos sequentially within batch to avoid overwhelming the database
                for (const video of videos) {
                    try {
                        const indexData = await this.indexVideo(video.id);
                        if (indexData) {
                            indexed++;
                        }
                        totalProcessed++;
                    }
                    catch (error) {
                        errors++;
                        totalProcessed++;
                        logger.error(`Failed to index video ${video.id}`, error);
                    }
                    // Update progress tracker
                    if (this.progressTracker && totalProcessed % 10 === 0) {
                        await this.progressTracker.update(progressId, {
                            processedItems: totalProcessed,
                            successfulItems: indexed,
                            failedItems: errors
                        });
                    }
                }
                // Update cursor for next batch
                cursor = videos[videos.length - 1]?.id;
                // Log progress every 10%
                const progressPercent = Math.floor((totalProcessed / totalVideos) * 100);
                if (progressPercent % 10 === 0 && progressPercent > 0) {
                    logger.info(`Search indexing progress: ${progressPercent}% (${totalProcessed}/${totalVideos} videos)`);
                }
                // Rate limiting delay between batches
                if (totalProcessed < totalVideos) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
            // Final progress update
            if (this.progressTracker) {
                await this.progressTracker.update(progressId, {
                    processedItems: totalProcessed,
                    successfulItems: indexed,
                    failedItems: errors
                });
                await this.progressTracker.complete(progressId);
            }
            logger.info(`Search index rebuild complete. Indexed: ${indexed}, Errors: ${errors}, Total: ${totalProcessed}`);
            return { indexed, errors, totalProcessed, progressId };
        }
        catch (error) {
            logger.error('Search index rebuild failed', error);
            // Update progress tracker with error
            if (this.progressTracker) {
                await this.progressTracker.complete(progressId, error instanceof Error ? error.message : String(error));
            }
            throw new Error(`Search index rebuild failed after processing ${totalProcessed} videos: ${error}`);
        }
    }
    // Enhanced search with PostgreSQL full-text search
    async searchVideos(query, options = {}) {
        const { limit = 20, offset = 0, category, sortBy = 'relevance' } = options;
        if (!query.trim()) {
            return { videos: [], total: 0, suggestions: [] };
        }
        const searchTerms = this.extractSearchTerms(query);
        try {
            // Use PostgreSQL full-text search for better performance
            let videos;
            let total;
            if (sortBy === 'relevance') {
                // Use raw SQL for full-text search with relevance ranking
                const searchResults = await this.prisma.$queryRaw `
          SELECT 
            v.id,
            v.title,
            v.description,
            v."thumbnailUrl",
            v."muxPlaybackId",
            v.duration,
            v.views,
            v."createdAt",
            v."publishedAt",
            v."creatorId",
            ts_rank(
              setweight(to_tsvector('english', v.title), 'A') ||
              setweight(to_tsvector('english', COALESCE(v.description, '')), 'B'),
              plainto_tsquery('english', ${query})
            ) + (LOG(v.views + 1) * 0.1) as rank
          FROM "Video" v
          WHERE 
            v.status = 'PUBLISHED' 
            AND v."isApproved" = true
            AND (
              to_tsvector('english', v.title) @@ plainto_tsquery('english', ${query})
              OR to_tsvector('english', COALESCE(v.description, '')) @@ plainto_tsquery('english', ${query})
            )
          ORDER BY rank DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
                // Get creators for the videos
                const creatorIds = [...new Set(searchResults.map(v => v.creatorId))];
                const creators = await this.prisma.user.findMany({
                    where: { id: { in: creatorIds } },
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        avatarUrl: true
                    }
                });
                const creatorMap = new Map(creators.map(c => [c.id, c]));
                // Combine results
                videos = searchResults.map(video => ({
                    id: video.id,
                    title: video.title,
                    description: video.description,
                    thumbnailUrl: video.thumbnailUrl,
                    muxPlaybackId: video.muxPlaybackId,
                    duration: video.duration,
                    views: video.views,
                    createdAt: video.createdAt,
                    publishedAt: video.publishedAt,
                    creator: creatorMap.get(video.creatorId)
                }));
                // Get total count
                const countResult = await this.prisma.$queryRaw `
          SELECT COUNT(*)::bigint as count
          FROM "Video" v
          WHERE 
            v.status = 'PUBLISHED' 
            AND v."isApproved" = true
            AND (
              to_tsvector('english', v.title) @@ plainto_tsquery('english', ${query})
              OR to_tsvector('english', COALESCE(v.description, '')) @@ plainto_tsquery('english', ${query})
            )
        `;
                total = Number(countResult[0].count);
            }
            else {
                // For non-relevance sorting, use regular Prisma queries with optimized conditions
                const orderBy = sortBy === 'views'
                    ? { views: 'desc' }
                    : { publishedAt: 'desc' };
                const whereCondition = {
                    status: 'PUBLISHED',
                    isApproved: true,
                    OR: searchTerms.length > 0 ? [
                        { title: { search: searchTerms.join(' & ') } },
                        { description: { search: searchTerms.join(' & ') } }
                    ] : [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                };
                const [videoResults, totalCount] = await Promise.all([
                    this.prisma.video.findMany({
                        where: whereCondition,
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
                        take: limit,
                        skip: offset
                    }),
                    this.prisma.video.count({ where: whereCondition })
                ]);
                videos = videoResults;
                total = totalCount;
            }
            // Apply category filter if specified
            if (category) {
                videos = videos.filter(video => {
                    const videoCategory = this.inferCategory(video.title, video.description);
                    return videoCategory === category;
                });
            }
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
