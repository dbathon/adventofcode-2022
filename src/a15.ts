import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a15.txt");

class Report {
  readonly dist: number;

  constructor(readonly sX: number, readonly sY: number, readonly bX: number, readonly bY: number) {
    this.dist = Math.abs(this.sX - this.bX) + Math.abs(this.sY - this.bY);
  }
}

class Range {
  constructor(readonly min: number, readonly max: number) {}

  contains(v: number): boolean {
    return this.min <= v && v <= this.max;
  }

  get size(): number {
    return this.max - this.min + 1;
  }
}

function combine(ranges: Range[]): Range[] {
  if (!ranges.length) {
    return [];
  }
  const sorted = [...ranges].sort((a, b) => a.min - b.min);
  const result: Range[] = [];
  let { min, max } = sorted.shift()!;
  while (sorted.length) {
    const { min: curMin, max: curMax } = sorted.shift()!;
    if (curMin > max) {
      result.push(new Range(min, max));
      min = curMin;
      max = curMax;
    } else {
      max = Math.max(max, curMax);
    }
  }
  result.push(new Range(min, max));

  return result;
}

const reports: Report[] = [];
for (const line of lines) {
  const [sX, sY, bX, bY] = line
    .split(/[^\-0-9]+/)
    .slice(1)
    .map((e) => parseInt(e));
  reports.push(new Report(sX, sY, bX, bY));
}

function buildRanges(reports: Report[], y: number): Range[] {
  const ranges: Range[] = [];

  for (const report of reports) {
    const dist = report.dist;
    const xDist = dist - Math.abs(y - report.sY);
    if (xDist >= 0) {
      ranges.push(new Range(report.sX - xDist, report.sX + xDist));
    }
  }

  return combine(ranges);
}

const p1Y = 2000000;
const beaconCountAtP1Y = new Set(reports.filter((r) => r.bY === p1Y).map((r) => r.bX)).size;
p(sum(buildRanges(reports, p1Y).map((r) => r.size)) - beaconCountAtP1Y);

// TODO: maybe optimize...
for (let y = 0; y < 4000000; y++) {
  const ranges = buildRanges(reports, y);
  if (ranges.length > 1) {
    p((ranges[0].max + 1) * 4000000 + y);
    break;
  }
}
