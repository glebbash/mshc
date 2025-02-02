set -xe

./build.sh

wasmtime ./mshc.wasm \
  < examples/empty-module.xyz \
  | wasm2wat -

wasmtime ./mshc.wasm \
  < examples/mshc.xyz \
  > examples/mshc.wasm

cmp mshc.wasm examples/mshc.wasm
