import { Transport, TransportMethods, TransportOptions, TransportResponse } from '@directus/sdk';
import type { Request } from 'express';
export default class DirectusTransportSafeRunMiddleware extends Transport {
    req: Request;
    constructor(url: string, req: Request);
    protected request<T = any, R = any>(method: TransportMethods, path: string, data?: Record<string, any>, options?: Omit<TransportOptions, 'url'>): Promise<TransportResponse<T, R>>;
}
