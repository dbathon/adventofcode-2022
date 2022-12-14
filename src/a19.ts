import { p, readLines } from "./util/util";

const lines = readLines("input/a19.txt");

// assume that all relevant numbers are between 0 and 127...
const PART_BITS = 7;
const PART_MASK = (1 << PART_BITS) - 1;

type Resource = 0 | 1 | 2 | 3;

const ORE: Resource = 0;
const CLAY: Resource = 1;
const OBSIDIAN: Resource = 2;
const GEODE: Resource = 3;

const RESOURCES: Resource[] = [ORE, CLAY, OBSIDIAN, GEODE];

type Counts = number;

function getCount(counts: Counts, resource: Resource): number {
  return (counts >> (resource * PART_BITS)) & PART_MASK;
}

function setCount(counts: Counts, resource: Resource, count: number): Counts {
  const shift = resource * PART_BITS;
  return (counts & ~(PART_MASK << shift)) + ((count & PART_MASK) << shift);
}

function debugCounts(counts: Counts): number[] {
  return RESOURCES.map((r) => getCount(counts, r));
}

function allLargerOrEqual(a: Counts, b: Counts): boolean {
  for (const resource of RESOURCES) {
    if (getCount(a, resource) < getCount(b, resource)) {
      return false;
    }
  }
  return true;
}

function allSignLargerOrEqual(a: Counts, b: Counts): boolean {
  for (const resource of RESOURCES) {
    if (Math.sign(getCount(a, resource)) < Math.sign(getCount(b, resource))) {
      return false;
    }
  }
  return true;
}

class Production {
  constructor(readonly resourceCounts: Counts, readonly outputResource: Resource) {}
}

class Blueprint {
  readonly sumResourceCounts: Counts;
  constructor(readonly id: number, readonly productions: Production[]) {
    // we don't need to produce more per minute then we can actually use
    this.sumResourceCounts = productions
      .filter((p) => !allSignLargerOrEqual(setCount(0, p.outputResource, 1), p.resourceCounts))
      .map((p) => p.resourceCounts)
      .reduce((a, b) => a + b, 0);
  }
}

const blueprints = lines.map((line) => {
  const match = line.match(
    /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
  );
  if (!match) {
    throw new Error(line);
  }
  return new Blueprint(parseInt(match[1]), [
    new Production(setCount(0, ORE, parseInt(match[2])), ORE),
    new Production(setCount(0, ORE, parseInt(match[3])), CLAY),
    new Production(setCount(setCount(0, ORE, parseInt(match[4])), CLAY, parseInt(match[5])), OBSIDIAN),
    new Production(setCount(setCount(0, ORE, parseInt(match[6])), OBSIDIAN, parseInt(match[7])), GEODE),
  ]);
});

function findMaxGeodes(
  blueprint: Blueprint,
  resourceCounts: Counts,
  outputCounts: Counts,
  remainingMinutes: number,
  bestCounts: number[] = []
): number {
  const geodeCount = getCount(resourceCounts, GEODE);
  if (remainingMinutes === 0) {
    return geodeCount;
  }
  if (remainingMinutes < 0) {
    // should not happen
    return 0;
  }
  const previousBestGeodeCount = bestCounts[remainingMinutes];
  if (previousBestGeodeCount !== undefined && geodeCount < previousBestGeodeCount) {
    return 0;
  }
  bestCounts[remainingMinutes] = geodeCount;

  if (!allLargerOrEqual(blueprint.sumResourceCounts, setCount(outputCounts, GEODE, 0))) {
    // this state will produce more per minute than could be used, so it is inefficient, so don't follow it
    return 0;
  }

  let max = 0;

  for (const production of blueprint.productions) {
    if (allSignLargerOrEqual(outputCounts, production.resourceCounts)) {
      // we can potentially produce this if we wait
      let tmpResourceCounts = resourceCounts;
      let tmpOutputCounts = outputCounts;
      let tmpRemainingMinutes = remainingMinutes;
      while (true) {
        const productionPossible = allLargerOrEqual(tmpResourceCounts, production.resourceCounts);
        tmpResourceCounts += tmpOutputCounts;
        tmpRemainingMinutes -= 1;

        if (productionPossible) {
          tmpResourceCounts -= production.resourceCounts;
          tmpOutputCounts += setCount(0, production.outputResource, 1);
          break;
        }

        if (tmpRemainingMinutes <= 0) {
          break;
        }
      }

      max = Math.max(
        max,
        findMaxGeodes(blueprint, tmpResourceCounts, tmpOutputCounts, tmpRemainingMinutes, bestCounts)
      );
    }
  }

  return max;
}

let sum = 0;
for (const blueprint of blueprints) {
  sum += blueprint.id * findMaxGeodes(blueprint, 0, setCount(0, ORE, 1), 24);
}
p(sum);

let product = 1;
for (const blueprint of blueprints.slice(0, 3)) {
  product *= findMaxGeodes(blueprint, 0, setCount(0, ORE, 1), 32);
}
p(product);
