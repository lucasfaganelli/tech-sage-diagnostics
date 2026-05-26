import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LogicPC Expert · Sistema Especialista de Diagnóstico" },
      {
        name: "description",
        content:
          "Sistema especialista baseado em regras IF-THEN e lógica matemática para diagnóstico automático de problemas em computadores.",
      },
    ],
  }),
});

function Index() {
  return (
    <iframe
      src="/app.html"
      title="LogicPC Expert"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        background: "#04060d",
      }}
    />
  );
}
