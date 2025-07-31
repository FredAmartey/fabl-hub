import { PrismaClient } from '@fabl/db';
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
    constructor(prisma: PrismaClient);
    private extractSearchTerms;
    private isStopWord;
    private generateSearchSuggestions;
    indexVideo(videoId: string): Promise<SearchIndex | null>;
    private extractTags;
    private inferCategory;
    rebuildSearchIndex(): Promise<{
        indexed: number;
        errors: number;
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
