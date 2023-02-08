#!/usr/bin/env bash

emcc \
  vendor/zstd/lib/common/debug.c \
  vendor/zstd/lib/common/entropy_common.c \
  vendor/zstd/lib/common/error_private.c \
  vendor/zstd/lib/common/fse_decompress.c \
  vendor/zstd/lib/common/pool.c \
  vendor/zstd/lib/common/threading.c \
  vendor/zstd/lib/common/xxhash.c \
  vendor/zstd/lib/common/zstd_common.c \
  vendor/zstd/lib/compress/fse_compress.c \
  vendor/zstd/lib/compress/hist.c \
  vendor/zstd/lib/compress/huf_compress.c \
  vendor/zstd/lib/compress/zstd_compress.c \
  vendor/zstd/lib/compress/zstd_compress_literals.c \
  vendor/zstd/lib/compress/zstd_compress_sequences.c \
  vendor/zstd/lib/compress/zstd_compress_superblock.c \
  vendor/zstd/lib/compress/zstd_double_fast.c \
  vendor/zstd/lib/compress/zstd_fast.c \
  vendor/zstd/lib/compress/zstd_lazy.c \
  vendor/zstd/lib/compress/zstd_ldm.c \
  vendor/zstd/lib/compress/zstd_opt.c \
  vendor/zstd/lib/compress/zstdmt_compress.c \
  vendor/zstd/lib/decompress/huf_decompress.c \
  vendor/zstd/lib/decompress/zstd_ddict.c \
  vendor/zstd/lib/decompress/zstd_decompress.c \
  vendor/zstd/lib/decompress/zstd_decompress_block.c \
  -o dist/wasm-zstd.js src/wasm-zstd.c `# this runs emscripten on the code in wasm-zstd.c` \
  -O3 `# compile with all optimizations enabled` \
  -s WASM=1 `# compile to .wasm instead of asm.js` \
  --pre-js pre.js `# include pre.js at the top of wasm-zstd.js` \
  -s MODULARIZE=1 `# include module boilerplate for better node/webpack interop` \
  -s NO_EXIT_RUNTIME=1 `# keep the process around after main exits` \
  -s TOTAL_STACK=1048576 `# use a 1MB stack size instead of the default 5MB` \
  -s INITIAL_MEMORY=2097152 `# start with a 2MB allocation instead of 16MB, we will dynamically grow` \
  -s ALLOW_MEMORY_GROWTH=1  `# need this because we don't know how large decompressed blocks will be` \
  -s NODEJS_CATCH_EXIT=0 `# we don't use exit() and catching exit will catch all exceptions` \
  -s NODEJS_CATCH_REJECTION=0 `# prevent emscripten from adding an unhandledRejection handler` \
  -s "EXPORTED_FUNCTIONS=['_malloc', '_free']" `# index.js uses Module._malloc and Module._free`

cp src/index.js dist/index.js
