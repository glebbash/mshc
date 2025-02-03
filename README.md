# mshc - Minimal Self Hosted Compiler

This repo shows how to make a self-hosted compiler for the imaginary language `XYZ`.

## `XYZ` Language features

- comments. Example: `; comment`
- binary data dump. Example: `> 0F 6D` (bytes encoded in hex, separated by space)

Example "program" ([also as a file](examples/empty-module.xyz)): 
```xyz
; \0ASM
> 00 61 73 6D

; version 1
> 01 00 00 00
```

This program in `XYZ` will create [the simplest WASM module](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Understanding_the_text_format#the_simplest_module) (it literally dumps the needed bytes to stdout).

---

This language is very simplistic and pretty much useless, but it can technically "generate" code for any target. And not only code, it can "generate" any binary data.

## Self hosting

Writing a compiler for `XYZ` is quite easy because of its limited features.

Given a binary for `XYZ` implemented in *any* language, compiled for *any* platform and very little tooling ([example for WASM](utils/wasm2xyz.mjs)) it's possible to generate source of that program in `XYZ`.

Compiling this generated source will effectively produce the binary of `XYZ` compiler thus making it [self-hosted](https://en.wikipedia.org/wiki/Self-hosting_(compilers)).

## What's in this repo?

This repo provides example implementations of `XYZ` for different languages and target platforms:
- C, targetting your OS/architecture. [source](src/mshc.c)
- [AssemblyScript](https://www.assemblyscript.org/), targetting WASM. [source](src/mshc.lo)
- [LO](https://github.com/glebbash/LO), targetting WASM. [source](src/mshc.lo)

There is also [test.sh](./test.sh) file that shows all steps to get all 3 versions to self-hosting.

### Why?

For fun.

I wanted to make a self-hosted compiler for a very long time, but writing a language first and then writing a compiler in that language takes a lot of time (bottom-up approach). While I was procrastinating on [LO](https://github.com/glebbash/LO) development I decided to just get *something* to self-hosted, thus I "invented" `XYZ` and made this repo.

This might sound stupid but this can be a starting point for creating a self hosted compiler using a top-down approach. Basically you start with `XYZ` language (or similar) and incrementally add more features to shape it into what you want. Benefits of this approach are that you'll always have a self hosted compiler available, but given the amount features implemented the language might stay useless for a while (see [XYZ](#xyz-language-features)).

I might work on this further to see how far this approach could be pushed.

### Prerequisites

Depending on what you want to do with this repo you'll need:
- for LO and AssemblyScript examples:
  - Node.js
  - wasmtime
- for C example:
  - clang
