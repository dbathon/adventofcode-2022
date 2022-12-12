import { dijkstraSearch, Neighbor } from "./util/graphUtil";
import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a12.txt");

const map = new Map2D<string>();
lines.forEach((line, y) => {
  line.split("").forEach((letter, x) => {
    map.set(x, y, letter);
  });
});

function height(letter: string) {
  return letter === "S" ? "a" : letter === "E" ? "z" : letter;
}

type Node = Map2DNode<string>;

function pathLength(
  start: Node,
  goalPredicate: (node: Node) => unknown,
  neighborPredicate: (node: Node, neighbor: Node) => unknown
): number | undefined {
  let result: number | undefined = undefined;
  dijkstraSearch<Node, void>(
    (node, _, distance) => {
      if (goalPredicate(node)) {
        result = distance;
        return null;
      }
      return node.fourNeighbors
        .filter((n) => neighborPredicate(node, n))
        .map((n) => {
          return new Neighbor(n, 1, undefined);
        });
    },
    start,
    undefined
  );
  return result;
}

p(
  pathLength(
    map.getNodes().find((node) => node.value === "S")!,
    (node) => node.value === "E",
    (node, neighbor) =>
      node.value && neighbor.value && height(neighbor.value).charCodeAt(0) - height(node.value).charCodeAt(0) <= 1
  )
);

p(
  pathLength(
    map.getNodes().find((node) => node.value === "E")!,
    (node) => node.value && height(node.value) === "a",
    (node, neighbor) =>
      node.value && neighbor.value && height(neighbor.value).charCodeAt(0) - height(node.value).charCodeAt(0) >= -1
  )
);
