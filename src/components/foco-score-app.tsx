import { useEffect, useId, useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  evaluate,
  parseScoreInput,
  SCORE_MAX,
  SCORE_MIN,
  type Evaluation,
  type Verdict,
} from "@/lib/foco-score";
import { cn } from "@/lib/utils";

const QA_MARKER = "ROUTE_B_E2E_CLEAN_01";

const VERDICT_COPY: Record<
  Verdict,
  { hint: string; className: string; badge: string }
> = {
  HACER: {
    hint: "Alto impacto relativo al esfuerzo. Vale la pena hacerlo.",
    className: "border-hacer/30 bg-hacer-bg text-hacer",
    badge: "bg-hacer text-primary-fg",
  },
  REVISAR: {
    hint: "El balance es estrecho. Revisa alcance, costo o impacto.",
    className: "border-revisar/30 bg-revisar-bg text-revisar",
    badge: "bg-revisar text-primary-fg",
  },
  DESCARTAR: {
    hint: "El esfuerzo pesa más que el impacto. Mejor no avanzar.",
    className: "border-descartar/30 bg-descartar-bg text-descartar",
    badge: "bg-descartar text-primary-fg",
  },
};

function clampScore(value: number): number {
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
}

function stepValue(raw: string, delta: number): string {
  const current = parseScoreInput(raw);
  const next = clampScore((current ?? (delta > 0 ? 0 : 1)) + delta);
  return String(next);
}

export function FocoScoreApp() {
  const impactoId = useId();
  const esfuerzoId = useId();
  const errorId = useId();
  const [impacto, setImpacto] = useState("");
  const [esfuerzo, setEsfuerzo] = useState("");
  const [result, setResult] = useState<Evaluation | null>(null);

  useEffect(() => {
    if (!result) return;
    document.getElementById("foco-outcome")?.scrollIntoView({ block: "nearest" });
  }, [result]);

  function clearResult() {
    setResult(null);
  }

  function handleCalcular() {
    const next = evaluate(impacto, esfuerzo);
    setResult(next);
  }

  function handleLimpiar() {
    setImpacto("");
    setEsfuerzo("");
    setResult(null);
  }

  const error = result && result.ok === false ? result.error : null;
  const success = result && result.ok === true ? result : null;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-6 sm:py-10">
      <header className="mb-5">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          MiniApp
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-fg">
          FocoScore
        </h1>
        <p className="mt-2 max-w-[32ch] text-base text-muted">
          Decide si una idea o tarea vale la pena según Impacto y Esfuerzo.
        </p>
      </header>

      <form
        className="rounded-xl border border-border bg-surface p-4 shadow-panel"
        onSubmit={(event) => {
          event.preventDefault();
          handleCalcular();
        }}
        noValidate
      >
        <div className="flex flex-col gap-4">
          <ScoreField
            id={impactoId}
            label="Impacto"
            value={impacto}
            invalid={Boolean(error)}
            describedBy={error ? errorId : undefined}
            onChange={(value) => {
              setImpacto(value);
              clearResult();
            }}
          />
          <ScoreField
            id={esfuerzoId}
            label="Esfuerzo"
            value={esfuerzo}
            invalid={Boolean(error)}
            describedBy={error ? errorId : undefined}
            onChange={(value) => {
              setEsfuerzo(value);
              clearResult();
            }}
          />
        </div>

        <p className="mt-3 text-sm text-muted">
          score = Impacto − Esfuerzo · enteros {SCORE_MIN}–{SCORE_MAX}
        </p>

        <div className="mt-4">
          <Button type="submit" data-testid="btn-calcular">
            Calcular
          </Button>
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            data-testid="validation-message"
            className="mt-3 rounded-md border border-descartar/25 bg-descartar-bg px-3 py-3 text-sm text-error"
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <section
            id="foco-outcome"
            aria-live="polite"
            className="mt-3 rounded-lg border border-border bg-bg p-3"
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
                  Score
                </p>
                <p
                  data-testid="score-value"
                  className="mt-1 font-display text-5xl font-semibold leading-none tracking-tight tabular-nums text-fg"
                >
                  {success.score}
                </p>
              </div>
              <p
                data-testid="score-verdict"
                className={cn(
                  "mb-1 inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold tracking-[0.14em]",
                  VERDICT_COPY[success.verdict].badge,
                )}
              >
                {success.verdict}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted">{VERDICT_COPY[success.verdict].hint}</p>
          </section>
        ) : null}

        <div className="mt-3">
          <Button
            type="button"
            variant="ghost"
            data-testid="btn-limpiar"
            onClick={handleLimpiar}
          >
            Limpiar
          </Button>
        </div>
      </form>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        <LegendChip label="HACER" rule="≥ 3" tone="hacer" />
        <LegendChip label="REVISAR" rule="−2 a 2" tone="revisar" />
        <LegendChip label="DESCARTAR" rule="≤ −3" tone="descartar" />
      </dl>

      <p
        data-qa-marker={QA_MARKER}
        className="mt-6 text-center text-[11px] tracking-wide text-subtle"
      >
        {QA_MARKER}
      </p>
    </main>
  );
}

function ScoreField({
  id,
  label,
  value,
  invalid,
  describedBy,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  invalid: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-xs text-subtle">1–10</span>
      </div>
      <div className="flex items-center gap-2">
        <StepperButton
          label={`Bajar ${label}`}
          onClick={() => onChange(stepValue(value, -1))}
        >
          <Minus className="size-4" strokeWidth={2} />
        </StepperButton>
        <Input
          id={id}
          name={label.toLowerCase()}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          placeholder="—"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          data-testid={`input-${label.toLowerCase()}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <StepperButton
          label={`Subir ${label}`}
          onClick={() => onChange(stepValue(value, 1))}
        >
          <Plus className="size-4" strokeWidth={2} />
        </StepperButton>
      </div>
    </div>
  );
}

function StepperButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-12 min-h-12 min-w-12 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-fg transition-colors duration-150 hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function LegendChip({
  label,
  rule,
  tone,
}: {
  label: string;
  rule: string;
  tone: "hacer" | "revisar" | "descartar";
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-2 py-2",
        tone === "hacer" && "border-hacer/20 bg-hacer-bg",
        tone === "revisar" && "border-revisar/20 bg-revisar-bg",
        tone === "descartar" && "border-descartar/20 bg-descartar-bg",
      )}
    >
      <dt
        className={cn(
          "text-[10px] font-semibold tracking-[0.12em]",
          tone === "hacer" && "text-hacer",
          tone === "revisar" && "text-revisar",
          tone === "descartar" && "text-descartar",
        )}
      >
        {label}
      </dt>
      <dd className="mt-0.5 text-xs text-muted">{rule}</dd>
    </div>
  );
}
