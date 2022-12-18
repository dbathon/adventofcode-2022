import { dijkstraSearch, Neighbor, Node } from "./util/graphUtil";
import { p, readLines } from "./util/util";

const lines = readLines("input/a18.txt");

class Cube implements Node {
  constructor(readonly x: number, readonly y: number, readonly z: number) {}

  get nodeKey() {
    return this.x + "," + this.y + "," + this.z;
  }

  get neighbors() {
    return [
      new Cube(this.x + 1, this.y, this.z),
      new Cube(this.x - 1, this.y, this.z),
      new Cube(this.x, this.y + 1, this.z),
      new Cube(this.x, this.y - 1, this.z),
      new Cube(this.x, this.y, this.z + 1),
      new Cube(this.x, this.y, this.z - 1),
    ];
  }
}

const cubes = lines.map((line) => {
  const numbers: [number, number, number] = JSON.parse("[" + line + "]");
  return new Cube(...numbers);
});

const cubeKeys = new Set<string>(lines);

// cached results
const outsideKeys = new Set<string>();
const insideKeys = new Set<string>();

function isInside(cube: Cube): boolean {
  if (cubeKeys.has(cube.nodeKey) || insideKeys.has(cube.nodeKey)) {
    return true;
  }
  if (outsideKeys.has(cube.nodeKey)) {
    return false;
  }
  let result = true;
  const seenKeys: string[] = [];
  dijkstraSearch<Cube, void>(
    (current) => {
      const currentKey = current.nodeKey;
      seenKeys.push(currentKey);
      if (outsideKeys.has(currentKey) || (current.x === 0 && current.y === 0 && current.z === 0)) {
        // assume that 0,0,0 is not inside
        result = false;
        return null;
      }
      return current.neighbors.filter((n) => !cubeKeys.has(n.nodeKey)).map((n) => new Neighbor(n, 1, undefined));
    },
    cube,
    undefined
  );

  const toUpdate = result ? insideKeys : outsideKeys;
  seenKeys.forEach((k) => toUpdate.add(k));

  return result;
}

let part1Sides = cubes.length * 6;
let part2Sides = 0;
for (const cube of cubes) {
  for (const neighbor of cube.neighbors) {
    if (cubeKeys.has(neighbor.nodeKey)) {
      --part1Sides;
    }
    if (!isInside(neighbor)) {
      ++part2Sides;
    }
  }
}

p(part1Sides);
p(part2Sides);
