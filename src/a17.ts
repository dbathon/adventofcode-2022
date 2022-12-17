import { p, readLines } from "./util/util";

const lines = readLines("input/a17.txt");

const directions = lines[0];

class Rock {
  constructor(readonly width: number, readonly rows: number[]) {}

  get height() {
    return this.rows.length;
  }
}

const ROCKS = [
  new Rock(4, [0b1111]),
  new Rock(3, [0b010, 0b111, 0b010]),
  new Rock(3, [0b001, 0b001, 0b111]),
  new Rock(1, [1, 1, 1, 1]),
  new Rock(2, [0b11, 0b11]),
];

// just hard code this...
const ROWS_FOR_CYCLE_CHECK = 20;

interface CycleInfo {
  length: number;
  heightDiff: number;
}

class Chamber {
  readonly rows: number[] = [];

  readonly lastSeen = new Map<string, [number, number]>();

  directionIndex = 0;

  constructor(readonly width: number) {}

  get height() {
    return this.rows.length;
  }

  intersects(rock: Rock, rockX: number, rockY: number): "wall" | "floor" | "rock" | undefined {
    if (rockX < 0 || rockX > this.width - rock.width) {
      return "wall";
    }
    for (let rockRow = 0; rockRow < rock.height; rockRow++) {
      const chamberRow = rockY - rockRow;
      if (chamberRow < 0) {
        return "floor";
      }
      if (chamberRow < this.rows.length) {
        const row = this.rows[chamberRow];
        const shiftedRockRow = rock.rows[rockRow] << (this.width - rock.width - rockX);
        if ((row & shiftedRockRow) > 0) {
          return "rock";
        }
      }
    }
    return undefined;
  }

  letRockFall(rockIteration: number): CycleInfo | undefined {
    let result: CycleInfo | undefined = undefined;
    const rockIndex = rockIteration % ROCKS.length;
    if (this.rows.length >= ROWS_FOR_CYCLE_CHECK) {
      const lastRows = this.rows.slice(this.rows.length - ROWS_FOR_CYCLE_CHECK);
      const key = rockIndex + "," + (this.directionIndex % directions.length) + "," + lastRows.join(",");
      const previous = this.lastSeen.get(key);
      if (previous) {
        result = {
          length: rockIteration - previous[0],
          heightDiff: this.height - previous[1],
        };
      }
      this.lastSeen.set(key, [rockIteration, this.height]);
    }

    let rock = ROCKS[rockIndex];
    let rockX = 2;
    let rockY = this.rows.length + 3 + (rock.height - 1);
    if (this.intersects(rock, rockX, rockY)) {
      throw new Error();
    }

    while (true) {
      const dir = directions[this.directionIndex++ % directions.length];
      if (dir === "<" && !this.intersects(rock, rockX - 1, rockY)) {
        rockX -= 1;
      } else if (dir === ">" && !this.intersects(rock, rockX + 1, rockY)) {
        rockX += 1;
      }

      if (!this.intersects(rock, rockX, rockY - 1)) {
        rockY -= 1;
      } else {
        break;
      }
    }

    // persist the rock
    for (let rockRow = 0; rockRow < rock.height; rockRow++) {
      const chamberRow = rockY - rockRow;
      if (chamberRow < 0) {
        throw new Error();
      }
      const shiftedRockRow = rock.rows[rockRow] << (this.width - rock.width - rockX);
      this.rows[chamberRow] = (this.rows[chamberRow] ?? 0) | shiftedRockRow;
    }

    return result;
  }

  draw() {
    return [...this.rows]
      .reverse()
      .map((row) => {
        let str = row.toString(2);
        while (str.length < this.width) {
          str = "0" + str;
        }
        return str.replaceAll("0", " ").replaceAll("1", "#");
      })
      .join("\n");
  }
}

const chamber = new Chamber(7);

for (let i = 0; ; i++) {
  const heightBefore = chamber.height;
  if (i === 2022) {
    p(heightBefore);
  }

  const info = chamber.letRockFall(i);

  if (i >= 2022 && info) {
    const remaining = 1000000000000 - i;
    if (remaining % info.length === 0) {
      p(heightBefore + info.heightDiff * (remaining / info.length));
      break;
    }
  }
}
