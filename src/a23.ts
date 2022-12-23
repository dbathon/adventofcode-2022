import { p, readLines } from "./util/util";

const lines = readLines("input/a23.txt");

type Point = [number, number];

function toStr(point: Point): string {
  return point[0] + "," + point[1];
}

function fromStr(pointStr: string): Point {
  const [x, y] = pointStr.split(",");
  return [parseInt(x), parseInt(y)];
}

let points = new Set<string>();

lines.forEach((line, y) => {
  line.split("").forEach((tile, x) => {
    if (tile === "#") {
      points.add(toStr([x, y]));
    }
  });
});

type StepFunction = (point: Point, allPoints: Set<string>) => Point | undefined;

const STEP_FUNCTIONS: StepFunction[] = [
  (point, allPoints) => {
    const [x, y] = point;
    if (
      !allPoints.has(toStr([x, y - 1])) &&
      !allPoints.has(toStr([x - 1, y - 1])) &&
      !allPoints.has(toStr([x + 1, y - 1]))
    ) {
      return [x, y - 1];
    }
    return undefined;
  },
  (point, allPoints) => {
    const [x, y] = point;
    if (
      !allPoints.has(toStr([x, y + 1])) &&
      !allPoints.has(toStr([x - 1, y + 1])) &&
      !allPoints.has(toStr([x + 1, y + 1]))
    ) {
      return [x, y + 1];
    }
    return undefined;
  },
  (point, allPoints) => {
    const [x, y] = point;
    if (
      !allPoints.has(toStr([x - 1, y])) &&
      !allPoints.has(toStr([x - 1, y - 1])) &&
      !allPoints.has(toStr([x - 1, y + 1]))
    ) {
      return [x - 1, y];
    }
    return undefined;
  },
  (point, allPoints) => {
    const [x, y] = point;
    if (
      !allPoints.has(toStr([x + 1, y])) &&
      !allPoints.has(toStr([x + 1, y - 1])) &&
      !allPoints.has(toStr([x + 1, y + 1]))
    ) {
      return [x + 1, y];
    }
    return undefined;
  },
];

function hasNeighbor(point: Point, allPoints: Set<string>): boolean {
  const [x, y] = point;
  const neighbors: Point[] = [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];
  return !!neighbors.find((p) => allPoints.has(toStr(p)));
}

function doStep(allPoints: Set<string>, stepFunctionOffset: number): { newPoints: Set<string>; changed: boolean } {
  const newPoints = new Set<string>();
  const proposals: Record<string, Point[]> = {};
  let changed = false;
  // first half
  pointLoop: for (const point of [...allPoints].map(fromStr)) {
    if (hasNeighbor(point, allPoints)) {
      for (let i = 0; i < STEP_FUNCTIONS.length; i++) {
        const newPoint = STEP_FUNCTIONS[(i + stepFunctionOffset) % STEP_FUNCTIONS.length](point, allPoints);
        if (newPoint) {
          (proposals[toStr(newPoint)] ||= []).push(point);
          continue pointLoop;
        }
      }
    }
    // will stay where it is
    newPoints.add(toStr(point));
  }

  // second half
  for (const [pointStr, points] of Object.entries(proposals)) {
    if (points.length === 1) {
      changed = true;
      newPoints.add(pointStr);
    } else {
      // readd all the old points
      points.forEach((p) => newPoints.add(toStr(p)));
    }
  }

  return { newPoints, changed };
}

function emptyTiles(allPoints: Set<string>): number {
  let minX: number | undefined = undefined;
  let minY: number | undefined = undefined;
  let maxX: number | undefined = undefined;
  let maxY: number | undefined = undefined;
  allPoints.forEach((point) => {
    const [x, y] = fromStr(point);
    minX = Math.min(x, minX ?? x);
    minY = Math.min(y, minY ?? y);
    maxX = Math.max(x, maxX ?? x);
    maxY = Math.max(y, maxY ?? y);
  });
  return (maxX! - minX! + 1) * (maxY! - minY! + 1) - allPoints.size;
}

for (let i = 0; ; i++) {
  const { newPoints, changed } = doStep(points, i);
  if (!changed) {
    p(i + 1);
    break;
  }
  points = newPoints;
  if (i == 9) {
    p(emptyTiles(points));
  }
}
