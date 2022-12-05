import { p, readLines } from "./util/util";

const lines = readLines("input/a05.txt", false, true);

const stackLines: string[] = [];

interface Move {
  count: number;
  from: string;
  to: string;
}

const moves: Move[] = [];

const stacks: Record<string, string[]> = {};

for (const line of lines) {
  if (line.includes("[")) {
    stackLines.push(line);
  } else if (line.startsWith("move")) {
    const parts = line.split(" ");
    moves.push({
      count: parseInt(parts[1]),
      from: parts[3],
      to: parts[5],
    });
  } else {
    if (Object.keys(stacks).length) {
      throw new Error("stacks already initialized");
    }
    const reversedStackLines = [...stackLines].reverse();
    for (let i = 0; i < line.length; i++) {
      const name = line[i];
      if (name.trim().length) {
        const stack: string[] = [];
        for (const stackLine of reversedStackLines) {
          const item = stackLine[i];
          if (item && item.trim().length) {
            stack.push(item);
          }
        }
        stacks[name] = stack;
      }
    }
  }
}

const stacks2: Record<string, string[]> = JSON.parse(JSON.stringify(stacks));

for (const move of moves) {
  for (let i = 0; i < move.count; i++) {
    stacks[move.to].push(stacks[move.from].pop()!);
  }
}

function topItems(stacks: Record<string, string[]>): any {
  return Object.keys(stacks)
    .map((key) => stacks[key])
    .map((stack) => stack[stack.length - 1])
    .join("");
}

p(topItems(stacks));

for (const move of moves) {
  const fromStack = stacks2[move.from];
  stacks2[move.to].push(...fromStack.slice(fromStack.length - move.count));
  fromStack.length -= move.count;
}

p(topItems(stacks2));
