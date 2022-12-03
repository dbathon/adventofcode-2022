import { intersection, p, readLines } from "./util/util";

const lines = readLines("input/a03.txt");

function letterSet(input: string) {
  return new Set(input.split(""));
}

const CODE_A = "A".charCodeAt(0);
const CODE_a = "a".charCodeAt(0);

function score(letter: string) {
  const code = letter.charCodeAt(0);
  return code < CODE_a ? code - CODE_A + 27 : code - CODE_a + 1;
}

let sumPart1 = 0;
for (const line of lines) {
  const compartmentLen = Math.floor(line.length / 2);
  const compartment1 = letterSet(line.substring(0, compartmentLen));
  const compartment2 = letterSet(line.substring(compartmentLen));
  [...intersection(compartment1, compartment2)].map(score).forEach((s) => (sumPart1 += s));
}
p(sumPart1);

let sumPart2 = 0;
for (let i = 0; i < lines.length - 2; i += 3) {
  const common = intersection(intersection(letterSet(lines[i]), letterSet(lines[i + 1])), letterSet(lines[i + 2]));
  [...common].map(score).forEach((s) => (sumPart2 += s));
}
p(sumPart2);
