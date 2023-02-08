declare module "@foxglove/wasm-zstd" {
  export const isLoaded: Promise<boolean>;
  export function compressBound(size: number): number;
  export function compress(buffer: Uint8Array, compressionLevel?: number): Buffer;
  export function decompress(buffer: Uint8Array, size: number): Buffer;
}
