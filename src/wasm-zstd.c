//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

#include <stdio.h>
#include <string.h>
#include <emscripten/emscripten.h>
#include "../vendor/zstd/lib/zstd.h"

int main(int argc, char **argv)
{
}

#ifdef __cplusplus
extern "C"
{
#endif

  int EMSCRIPTEN_KEEPALIVE decompress(
      char *dstBuffer, size_t dstSize, const void *srcBuffer, size_t srcSize)
  {
    const size_t result = ZSTD_decompress(dstBuffer, dstSize, srcBuffer, srcSize);
    if (ZSTD_isError(result))
    {
      return -1;
    }
    return result;
  }

#ifdef __cplusplus
}
#endif
