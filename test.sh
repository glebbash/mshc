set -xe

./build.sh

# ASC version

  node utils/wasm2xyz.mjs < mshc.wasm > examples/mshc.xyz

  wasmtime ./mshc.wasm \
    < examples/empty-module.xyz \
    | wasm2wat -

  wasmtime ./mshc.wasm \
    < examples/mshc.xyz \
    > examples/mshc.wasm

  cmp mshc.wasm examples/mshc.wasm

# LO version

  node utils/wasm2xyz.mjs < mshc2.wasm > examples/mshc2.xyz

  wasmtime ./mshc2.wasm \
    < examples/empty-module.xyz \
    | wasm2wat -

  # TODO: mshc2.wasm produces different output then mshc.wasm
  wasmtime ./mshc.wasm \
    < examples/mshc2.xyz \
    > examples/mshc2.wasm

  cmp mshc2.wasm examples/mshc2.wasm
