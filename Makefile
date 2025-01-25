all:
	clang --target=wasm32 -nostdlib -Wno-int-conversion -Wl,--no-entry -Wl,--export=_start -o mshc.wasm mshc.c

clean:
	rm -f mshc.wasm
