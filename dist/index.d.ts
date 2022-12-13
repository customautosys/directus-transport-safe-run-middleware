import { Transport, TransportMethods, TransportOptions, TransportResponse } from '@directus/sdk';
import type { Express } from 'express';
export default class DirectusTransportSafeRunMiddleware extends Transport {
    protected app: Express;
    constructor(url: string, app: Express);
    protected request<T = any, R = any>(method: TransportMethods, path: string, data?: Record<string, any>, options?: Omit<TransportOptions, 'url'>): Promise<TransportResponse<T, R>>;
}
