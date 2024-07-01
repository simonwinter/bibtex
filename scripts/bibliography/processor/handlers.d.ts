import { DoiAPI } from "@/doiAPI";
export type Output = {
    id: string;
    bib_type: string;
    title?: string;
    meta?: Record<string, unknown>;
    fields: Record<string, unknown>;
};
type Context = {
    start: number;
    limit: number;
    interval: number;
    count: number;
    doiAPI: DoiAPI;
} & Pick<Output, 'fields'>;
type Marks = NonNullable<Pick<DoiAPI.TitleRecord, 'marks'>['marks']>;
interface JsonHandler {
    setNext(handler: JsonHandler): JsonHandler;
    handle(context: Context, result: Readonly<Output>, mutated?: Output): Promise<Output>;
}
declare class BaseHandler implements JsonHandler {
    next: JsonHandler | undefined;
    setNext(handler: JsonHandler): JsonHandler;
    handle(context: Context, result: Readonly<Output>, mutated?: Output): Promise<Output>;
}
export declare class TitleHandler extends BaseHandler {
    handle(context: Context, result: Readonly<Output>, mutated?: Output): Promise<Output>;
    processMarks(text: string, marks?: Marks): string;
}
export declare class DOIHandler extends BaseHandler {
    handle(context: Context, result: Readonly<Output>, mutated?: Output): Promise<Output>;
}
export {};
