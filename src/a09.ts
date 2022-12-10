import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a09.txt");

type Direction = (node: Map2DNode<void>) => Map2DNode<void>;
const DIRECTIONS: Record<string, Direction> = {
  U: (node) => node.getUp(),
  D: (node) => node.getDown(),
  L: (node) => node.getLeft(),
  R: (node) => node.getRight(),
};

function isOnAny(node: Map2DNode<void>, candidates: Map2DNode<void>[]): boolean {
  return candidates.find((candidate) => candidate.getNodeKey() === node.getNodeKey()) !== undefined;
}

function moveTail(head: Map2DNode<void>, tail: Map2DNode<void>): Map2DNode<void> {
  if (isOnAny(tail, [head, ...head.get8Neighbors()])) {
    return tail;
  } else {
    // tail needs to move
    for (const candidate of tail.get8Neighbors()) {
      if (isOnAny(candidate, [head, ...head.get4Neighbors()])) {
        return candidate;
      }
    }
    // if we could not move to one of the 4 direct neighbors, then try moving the diagonal neighbors
    for (const candidate of tail.get8Neighbors()) {
      if (isOnAny(candidate, [head, ...head.get8Neighbors()])) {
        return candidate;
      }
    }
    throw new Error("moveTail failed: " + head.getNodeKey() + " " + tail.getNodeKey());
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
    this.lastTailPositions.add(this.head.getNodeKey());
  }

  moveHead(direction: Direction) {
    let prev = (this.head = direction(this.head));
    this.tailNodes.forEach((tail, i) => {
      prev = this.tailNodes[i] = moveTail(prev, tail);
    });
    this.lastTailPositions.add(this.tailNodes[this.tailNodes.length - 1].getNodeKey());
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
