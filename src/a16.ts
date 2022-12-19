import { dijkstraSearch, Neighbor } from "./util/graphUtil";
import { p, readLines } from "./util/util";

const lines = readLines("input/a16.txt");

class Valve {
  constructor(readonly name: string, readonly rate: number, readonly neighborNames: string[]) {}
}

const valves = lines.map((line) => {
  const match = line.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/);
  if (!match) {
    throw new Error(line);
  }
  return new Valve(match[1], parseInt(match[2]), match[3].split(", "));
});

const valvesByName: Record<string, Valve> = {};
for (const valve of valves) {
  valvesByName[valve.name] = valve;
}

const positiveRateNames = valves.filter((v) => v.rate > 0).map((v) => v.name);

// distances from AA and valves with positive rate to all other valves
const distances: Record<string, number> = {};

for (const fromName of ["AA", ...positiveRateNames]) {
  dijkstraSearch<string, void>(
    (current, _, distance) => {
      if (distance > 0) {
        distances[fromName + "-" + current] = distance;
      }
      return valvesByName[current].neighborNames.map((n) => new Neighbor(n, 1, undefined));
    },
    fromName,
    undefined
  );
}

function findBest(current: string, options: Set<string>, remainingMinutes: number): number {
  let max = 0;
  for (const option of [...options]) {
    const rateMinutes = remainingMinutes - distances[current + "-" + option] - 1;
    const reduction = rateMinutes * valvesByName[option].rate;
    if (reduction > 0) {
      options.delete(option);
      const total = reduction + findBest(option, options, rateMinutes);
      if (total > max) {
        max = total;
      }
      options.add(option);
    }
  }

  return max;
}

p(findBest("AA", new Set(positiveRateNames), 30));

function forSubsetsAndComplements(elements: string[], fn: (subset: Set<string>, complement: Set<string>) => void) {
  const subset = new Set<string>();
  const complement = new Set<string>(elements);

  fn(subset, complement);

  const len = elements.length;
  function rec(startIndex: number, depth: number) {
    for (let i = startIndex; i < len; i++) {
      const element = elements[i];
      subset.add(element);
      complement.delete(element);

      fn(subset, complement);
      rec(i + 1, depth + 1);

      subset.delete(element);
      complement.add(element);
    }
  }
  rec(0, 0);
}

const part2Cache = new Map<string, number>();
function findBestPart2Cached(options: Set<string>) {
  const key = [...options].sort().join(",");
  let result = part2Cache.get(key);
  if (result === undefined) {
    result = findBest("AA", options, 26);
    part2Cache.set(key, result);
  }
  return result;
}

let part2Max = 0;
forSubsetsAndComplements(positiveRateNames, (subset, complement) => {
  part2Max = Math.max(part2Max, findBestPart2Cached(subset) + findBestPart2Cached(complement));
});

p(part2Max);
