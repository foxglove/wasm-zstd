//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

#include "../vendor/zstd/lib/zstd.h"
#include <emscripten/emscripten.h>
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv) {}

#ifdef __cplusplus
extern "C" {
#endif

size_t EMSCRIPTEN_KEEPALIVE compressBound(size_t srcSize) {
  return ZSTD_compressBound(srcSize);
}

int EMSCRIPTEN_KEEPALIVE compress(char *dstBuffer, size_t dstSize,
                                  const void *srcBuffer, size_t srcSize,
                                  int compressionLevel) {
  const size_t result =
      ZSTD_compress(dstBuffer, dstSize, srcBuffer, srcSize, compressionLevel);
  if (ZSTD_isError(result)) {
    return -1;
  }
  return result;
}

int EMSCRIPTEN_KEEPALIVE decompress(char *dstBuffer, size_t dstSize,
                                    const void *srcBuffer, size_t srcSize) {
  const size_t result = ZSTD_decompress(dstBuffer, dstSize, srcBuffer, srcSize);
  if (ZSTD_isError(result)) {
    return -1;
  }
  return result;
}

#ifdef __cplusplus
}
#endif
