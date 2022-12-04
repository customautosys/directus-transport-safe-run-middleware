import { ITransport, TransportRequestOptions, TransportResponse } from '@directus/sdk';
import { Express } from 'express';
export default class DirectusTransportSafeRunMiddleware implements ITransport {
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
    protected readonly request: <T = any, P = any, R = any>(method: string, path: string, options?: TransportRequestOptions, data?: P) => Promise<TransportResponse<T, R>>;
    readonly get: <T = any, R = any>(path: string, options?: TransportRequestOptions) => Promise<TransportResponse<T, R>>;
    readonly head: <T = any, R = any>(path: string, options?: TransportRequestOptions) => Promise<TransportResponse<T, R>>;
    readonly options: <T = any, R = any>(path: string, options?: TransportRequestOptions) => Promise<TransportResponse<T, R>>;
    readonly delete: <T = any, P = any, R = any>(path: string, data?: P, options?: TransportRequestOptions) => Promise<TransportResponse<T, R>>;
    readonly post: <T = any, P = any, R = any>(path: string, data?: P, options?: TransportRequestOptions) => Promise<TransportResponse<T, R>>;
    readonly put: <T = any, P = any, R = any>(path: string, data?: P, options?: TransportRequestOptions) => Promise<TransportResponse<T, R>>;
    readonly patch: <T = any, P = any, R = any>(path: string, data?: P, options?: TransportRequestOptions) => Promise<TransportResponse<T, R>>;
}
