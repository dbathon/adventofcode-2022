import { p, readLines } from "./util/util";

const lines = readLines("input/a10.txt");

class Screen {
  value = 1;
  cycle = 0;

  strengthSum = 0;

  screenLines: string[][] = [[]];

  doCycle() {
    ++this.cycle;

    if (this.cycle <= 220 && (this.cycle - 20) % 40 === 0) {
      this.strengthSum += this.cycle * this.value;
    }

    let line = this.screenLines[this.screenLines.length - 1];
    if (line.length >= 40) {
      line = [];
      this.screenLines.push(line);
    }
    let posX = this.cycle % 40;
    if (posX === 0) {
      posX = 40;
    }
    line.push(this.value <= posX && posX <= this.value + 2 ? "#" : ".");
  }

  add(val: number) {
    this.value += val;
  }
}

const screen = new Screen();
for (const line of lines) {
  const [command, arg] = line.split(" ");
  if (command === "noop") {
    screen.doCycle();
  } else if (command === "addx") {
    screen.doCycle();
    screen.doCycle();
    screen.add(parseInt(arg));
  }
}

p(screen.strengthSum);

p(screen.screenLines.map((l) => l.join("")).join("\n"));
