import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a22.txt", false);

type Tile = "." | "#";

const map = new Map2D<Tile>();

lines.forEach((line, y) => {
  if (line.includes(".") || line.includes("#")) {
    line.split("").forEach((tile, x) => {
      if (tile === "." || tile === "#") {
        map.set(x, y, tile);
      }
    });
  }
});

type Direction = 0 | 1 | 2 | 3;
type TurnDirection = "R" | "L";

function turn(direction: Direction, turnDirection: TurnDirection): Direction {
  return ((direction + (turnDirection === "R" ? 1 : 3)) % 4) as Direction;
}

type PathPart = number | TurnDirection;

function parsePath(pathString: string): PathPart[] {
  const result: PathPart[] = [];
  let current = "";
  [...pathString.matchAll(/R|L|[0-9]+/g)]
    .map((part) => part[0])
    .forEach((part) => {
      if (part === "R" || part === "L") {
        result.push(part);
      } else {
        result.push(parseInt(part));
      }
    });
  return result;
}

const path = parsePath(lines.at(-1)!);

const SIMPLE_DIRECTIONS = [
  (node: Map2DNode<Tile>) => node.right,
  (node: Map2DNode<Tile>) => node.down,
  (node: Map2DNode<Tile>) => node.left,
  (node: Map2DNode<Tile>) => node.up,
];

type DirectionFunction = (node: Map2DNode<Tile>, direction: Direction) => [Map2DNode<Tile>, Direction];

const part1Direction: DirectionFunction = (node, direction) => {
  if (!node.value) {
    throw new Error("not on a tile");
  }
  const next = SIMPLE_DIRECTIONS[direction](node);
  if (next.value) {
    return [next, direction];
  }
  // we need to wrap -> walk in the opposite direction
  const reverse = turn(turn(direction, "R"), "R");
  let cur: Map2DNode<Tile> = node;
  while (true) {
    const prev = SIMPLE_DIRECTIONS[reverse](cur);
    if (!prev.value) {
      return [cur, direction];
    }
    cur = prev;
  }
};

function findTopLeft(map: Map2D<Tile>): Map2DNode<Tile> {
  let cur = map.getNode(0, 0);
  while (!cur.value) {
    cur = cur.right;
  }
  return cur;
}

function walkPath(map: Map2D<Tile>, path: PathPart[], directionFunction: DirectionFunction): number {
  let direction: Direction = 0;
  let cur = findTopLeft(map);
  for (const pathPart of path) {
    if (pathPart === "R" || pathPart === "L") {
      direction = turn(direction, pathPart);
    } else {
      for (let i = 0; i < pathPart; i++) {
        const [next, newDirection] = directionFunction(cur, direction);
        if (next.value === "#") {
          break;
        }
        cur = next;
        direction = newDirection;
      }
    }
  }

  return 1000 * (cur.y + 1) + 4 * (cur.x + 1) + direction;
}

p(walkPath(map, path, part1Direction));

function fillEdgeMap(
  edgeMap: Map<string, [Map2DNode<Tile>, Direction]>,
  corner: Map2DNode<Tile>,
  forwardDirection: Direction,
  reverseDirection: Direction
): void {
  let forward = SIMPLE_DIRECTIONS[forwardDirection](corner);
  let reverse = SIMPLE_DIRECTIONS[reverseDirection](corner);
  let directionDiff = 1;
  while (true) {
    edgeMap.set(forward.nodeKey + "-" + turn(forwardDirection, "L"), [reverse, turn(reverseDirection, "L")]);
    edgeMap.set(reverse.nodeKey + "-" + turn(reverseDirection, "R"), [forward, turn(forwardDirection, "R")]);

    let forwardNext = SIMPLE_DIRECTIONS[forwardDirection](forward);
    let reverseNext = SIMPLE_DIRECTIONS[reverseDirection](reverse);

    if (!forwardNext.value) {
      if (!reverseNext.value) {
        // two outside corners
        return;
      }
      forwardNext = forward;
      forwardDirection = turn(forwardDirection, "R");
    } else if (!reverseNext.value) {
      reverseNext = reverse;
      reverseDirection = turn(reverseDirection, "L");
    }

    forward = forwardNext;
    reverse = reverseNext;
  }
}

function buildEdgeMap(map: Map2D<Tile>): Map<string, [Map2DNode<Tile>, Direction]> {
  let cur = findTopLeft(map);
  const startNodeKey = cur.nodeKey;
  let direction: Direction = 0;

  const result = new Map<string, [Map2DNode<Tile>, Direction]>();

  // find the inside corners clockwise
  while (true) {
    const cornerDirection = turn(direction, "L");
    const cornerNext = SIMPLE_DIRECTIONS[cornerDirection](cur);
    if (cornerNext.value) {
      // we found a corner
      fillEdgeMap(result, cur, cornerDirection, turn(cornerDirection, "L"));
      direction = cornerDirection;
    }
    const next = SIMPLE_DIRECTIONS[direction](cur);
    if (next.value) {
      cur = next;
    } else {
      direction = turn(direction, "R");
    }
    if (cur.nodeKey === startNodeKey) {
      break;
    }
  }

  return result;
}

const edgeMap = buildEdgeMap(map);

const part2Direction: DirectionFunction = (node, direction) => {
  if (!node.value) {
    throw new Error("not on a tile");
  }
  const next = SIMPLE_DIRECTIONS[direction](node);
  if (next.value) {
    return [next, direction];
  }

  const result = edgeMap.get(node.nodeKey + "-" + direction);
  if (!result) {
    throw new Error();
  }
  return result;
};

p(walkPath(map, path, part2Direction));
