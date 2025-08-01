import { PrismaClient } from '@fabl/db';
import { IndexProgressTracker } from './index-progress-tracker';
interface SearchIndex {
    id: string;
    title: string;
    description: string | null;
    searchTerms: string[];
    tags: string[];
    category: string | null;
    creatorName: string;
    views: number;
    createdAt: Date;
    publishedAt: Date | null;
}
export declare class SearchIndexingService {
    private prisma;
    private progressTracker;
    constructor(prisma: PrismaClient, progressTracker?: IndexProgressTracker);
    private extractSearchTerms;
    private isStopWord;
    private generateSearchSuggestions;
    indexVideo(videoId: string): Promise<SearchIndex | null>;
    private extractTags;
    private inferCategory;
    rebuildSearchIndex(options?: {
        batchSize?: number;
        delayMs?: number;
        logger?: {
            info: (msg: string) => void;
            error: (msg: string, error?: any) => void;
        };
        progressId?: string;
    }): Promise<{
        indexed: number;
        errors: number;
        totalProcessed: number;
        progressId: string;
    }>;
    searchVideos(query: string, options?: {
        limit?: number;
        offset?: number;
        category?: string;
        sortBy?: 'relevance' | 'views' | 'recent';
    }): Promise<{
        videos: any[];
        total: number;
        suggestions: string[];
    }>;
    getTrendingSearchTerms(limit?: number): Promise<string[]>;
}
export {};
