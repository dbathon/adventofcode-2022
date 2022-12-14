import { Map2D } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a14.txt");

type T = "#" | "o";

const map = new Map2D<T>();
map.originX = 500;

function draw(map: Map2D<T>, [x, y]: [number, number], [xTo, yTo]: [number, number]) {
  while (x !== xTo || y !== yTo) {
    map.set(x, y, "#");
    x += Math.sign(xTo - x);
    y += Math.sign(yTo - y);
    map.set(x, y, "#");
  }
}

for (const line of lines) {
  const coords: [number, number][] = JSON.parse("[[" + line.replaceAll(" -> ", "],[") + "]]");
  for (let i = 0; i < coords.length - 1; i++) {
    const element = coords[i];
    draw(map, coords[i], coords[i + 1]);
  }
}

function dropSand(map: Map2D<T>, [x, y]: [number, number], floor?: number): boolean {
  const lowest = map.originY + map.height + 1;
  let node = map.getNode(x, y);
  if (node.value) {
    return false;
  }
  while (true) {
    if (floor !== undefined && node.y + 1 === floor) {
      node.value = "o";
      return true;
    }
    const down = node.down;
    if (!down.value) {
      node = down;
    } else if (!down.left.value) {
      node = down.left;
    } else if (!down.right.value) {
      node = down.right;
    } else {
      node.value = "o";
      return true;
    }
    if (floor === undefined && node.y > lowest) {
      return false;
    }
  }
}

const part2Floor = map.originY + map.height + 1;

let cnt1 = 0;
const dropCoordinate: [number, number] = [500, 0];
while (dropSand(map, dropCoordinate)) {
  ++cnt1;
}
p(cnt1);

// clear the sand
map.forEachNode((node) => {
  if (node.value === "o") {
    node.value = undefined;
  }
});

let cnt2 = 0;
while (dropSand(map, dropCoordinate, part2Floor)) {
  ++cnt2;
}
p(cnt2);
