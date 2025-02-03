# ASC version
npx asc src/mshc.ts -o mshc.wasm

# LO version
wasmtime --dir=. ./utils/lo.wasm src/mshc.lo > mshc2.wasm
