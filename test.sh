set -xe

# C language, x86-64 target

  # 1. compile initial compiler
  clang ./src/mshc.c -Os -o ./bin/mshc-c

  # 2. generate source of the compiler in XYZ language
  node ./utils/any2xyz.mjs < ./bin/mshc-c \
    > ./examples/mshc-c.xyz

  # 3. compile it's source (self hosting)
  ./bin/mshc-c < ./examples/mshc-c.xyz \
    > ./bin/mshc-c-self-hosted

  # (test). check that binaries are the same
  cmp ./bin/mshc-c ./bin/mshc-c-self-hosted
  rm ./bin/mshc-c-self-hosted

# AssemblyScript language, WASM target:

  # 1. compile initial compiler
  npm ci --silent && npx asc ./src/mshc.ts -o ./bin/mshc-as.wasm

  # 2. generate source of the compiler in XYZ language
  node ./utils/wasm2xyz.mjs < ./bin/mshc-as.wasm \
    > ./examples/mshc-as.xyz

  # (test). compile simplest wasm module and validate with wasm2wat
  wasmtime ./bin/mshc-as.wasm < ./examples/simplest-wasm.xyz \
    | wasm2wat -

  # 3. compile its source (self hosting)
  wasmtime ./bin/mshc-as.wasm < ./examples/mshc-as.xyz \
    > ./bin/mshc-as-self-hosted.wasm

  # (test). check that binaries are the same 
  cmp ./bin/mshc-as.wasm ./bin/mshc-as-self-hosted.wasm
  rm ./bin/mshc-as-self-hosted.wasm

# LO language, WASM target:

  # 1. compile initial compiler
  wasmtime --dir=. ./utils/lo.wasm ./src/mshc.lo \
    > ./bin/mshc-lo.wasm

  # 2. generate source of the compiler in XYZ language
  node ./utils/wasm2xyz.mjs < ./bin/mshc-lo.wasm \
    > ./examples/mshc-lo.xyz

  # (test). compile simplest wasm module and validate with wasm2wat
  wasmtime ./bin/mshc-lo.wasm < ./examples/simplest-wasm.xyz \
    | wasm2wat -

  # 3. compile its source (self hosting)
  wasmtime ./bin/mshc-lo.wasm < ./examples/mshc-lo.xyz \
    > ./bin/mshc-lo-self-hosted.wasm

  # (test). check that binaries are the same
  cmp ./bin/mshc-lo.wasm ./bin/mshc-lo-self-hosted.wasm
  rm ./bin/mshc-lo-self-hosted.wasm
