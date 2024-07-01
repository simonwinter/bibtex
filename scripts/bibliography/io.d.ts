export declare class BibliographyIO {
    bibFile: string;
    constructor(bibFile: string);
    downloadBibFile(): Promise<string>;
    saveToDisk(input: Record<string, unknown>, path: string): Promise<void>;
}
