import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a13.txt");

type T = number | T[];

const pairs: [T, T][] = [];

for (let i = 0; i < lines.length; i += 2) {
  pairs.push([JSON.parse(lines[i]), JSON.parse(lines[i + 1])]);
}

function rightOrder(left: T, right: T): boolean | undefined {
  if (left === right) {
    return undefined;
  }
  if (typeof left === "number" && typeof right === "number") {
    return left < right;
  }
  if (typeof left === "number") {
    return rightOrder([left], right);
  }
  if (typeof right === "number") {
    return rightOrder(left, [right]);
  }

  for (let i = 0; i < left.length || i < right.length; i++) {
    const leftElement = left[i];
    const rightElement = right[i];
    if (leftElement === undefined) {
      return true;
    }
    if (rightElement === undefined) {
      return false;
    }
    const result = rightOrder(leftElement, rightElement);
    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
}

p(sum(pairs.map((pair, i) => (rightOrder(...pair) ? i + 1 : 0))));

const divider1: T = [[2]];
const divider2: T = [[6]];
const allPackets: T[] = [divider1, divider2];
pairs.forEach((pair) => allPackets.push(...pair));

allPackets.sort((a, b) => (rightOrder(a, b) ? -1 : 1));
p((allPackets.indexOf(divider1) + 1) * (allPackets.indexOf(divider2) + 1));
