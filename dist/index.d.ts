import { Transport, TransportMethods, TransportOptions, TransportResponse } from '@directus/sdk';
import type { Request, Response } from 'express';
export default class DirectusTransportSafeRunMiddleware extends Transport {
    protected req: Request;
    protected res: Response;
    constructor(url: string, req: Request, res: Response);
    protected request<T = any, R = any>(method: TransportMethods, path: string, data?: Record<string, any>, options?: Omit<TransportOptions, 'url'>): Promise<TransportResponse<T, R>>;
}
