import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a25.txt");

function fromSnafu(snafu: string): number {
  let result = 0;
  for (const digit of snafu.split("")) {
    result = result * 5 + (digit === "=" ? -2 : digit === "-" ? -1 : parseInt(digit));
  }
  return result;
}

function toSnafu(num: number): string {
  if (num === 0) {
    return "";
  }
  const mod5 = num % 5;
  const digitString = mod5 === 3 ? "=" : mod5 === 4 ? "-" : mod5.toString();
  return toSnafu(Math.floor(num / 5) + (mod5 > 2 ? 1 : 0)) + digitString;
}

p(toSnafu(sum(lines.map(fromSnafu))));
