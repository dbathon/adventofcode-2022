import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a02.txt").map((line) => line.split(" "));

const WINS = ["AB", "BC", "CA"];

const BASE_SCORE: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
};

const OPTIONS = Object.keys(BASE_SCORE);

const CIPHER1: Record<string, string> = {
  X: "A",
  Y: "B",
  Z: "C",
};

const CIPHER2: Record<string, number> = {
  X: 0,
  Y: 3,
  Z: 6,
};

function winDrawLoseScore(game: string) {
  if (WINS.includes(game)) {
    return 6;
  } else if (WINS.includes(game[1] + game[0])) {
    return 0;
  } else {
    return 3;
  }
}

function score(game: string) {
  return BASE_SCORE[game[1]] + winDrawLoseScore(game);
}

p(sum(lines.map((line) => score(line[0] + CIPHER1[line[1]]))));

p(
  sum(
    lines
      .map((line) => line[0] + OPTIONS.find((option) => winDrawLoseScore(line[0] + option) === CIPHER2[line[1]])!)
      .map(score)
  )
);
