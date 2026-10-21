export const flow = (scope) =>
  scope === "prepare"
    ? ["entry", "policy", "attempt"]
    : ["request", "prepare", "format", "delivery"];
export const initial = () => ({
  selected: "request",
  scope: "overview",
  mode: "today",
  question: false,
  hypothesis: null,
});
export function change(state, action) {
  const next = { ...state };
  switch (action.type) {
    case "select":
      if (!flow(state.scope).includes(action.node))
        throw new Error("Ponto fora do recorte");
      next.selected = action.node;
      next.question = false;
      break;
    case "step": {
      const nodes = flow(state.scope);
      next.selected =
        nodes[
          Math.max(
            0,
            Math.min(
              nodes.length - 1,
              nodes.indexOf(state.selected) + action.delta,
            ),
          )
        ];
      next.question = false;
      break;
    }
    case "focus":
      next.scope = "prepare";
      next.selected = "entry";
      next.question = false;
      break;
    case "back":
      next.scope = "overview";
      next.selected = "prepare";
      next.question = false;
      break;
    case "mode":
      if (!["today", "proposed"].includes(action.mode))
        throw new Error("Visão desconhecida");
      next.mode = action.mode;
      break;
    case "question":
      next.question = true;
      break;
    case "answer":
      if (!["immediate", "background", "unknown"].includes(action.answer))
        throw new Error("Hipótese desconhecida");
      next.hypothesis = action.answer;
      next.mode = "proposed";
      next.question = true;
      break;
    case "reset":
      return initial();
    default:
      throw new Error("Ação desconhecida");
  }
  return next;
}
