process.env.NODE_ENV = "test";

const fs = require("fs");
const assert = require("assert");

const decompress = require("../");
const compressed = fs.readFileSync(`${__dirname}/compressed.zstd`);
const uncompressed = fs.readFileSync(`${__dirname}/uncompressed.txt`);

// note: we cannot put this within a mocha test
// because wasm compiles faster than mocha starts the first test
assert.throws(() => {
  decompress(compressed, uncompressed.byteLength);
});

describe("wasm-zstd", () => {
  it("waits until module is ready", done => {
    decompress.isLoaded.then(done);
  });

  it("decompresses accurately", () => {
    const result = decompress(compressed, uncompressed.byteLength);
    assert(result.byteLength === uncompressed.byteLength);
    for (var i = 0; i < result.byteLength; i++) {
      assert(result[i] === uncompressed[i]);
    }
  });

  it("does not grow the heap after multiple decompression calls", () => {
    const originalHeapSize = decompress.__module.HEAP8.buffer.byteLength;
    for (var i = 0; i < 10000; i++) {
      decompress(compressed, uncompressed.byteLength);
    }
    const newHeapSize = decompress.__module.HEAP8.buffer.byteLength;
    assert(originalHeapSize === newHeapSize);
  });

  it("can decompress into a space greater than uncompressed byte length", () => {
    const result = decompress(compressed, uncompressed.byteLength + 100);
    assert(result.byteLength === uncompressed.byteLength);
    for (var i = 0; i < result.byteLength; i++) {
      assert(result[i] === uncompressed[i]);
    }
  });

  it("throws when decompressing into too small of a result buffer", () => {
    assert.throws(() => {
      const result = decompress(compressed, uncompressed.byteLength - 100);
    });
  });

  it("throws an error if decompressing invalid buffer", () => {
    assert.throws(() => {
      const result = decompress(Buffer.alloc(10, 1), 100);
    });
  });
});
