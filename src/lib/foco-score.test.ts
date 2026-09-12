import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeScore,
  evaluate,
  parseScoreInput,
  VALIDATION_MESSAGE,
  verdictFor,
} from "./foco-score.ts";

describe("parseScoreInput", () => {
  it("accepts integers 1..10", () => {
    assert.equal(parseScoreInput("1"), 1);
    assert.equal(parseScoreInput("10"), 10);
    assert.equal(parseScoreInput(" 8 "), 8);
  });

  it("rejects empty, non-numeric, decimals and out of range", () => {
    assert.equal(parseScoreInput(""), null);
    assert.equal(parseScoreInput("   "), null);
    assert.equal(parseScoreInput("abc"), null);
    assert.equal(parseScoreInput("8.5"), null);
    assert.equal(parseScoreInput("1e2"), null);
    assert.equal(parseScoreInput("0"), null);
    assert.equal(parseScoreInput("11"), null);
    assert.equal(parseScoreInput("-1"), null);
    assert.equal(parseScoreInput("NaN"), null);
  });
});

describe("computeScore", () => {
  it("is impacto minus esfuerzo", () => {
    assert.equal(computeScore(8, 3), 5);
    assert.equal(computeScore(6, 5), 1);
    assert.equal(computeScore(2, 8), -6);
  });
});

describe("verdictFor", () => {
  it("HACER when score >= 3", () => {
    assert.equal(verdictFor(3), "HACER");
    assert.equal(verdictFor(5), "HACER");
    assert.equal(verdictFor(9), "HACER");
  });

  it("REVISAR when score is between -2 and 2 inclusive", () => {
    assert.equal(verdictFor(-2), "REVISAR");
    assert.equal(verdictFor(0), "REVISAR");
    assert.equal(verdictFor(1), "REVISAR");
    assert.equal(verdictFor(2), "REVISAR");
  });

  it("DESCARTAR when score <= -3", () => {
    assert.equal(verdictFor(-3), "DESCARTAR");
    assert.equal(verdictFor(-6), "DESCARTAR");
  });
});

describe("evaluate — required cases", () => {
  it("Impacto 8 / Esfuerzo 3 → score 5 → HACER", () => {
    assert.deepEqual(evaluate("8", "3"), {
      ok: true,
      score: 5,
      verdict: "HACER",
    });
  });

  it("Impacto 6 / Esfuerzo 5 → score 1 → REVISAR", () => {
    assert.deepEqual(evaluate("6", "5"), {
      ok: true,
      score: 1,
      verdict: "REVISAR",
    });
  });

  it("Impacto 2 / Esfuerzo 8 → score -6 → DESCARTAR", () => {
    assert.deepEqual(evaluate("2", "8"), {
      ok: true,
      score: -6,
      verdict: "DESCARTAR",
    });
  });

  it("does not produce NaN or a false result on invalid input", () => {
    for (const [impacto, esfuerzo] of [
      ["", "5"],
      ["8", ""],
      ["abc", "3"],
      ["8", "x"],
      ["0", "5"],
      ["11", "5"],
      ["8.2", "3"],
    ] as const) {
      const result = evaluate(impacto, esfuerzo);
      assert.equal(result.ok, false);
      if (result.ok === false) {
        assert.equal(result.error, VALIDATION_MESSAGE);
        assert.equal("score" in result, false);
        assert.equal("verdict" in result, false);
      }
    }
  });
});
