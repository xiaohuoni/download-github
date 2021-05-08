import fs from "fs";

export function makeDir(
  root: string,
  options = { recursive: true }
): Promise<any> {
  return fs.promises.mkdir(root, options);
}
