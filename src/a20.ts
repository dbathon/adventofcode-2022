import { p, readLines } from "./util/util";

const lines = readLines("input/a20.txt");

class Node {
  public next: Node;
  public prev: Node;

  constructor(readonly value: number) {
    this.next = this.prev = this;
  }

  go(distance: number): Node {
    let result: Node = this;
    while (distance < 0) {
      result = result.prev;
      ++distance;
    }
    while (distance > 0) {
      result = result.next;
      --distance;
    }
    return result;
  }

  append(other: Node) {
    // first remove other from wherever it is
    other.prev.next = other.next;
    other.next.prev = other.prev;

    // and then insert after this
    const oldNext = this.next;
    this.next = other;
    other.prev = this;
    oldNext.prev = other;
    other.next = oldNext;
  }

  toArray(): Node[] {
    const result: Node[] = [this];
    for (let cur = this.next; cur !== this; cur = cur.next) {
      result.push(cur);
    }
    return result;
  }

  toValueArray(): number[] {
    return this.toArray().map((n) => n.value);
  }

  getGroveCoordinatesSum(): number {
    const a = this.go(1000);
    const b = a.go(1000);
    const c = b.go(1000);
    return a.value + b.value + c.value;
  }
}

function mix(nodes: Node[]) {
  const modulo = nodes.length - 1;
  for (const node of nodes) {
    const distance = node.value % modulo;
    if (distance !== 0) {
      node.go(distance < 0 ? distance - 1 : distance).append(node);
    }
  }
}

function buildNodes(multiplier = 1): Node[] {
  const nodes: Node[] = [];
  for (const line of lines) {
    const node = new Node(parseInt(line) * multiplier);
    nodes.at(-1)?.append(node);
    nodes.push(node);
  }
  return nodes;
}

const nodes1 = buildNodes();

mix(nodes1);
p(
  nodes1[0]
    .toArray()
    .find((n) => n.value === 0)
    ?.getGroveCoordinatesSum()
);

const nodes2 = buildNodes(811589153);

for (let i = 0; i < 10; i++) {
  mix(nodes2);
}

p(
  nodes2[0]
    .toArray()
    .find((n) => n.value === 0)
    ?.getGroveCoordinatesSum()
);
