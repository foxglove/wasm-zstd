declare module "@foxglove/wasm-zstd" {
  function decompress(buffer: Uint8Array, size: number): Buffer;
  namespace decompress {
    const isLoaded: Promise<boolean>;
  }

  export default decompress;
}
