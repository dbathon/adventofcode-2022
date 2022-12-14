import { Map2D } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a14.txt");

type T = "#" | "o";

const map = new Map2D<T>();

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

function dropSand(map: Map2D<T>, [x, y]: [number, number], floor?: number): number {
  const lowest = map.originY + map.height + 1;
  let count = 0;

  let stack = [map.getNode(x, y)];
  while (stack.length) {
    let node = stack[stack.length - 1];
    if (node.value) {
      stack.pop();
      continue;
    }
    while (true) {
      if (floor !== undefined) {
        if (node.y + 1 === floor) {
          node.value = "o";
          ++count;
          break;
        }
      } else if (node.y > lowest) {
        return count;
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
        ++count;
        break;
      }

      stack.push(node);
    }
  }
  return count;
}

const part2Floor = map.originY + map.height + 1;

const dropCoordinate: [number, number] = [500, 0];
p(dropSand(map, dropCoordinate));

// clear the sand
map.forEachNode((node) => {
  if (node.value === "o") {
    node.value = undefined;
  }
});

p(dropSand(map, dropCoordinate, part2Floor));
