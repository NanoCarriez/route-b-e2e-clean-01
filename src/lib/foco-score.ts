export const SCORE_MIN = 1;
export const SCORE_MAX = 10;

export type Verdict = "HACER" | "REVISAR" | "DESCARTAR";

export type Evaluation =
  | { ok: true; score: number; verdict: Verdict }
  | { ok: false; error: string };

export const VALIDATION_MESSAGE =
  "Usa solo enteros entre 1 y 10. No se aceptan vacíos, decimales ni textos.";

const INTEGER_RE = /^-?\d+$/;

export function parseScoreInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!INTEGER_RE.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < SCORE_MIN || value > SCORE_MAX) {
    return null;
  }
  return value;
}

export function computeScore(impacto: number, esfuerzo: number): number {
  return impacto - esfuerzo;
}

export function verdictFor(score: number): Verdict {
  if (score >= 3) return "HACER";
  if (score <= -3) return "DESCARTAR";
  return "REVISAR";
}

export function evaluate(impactoRaw: string, esfuerzoRaw: string): Evaluation {
  const impacto = parseScoreInput(impactoRaw);
  const esfuerzo = parseScoreInput(esfuerzoRaw);
  if (impacto === null || esfuerzo === null) {
    return { ok: false, error: VALIDATION_MESSAGE };
  }
  const score = computeScore(impacto, esfuerzo);
  if (!Number.isFinite(score)) {
    return { ok: false, error: VALIDATION_MESSAGE };
  }
  return { ok: true, score, verdict: verdictFor(score) };
}
