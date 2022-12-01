import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a01.txt", true, false);

const caloriesPerElf: number[][] = [[]];

for (const line of lines) {
  if (line.length > 0) {
    caloriesPerElf[caloriesPerElf.length - 1].push(parseInt(line));
  } else {
    caloriesPerElf.push([]);
  }
}

const sums = caloriesPerElf.map((calories) => sum(calories));
sums.sort((a, b) => b - a);
p(sums[0]);
p(sums[0] + sums[1] + sums[2]);
