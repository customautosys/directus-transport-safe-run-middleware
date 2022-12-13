import { Transport, TransportMethods, TransportOptions, TransportResponse } from '@directus/sdk';
import type { Express } from 'express';
export default class DirectusTransportSafeRunMiddleware extends Transport {
    protected app: {
        runMiddleware(path: string, payload?: {
            method?: string;
            query?: any;
            body?: any;
            cookies?: any;
            headers?: any;
        }): Promise<{
            statusCode: number;
            data: any;
            headers: any;
        }>;
    };
    constructor(app: Express);
    protected readonly request: <T = any, R = any>(method: TransportMethods, path: string, data?: Record<string, any>, options?: Omit<TransportOptions, 'url'>) => Promise<TransportResponse<T, R>>;
}
