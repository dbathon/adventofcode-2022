import { p, readLines } from "./util/util";

const lines = readLines("input/a21.txt");

const funs1 = lines
  .map((line) => "function " + line.replaceAll(/\b([a-zA-Z]+)\b/g, "$1()").replace(":", " { return") + " };")
  .join("\n");

p(eval("(function() { " + funs1 + " return root(); })()"));

const funs2 = lines
  .map((line) => {
    if (line.startsWith("root:")) {
      line = line.replaceAll(/([+*/]+)/g, "-");
    } else if (line.startsWith("humn:")) {
      line = "humn: ___";
    }
    return "function " + line.replaceAll(/\b([a-zA-Z]+)\b/g, "$1()").replace(":", " { return") + " };";
  })
  .join("\n");

const part2Function = eval("(function(___) { " + funs2 + " return root(); })");

// first find a lower and upper bound
let lower = 1;
const startSign = Math.sign(part2Function(lower));
while (Math.sign(part2Function(lower)) === startSign) {
  lower *= 2;
}
let upper = lower;
lower /= 2;

// and then do a binary search
while (true) {
  const middle = Math.floor(lower + (upper - lower) / 2);
  const val = Math.sign(part2Function(middle));
  if (val === 0) {
    p(middle);
    break;
  }
  if (val === startSign) {
    lower = middle;
  } else {
    upper = middle;
  }
}
