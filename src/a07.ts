import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a07.txt");

class Dir {
  readonly dirs: Record<string, Dir> = {};
  readonly files: Record<string, number> = {};

  constructor(readonly path: string, readonly parent?: Dir) {}

  cd(name: string): Dir | undefined {
    if (name === "..") {
      return this.parent;
    }
    if (name === "/") {
      if (!this.parent) {
        return this;
      } else {
        return this.parent.cd("/");
      }
    }
    return (this.dirs[name] ||= new Dir(this.path + name + "/", this));
  }

  getAllDirs(): Dir[] {
    const result: Dir[] = [];
    result.push(this);
    for (const child of Object.values(this.dirs)) {
      result.push(...child.getAllDirs());
    }

    return result;
  }

  getSize(): number {
    return sum(Object.values(this.files));
  }

  getTotalSize(): number {
    let result = this.getSize();
    for (const child of Object.values(this.dirs)) {
      result += child.getTotalSize();
    }
    return result;
  }
}

const root = new Dir("/");
let current = root;

for (const line of lines) {
  const [p1, p2, p3] = line.split(" ");
  if (p1 === "$") {
    if (p2 === "cd") {
      current = current.cd(p3)!;
    }
  } else {
    if (p1 !== "dir") {
      current.files[p2] = parseInt(p1);
    }
  }
}

p(
  sum(
    root
      .getAllDirs()
      .map((d) => d.getTotalSize())
      .filter((s) => s <= 100000)
  )
);

const required = 30000000 - (70000000 - root.getTotalSize());

p(
  root
    .getAllDirs()
    .map((d) => d.getTotalSize())
    .filter((s) => s >= required)
    .sort((a, b) => a - b)[0]
);
