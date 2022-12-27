import { dijkstraSearch, Neighbor, Node } from "./util/graphUtil";
import { p, readLines } from "./util/util";

const lines = readLines("input/a24.txt");

const width = lines[0].length - 2;
const height = lines.length - 2;

class Blizzard {
  constructor(readonly x: number, readonly y: number, readonly xDir: number, readonly yDir: number) {}

  isAt(x: number, y: number, step: number): boolean {
    return (
      (((this.x + this.xDir * step) % width) + width) % width === x &&
      (((this.y + this.yDir * step) % height) + height) % height === y
    );
  }
}

class Location implements Node {
  constructor(readonly x: number, readonly y: number, readonly step: number) {}

  get nodeKey() {
    return `${this.x},${this.y},${this.step}`;
  }

  get nextLocations(): Location[] {
    const result = [new Location(this.x, this.y, this.step + 1)];
    if (this.y > 0) {
      result.push(new Location(this.x, this.y - 1, this.step + 1));
    }
    if (this.x > 0) {
      result.push(new Location(this.x - 1, this.y, this.step + 1));
    }
    if (this.y < height - 1) {
      result.push(new Location(this.x, this.y + 1, this.step + 1));
    }
    if (this.x < width - 1) {
      result.push(new Location(this.x + 1, this.y, this.step + 1));
    }
    return result;
  }
}

const rowBlizzards: (Blizzard[] | undefined)[] = [];
const colBlizzards: (Blizzard[] | undefined)[] = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const char = lines[y + 1][x + 1];
    if (char === "<") {
      (rowBlizzards[y] ||= []).push(new Blizzard(x, y, -1, 0));
    }
    if (char === ">") {
      (rowBlizzards[y] ||= []).push(new Blizzard(x, y, 1, 0));
    }
    if (char === "^") {
      (colBlizzards[x] ||= []).push(new Blizzard(x, y, 0, -1));
    }
    if (char === "v") {
      (colBlizzards[x] ||= []).push(new Blizzard(x, y, 0, 1));
    }
  }
}

function isFree(x: number, y: number, step: number): boolean {
  return !colBlizzards[x]?.find((b) => b.isAt(x, y, step)) && !rowBlizzards[y]?.find((b) => b.isAt(x, y, step));
}

function fewestSteps(x: number, y: number, xGoal: number, yGoal: number, startStep: number) {
  let step = startStep;
  while (!isFree(x, y, step)) {
    ++step;
  }
  dijkstraSearch<Location, void>(
    (location) => {
      if (location.x === xGoal && location.y === yGoal) {
        step = location.step;
        return null;
      }
      return location.nextLocations
        .filter((location) => isFree(location.x, location.y, location.step))
        .map((location) => new Neighbor(location, 1, undefined));
    },
    new Location(x, y, step),
    undefined
  );
  return step;
}

const stepsGoal1 = fewestSteps(0, 0, width - 1, height - 1, 1) + 1;
p(stepsGoal1);

const stepsBack = fewestSteps(width - 1, height - 1, 0, 0, stepsGoal1 + 1) + 1;

const stepsGoal2 = fewestSteps(0, 0, width - 1, height - 1, stepsBack + 1) + 1;
p(stepsGoal2);
