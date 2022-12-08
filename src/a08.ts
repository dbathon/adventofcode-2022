import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a08.txt");

class Tree {
  constructor(readonly height: number) {}
}

const map = new Map2D<Tree>();

lines.forEach((line, y) => {
  line.split("").forEach((digit, x) => {
    map.set(x, y, new Tree(parseInt(digit)));
  });
});

type Direction = (node: Map2DNode<Tree>) => Map2DNode<Tree>;
const directions: Direction[] = [
  (node) => node.getUp(),
  (node) => node.getDown(),
  (node) => node.getLeft(),
  (node) => node.getRight(),
];

function getTreesInDirection(node: Map2DNode<Tree>, direction: Direction): Tree[] {
  const result: Tree[] = [];
  while (node.value) {
    node = direction(node);
    if (node.value) {
      result.push(node.value);
    }
  }
  return result;
}

let countVisible = 0;
let bestScore = 0;
map.forEachNode((node) => {
  const tree = node.value;
  if (tree) {
    let visible = false;
    let score = 1;

    for (const direction of directions) {
      const trees = getTreesInDirection(node, direction);
      if (!visible && !trees.find((otherTree) => otherTree.height >= tree.height)) {
        visible = true;
      }

      let distance = 0;
      for (const otherTree of trees) {
        ++distance;
        if (otherTree.height >= tree.height) {
          break;
        }
      }
      score *= distance;
    }

    if (visible) {
      countVisible += 1;
    }
    if (score > bestScore) {
      bestScore = score;
    }
  }
});

p(countVisible);
p(bestScore);
