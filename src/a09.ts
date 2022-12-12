import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a09.txt");

type Direction = (node: Map2DNode<void>) => Map2DNode<void>;
const DIRECTIONS: Record<string, Direction> = {
  U: (node) => node.up,
  D: (node) => node.down,
  L: (node) => node.left,
  R: (node) => node.right,
};

const DIAGONAL_DIRECTIONS: Direction[] = [
  (node) => node.up.left,
  (node) => node.up.right,
  (node) => node.down.left,
  (node) => node.down.right,
];

function isOnAny(node: Map2DNode<void>, candidates: Map2DNode<void>[]): boolean {
  return candidates.find((candidate) => candidate.nodeKey === node.nodeKey) !== undefined;
}

function moveTail(head: Map2DNode<void>, tail: Map2DNode<void>): Map2DNode<void> {
  if (isOnAny(tail, [head, ...head.eightNeighbors])) {
    return tail;
  } else {
    // tail needs to move
    if (head.x === tail.x || head.y === tail.y) {
      for (const candidate of tail.fourNeighbors) {
        if (isOnAny(candidate, head.fourNeighbors)) {
          return candidate;
        }
      }
    } else {
      for (const candidate of DIAGONAL_DIRECTIONS.map((direction) => direction(tail))) {
        if (isOnAny(candidate, head.eightNeighbors)) {
          return candidate;
        }
      }
    }
    throw new Error("moveTail failed: " + head.nodeKey + " " + tail.nodeKey);
  }
}

class Rope {
  readonly map = new Map2D<void>();
  head = this.map.getNode(0, 0);
  readonly tailNodes: Map2DNode<void>[] = [];
  readonly lastTailPositions = new Set<string>();

  constructor(tailCount: number) {
    for (let i = 0; i < tailCount; i++) {
      this.tailNodes.push(this.head);
    }
    this.lastTailPositions.add(this.head.nodeKey);
  }

  moveHead(direction: Direction) {
    let prev = (this.head = direction(this.head));
    this.tailNodes.forEach((tail, i) => {
      prev = this.tailNodes[i] = moveTail(prev, tail);
    });
    this.lastTailPositions.add(this.tailNodes[this.tailNodes.length - 1].nodeKey);
  }

  execute(lines: string[]) {
    for (const line of lines) {
      const [dirName, countStr] = line.split(" ");
      const direction = DIRECTIONS[dirName];
      const count = parseInt(countStr);
      for (let i = 0; i < count; i++) {
        this.moveHead(direction);
      }
    }
  }
}

for (const length of [1, 9]) {
  const rope = new Rope(length);
  rope.execute(lines);
  p(rope.lastTailPositions.size);
}
