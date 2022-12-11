import { p, readLines } from "./util/util";

const lines = readLines("input/a11.txt");

class Monkey {
  items: number[] = [];

  inspectCount = 0;

  constructor(
    readonly operation: (old: number) => number,
    readonly testDivisor: number,
    readonly trueMonkeyIndex: number,
    readonly falseMonkeyIndex: number
  ) {}
}

function buildMonkeys(lines: string[]): Monkey[] {
  let items: number[] = [];
  let operation: (old: number) => number = (old) => old;
  let testDivisor = 1;
  let trueMonkeyIndex = 0;
  let falseMonkeyIndex = 0;
  const result: Monkey[] = [];
  // iterate in reverse to get monkey lines last
  for (const line of [...lines].reverse()) {
    const [key, value] = line.split(":");
    if (key.startsWith("Monkey ")) {
      const monkey = new Monkey(operation, testDivisor, trueMonkeyIndex, falseMonkeyIndex);
      monkey.items = items;
      result[parseInt(key.split(" ")[1])] = monkey;
    } else if (key === "Starting items") {
      items = value
        .trim()
        .split(",")
        .map((e) => parseInt(e.trim()));
    } else if (key === "Operation") {
      const opParts = value.split("=")[1].trim().split(" ");
      let part2: (old: number) => number;
      if (opParts[2] === "old") {
        part2 = (old) => old;
      } else {
        const num = parseInt(opParts[2]);
        part2 = (old) => num;
      }
      operation = opParts[1] === "+" ? (old) => old + part2(old) : (old) => old * part2(old);
    } else if (key === "Test") {
      testDivisor = parseInt(value.trim().split(" ")[2]);
    } else if (key === "If true") {
      trueMonkeyIndex = parseInt(value.trim().split(" ")[3]);
    } else if (key === "If false") {
      falseMonkeyIndex = parseInt(value.trim().split(" ")[3]);
    }
  }

  return result;
}

function doRounds(monkeys: Monkey[], count: number, relieveFunction: (worry: number) => number) {
  for (let i = 0; i < count; i++) {
    for (const monkey of monkeys) {
      for (const itemWorry of monkey.items) {
        const newWorry = relieveFunction(monkey.operation(itemWorry));
        const targetIndex = newWorry % monkey.testDivisor === 0 ? monkey.trueMonkeyIndex : monkey.falseMonkeyIndex;
        monkeys[targetIndex].items.push(newWorry);
        ++monkey.inspectCount;
      }
      monkey.items.length = 0;
    }
  }
}

function calculateMonkeyBusiness(monkeys: Monkey[]) {
  const sortedCounts = monkeys.map((monkey) => monkey.inspectCount).sort((a, b) => b - a);
  return sortedCounts[0] * sortedCounts[1];
}

{
  const monkeys = buildMonkeys(lines);
  const relieveFunction1 = (worry: number) => Math.floor(worry / 3);
  doRounds(monkeys, 20, relieveFunction1);
  p(calculateMonkeyBusiness(monkeys));
}

{
  const monkeys = buildMonkeys(lines);
  const divisor = monkeys.map((monkey) => monkey.testDivisor).reduce((a, b) => a * b, 1);
  const relieveFunction2 = (worry: number) => worry % divisor;
  doRounds(monkeys, 10000, relieveFunction2);
  p(calculateMonkeyBusiness(monkeys));
}
