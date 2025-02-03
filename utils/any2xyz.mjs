import fs from "node:fs";

main();

function main() {
  const bytes = fs.readFileSync(0);
  const hex = bytes.toString("hex").match(/../g);

  console.log("; XYZ lang is 🔥");
  while (hex.length > 0) {
    console.log("> " + hex.splice(0, 20).join(" ").toUpperCase());
  }
}
