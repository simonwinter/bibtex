/// <reference types="node" resolution-mode="require"/>
import type { OutgoingHttpHeaders } from "http";
export declare namespace DoiAPI {
    type RateLimitHeaders = {
        'x-rate-limit-limit': string;
        'x-rate-limit-interval': string;
    };
    type TitleRecord = {
        type: string;
        text: string;
        marks?: {
            type: 'nocase' | 'link' | 'code' | 'bold' | 'underline' | 'italic' | 'superscript' | 'subscript';
            link?: string;
        }[];
    };
}
export declare class DoiAPI {
    headers: OutgoingHttpHeaders | undefined;
    constructor(headers?: OutgoingHttpHeaders | undefined);
    fetchMetadataFromDOI(doi: string): Promise<string>;
    retrieveRateLimit(): Promise<string>;
    getRateLimit(): Promise<{
        interval: any;
        limit: number;
    }>;
}
