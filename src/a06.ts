import { p, readLines } from "./util/util";

const lines = readLines("input/a06.txt");
const line = lines[0];

function lettersUnqiue(str: string) {
  const set = new Set(str.split(""));
  return set.size === str.length;
}

function findMarkerEnd(str: string, length: number) {
  for (let i = 0; i < line.length - (length - 1); i++) {
    if (lettersUnqiue(line.substring(i, i + length))) {
      return i + length;
    }
  }
}

p(findMarkerEnd(line, 4));
p(findMarkerEnd(line, 14));
