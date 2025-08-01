import { Redis } from 'ioredis';
export interface IndexProgress {
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    totalItems: number;
    processedItems: number;
    successfulItems: number;
    failedItems: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    lastUpdatedAt: Date;
}
export declare class IndexProgressTracker {
    private redis;
    private keyPrefix;
    private ttl;
    constructor(redis: Redis | null);
    private getKey;
    create(id: string, totalItems: number): Promise<IndexProgress>;
    start(id: string): Promise<void>;
    update(id: string, updates: {
        processedItems?: number;
        successfulItems?: number;
        failedItems?: number;
    }): Promise<void>;
    complete(id: string, error?: string): Promise<void>;
    get(id: string): Promise<IndexProgress | null>;
    list(): Promise<IndexProgress[]>;
    delete(id: string): Promise<void>;
}
