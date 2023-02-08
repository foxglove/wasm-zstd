process.env.NODE_ENV = "test";

const fs = require("fs");
const assert = require("assert");

const zstd = require("../");
const compressed = fs.readFileSync(`${__dirname}/compressed.zstd`);
const uncompressed = fs.readFileSync(`${__dirname}/uncompressed.txt`);

// note: we cannot put this within a mocha test
// because wasm compiles faster than mocha starts the first test
assert.throws(() => {
  zstd.decompress(compressed, uncompressed.byteLength);
});

describe("decompress", () => {
  it("waits until module is ready", done => {
    zstd.isLoaded.then(done);
  });

  it("decompresses accurately", () => {
    const result = zstd.decompress(compressed, uncompressed.byteLength);
    assert(result.byteLength === uncompressed.byteLength);
    for (var i = 0; i < result.byteLength; i++) {
      assert(result[i] === uncompressed[i]);
    }
  });

  it("does not grow the heap after multiple decompression calls", () => {
    const originalHeapSize = zstd.__module.HEAP8.buffer.byteLength;
    for (var i = 0; i < 10000; i++) {
      zstd.decompress(compressed, uncompressed.byteLength);
    }
    const newHeapSize = zstd.__module.HEAP8.buffer.byteLength;
    assert(originalHeapSize === newHeapSize);
  });

  it("can decompress into a space greater than uncompressed byte length", () => {
    const result = zstd.decompress(compressed, uncompressed.byteLength + 100);
    assert(result.byteLength === uncompressed.byteLength);
    for (var i = 0; i < result.byteLength; i++) {
      assert(result[i] === uncompressed[i]);
    }
  });

  it("throws when decompressing into too small of a result buffer", () => {
    assert.throws(() => {
      const result = zstd.decompress(compressed, uncompressed.byteLength - 100);
    });
  });

  it("throws an error if decompressing invalid buffer", () => {
    assert.throws(() => {
      const result = zstd.decompress(Buffer.alloc(10, 1), 100);
    });
  });
});

describe("compress", () => {
  it("waits until module is ready", done => {
    zstd.isLoaded.then(done);
  });

  it("compresses accurately", () => {
    const result = zstd.compress(uncompressed);
    assert(result.byteLength < uncompressed.byteLength);

    const decompressed = zstd.decompress(result, uncompressed.byteLength);
    assert(decompressed.byteLength === uncompressed.byteLength);
    for (var i = 0; i < decompressed.byteLength; i++) {
      assert(decompressed[i] === uncompressed[i]);
    }
  });

  it("can use a higher compression level", () => {
    const result3 = zstd.compress(uncompressed);
    const result19 = zstd.compress(uncompressed, 19);

    assert(result19.byteLength < result3.byteLength);

    const decompressed = zstd.decompress(result19, uncompressed.byteLength);
    assert(decompressed.byteLength === uncompressed.byteLength);
    for (var i = 0; i < decompressed.byteLength; i++) {
      assert(decompressed[i] === uncompressed[i]);
    }
  });
});
