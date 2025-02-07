set -xe

# 1. compile initial compiler
wasmtime --dir=. ./utils/lo.wasm ./src/mshc.lo \
  > ./bin/mshc.wasm

# 2. generate source of the compiler in XYZ language
node ./utils/wasm2xyz.mjs < ./bin/mshc.wasm \
  > ./examples/mshc.xyz

# (test). compile simplest wasm module and validate with wasm2wat
wasmtime ./bin/mshc.wasm < ./examples/simplest-wasm.xyz \
  | wasm2wat -

# 3. compile its source (self hosting)
wasmtime ./bin/mshc.wasm < ./examples/mshc.xyz \
  > ./bin/mshc-self-hosted.wasm

# (test). check that binaries are the same
cmp ./bin/mshc.wasm ./bin/mshc-self-hosted.wasm
rm ./bin/mshc-self-hosted.wasm
