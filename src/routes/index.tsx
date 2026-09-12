import { createFileRoute } from "@tanstack/react-router";
import { FocoScoreApp } from "@/components/foco-score-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <FocoScoreApp />;
}
