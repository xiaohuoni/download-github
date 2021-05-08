export declare class DownloadError extends Error {
}
export default function download(base: string, temp: {
    name: string;
    url: string;
    path: string;
}): Promise<any>;
