# @foxglove/wasm-zstd

https://github.com/facebook/zstd compiled to WebAssembly and exposed as a high-level TypeScript/JavaScript API . PRs welcome!

## API

`@foxglove/wasm-zstd` exports:

```typescript
export const isLoaded: Promise<boolean>;
export function compressBound(size: number): number;
export function compress(buffer: Uint8Array, compressionLevel?: number): Buffer;
export function decompress(buffer: Uint8Array, size: number): Buffer;
```

Here is an example of compressing then decompressing with this library:

```js
import fs from "fs/promises";
import zstd from "@foxglove/wasm-zstd";

async function main() {
  const inputData = await fs.readFile("input.txt");

  // Wait for the wasm module to load
  await zstd.isLoaded;

  // Compress and save to a file with zstd compression level 3
  const compressedBytes = zstd.compress(inputData, 3);
  await fs.writeFile("compressed.zst", compressedBytes);

  // Currently you need to know the size of the output buffer so the wasm runtime
  // can allocate enough bytes to decompress into
  const outputSize = inputData.byteLength;

  // Decompress
  const decompressedBytes = zstd.decompress(compressedBytes, inputData.byteLength);
  assert(decompressedBytes.byteLength === inputData.byteLength);
}
```

## Using the module in a browser

Emscripten compiled WebAssembly modules are built in 2 parts: a `.js` side and a `.wasm` side. In the browser the `.js` side needs to download the `.wasm` side from the server so it can compile it. There is [more information available in the emscripten documentation](https://kripken.github.io/emscripten-site/docs/compiling/Deploying-Pages.html).

## Developing locally

1. Run `yarn install` to install dependencies.
2. Run `yarn build` to invoke emcc inside a Docker container and compile the code in `wasm-zstd.c` as well as the required zstd source files. The output will be in `dist/` on the host machine.
3. Run `yarn test` to run the tests.

## License

@foxglove/wasm-zstd is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Releasing

1. Run `yarn version --[major|minor|patch]` to bump version
2. Run `git push && git push --tags` to push new tag
3. GitHub Actions will take care of the rest

## Stay in touch

Join our [Slack channel](https://foxglove.dev/join-slack) to ask questions, share feedback, and stay up to date on what our team is working on.
