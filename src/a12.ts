import { dijkstraSearch, Neighbor } from "./util/graphUtil";
import { Map2D, Map2DNode } from "./util/map2D";
import { findMax, p, readLines } from "./util/util";

const lines = readLines("input/a12.txt");

const map = new Map2D<string>();
let start: Map2DNode<string> = map.getNode(0, 0);
lines.forEach((line, y) => {
  line.split("").forEach((letter, x) => {
    map.set(x, y, letter);
    if (letter === "S") {
      start = map.getNode(x, y);
    }
  });
});

function height(letter: string) {
  return letter === "S" ? "a" : letter === "E" ? "z" : letter;
}

function pathToELength(start: Map2DNode<string>): number | undefined {
  let result: number | undefined = undefined;
  dijkstraSearch<Map2DNode<string>, void>(
    (node, _, distance) => {
      if (!node.value || node.value === "E") {
        result = distance;
        return null;
      }
      return node.fourNeighbors
        .filter((n) => n.value && height(n.value).charCodeAt(0) - height(node.value!).charCodeAt(0) <= 1)
        .map((n) => {
          return new Neighbor(n, 1, undefined);
        });
    },
    start,
    undefined
  );
  return result;
}

p(pathToELength(start));

const pathLengths = map
  .getNodes()
  .filter((node) => node.value && height(node.value) === "a")
  .map((node) => pathToELength(node))
  .filter((node) => !!node) as number[];

p(pathLengths.sort((a, b) => a - b)[0]);
