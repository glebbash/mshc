import fs from "node:fs";

const SECTION_NAMES = [
  "custom",
  "type",
  "import",
  "function",
  "table",
  "memory",
  "global",
  "export",
  "start",
  "element",
  "code",
  "data",
  "data count",
];

main();

function main() {
  const moduleBytes = fs.readFileSync(0);

  console.log("; preamble");
  dumpBytes(moduleBytes.subarray(0, 8));

  let offset = 8;

  while (offset < moduleBytes.length) {
    const id = moduleBytes[offset];
    const name = SECTION_NAMES[id] || `unknown (${id})`;
    let length = 0;
    let shift = 0;

    // Read LEB128 encoded length
    for (let i = 1; i <= 5; i++) {
      const byte = moduleBytes[offset + i];
      length |= (byte & 0x7f) << (7 * shift++);
      if (!(byte & 0x80)) {
        offset += i;
        break;
      }
    }

    const sectionBytes = moduleBytes.subarray(offset + 1, offset + 1 + length);
    console.log(`\n; ${name} section`);
    dumpBytes(moduleBytes.subarray(offset - shift, offset + 1));
    dumpBytes(sectionBytes);

    offset += length + 1;
  }
}

function dumpBytes(bytes) {
  const hex = bytes.toString("hex").match(/../g);

  while (hex.length > 0) {
    console.log("> " + hex.splice(0, 20).join(" ").toUpperCase());
  }
}
