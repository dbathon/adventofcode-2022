import { p, readLines } from "./util/util";

class Range {
  constructor(readonly from: number, readonly to: number) {}

  contains(value: number) {
    return this.from <= value && value <= this.to;
  }

  containsCompletely(other: Range) {
    return this.contains(other.from) && this.contains(other.to);
  }

  overlaps(other: Range) {
    return this.contains(other.from) || this.contains(other.to) || other.contains(this.from);
  }
}

const rangePairs = readLines("input/a04.txt").map((line) =>
  line.split(",").map((r) => {
    const [from, to] = r.split("-");
    return new Range(parseInt(from), parseInt(to));
  })
);

p(rangePairs.filter((pair) => pair[0].containsCompletely(pair[1]) || pair[1].containsCompletely(pair[0])).length);

p(rangePairs.filter((pair) => pair[0].overlaps(pair[1])).length);
