import { readFileSync, readdirSync } from "fs";
import { createHash } from "node:crypto";
import { join } from "path";

const sfwPath = join(__dirname, "../handlers");
const files = readdirSync(sfwPath);

files.forEach((filename) => {
  const hash = createHash("sha256");
  const data = readFileSync(join(sfwPath, filename));

  hash.update(data);
  console.log(hash.digest("hex"));
});
