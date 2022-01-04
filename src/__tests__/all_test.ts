import { MathChecker } from "../MathChecker";
const textLst = [
  "this \\$$\\text{is}$ a test", // 0
  "and it is fun, we use `$$` for block equations", // 1
  "hell yeah", // 2
  "$$", // 3
  "\\dfrac{1}{2}f(x)dx", // 4
  "$$", // 5
  "The line above is a $\\latex$ formula, and it basically says that the function $f(x)$ is a function of $x$.", // 6,
  "```", // 7
  "$$", // 8
  "\\dfrac{1}{2}f(x)dx", // 9
  "$$", // 10
  "```", // 11
  "$ab$" // 12
];

test("Test Initializing Math Checker", () => {
  let checker = new MathChecker.MathChecker(0, 0, textLst);
  expect(checker.cp).toBe(0);
  expect(checker.cln).toBe(0);
  // expect(checker.textLst).toEqual(textLst);
});

test("Test GetLine", () => {
  let checker = new MathChecker.MathChecker(0, 0, textLst);
  expect(checker.getLineStr()).toBe("this ¡¡$\\text{is}$ a test");
});

test("Test GetChar", () => {
  let checker = new MathChecker.MathChecker(1, 1, textLst);
  expect(checker.getCharStr()).toBe("n");
});

test("Check Block", () => {
  let checker = new MathChecker.MathChecker(1, 1, textLst);
  expect(checker.checkBlock("$$")).toBe(false);
  checker = new MathChecker.MathChecker(4, 4, textLst);
  expect(checker.checkBlock("$$")).toBe(true);
});

test("Check Block Math", () => {
  let checker = new MathChecker.MathChecker(1, 1, textLst);
  expect(checker.checkBlockMath()).toBe(false);
  checker = new MathChecker.MathChecker(4, 4, textLst);
  expect(checker.checkBlockMath()).toBe(true);
  checker = new MathChecker.MathChecker(9, 9, textLst);
  expect(checker.checkBlockMath()).toBe(false);
  expect(checker.checkBlock("```")).toBe(true);
});

test("Check Inline Math", () => {
  let checker = new MathChecker.MathChecker(0, 10, textLst);
  console.log(checker.textLst[0], checker.textLst[0][10]);
  expect(checker.checkInlineMath()).toBe(true);
  checker = new MathChecker.MathChecker(1, 4, textLst);
  expect(checker.checkInlineMath()).toBe(false);
  checker = new MathChecker.MathChecker(12, 2, textLst);
  expect(checker.checkInlineMath()).toBe(true);
});
