const glyph = (kind) => {
  const paths = {
    question:
      '<path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8L19.8 4.2"/>',
    code: '<rect x="5" y="5" width="14" height="14"/>',
    external: '<path d="M12 4 21 20H3Z"/>',
    concept: '<path d="m12 3 9 9-9 9-9-9Z"/>',
  };
  return `<svg class="symbol ${kind}" viewBox="0 0 24 24" aria-hidden="true">${paths[kind]}</svg>`;
};
const positions = {
  request: [19, 32, 23, 32],
  prepare: [25, 74, 76, 40],
  format: [74, 40, 25, 65],
  delivery: [73, 81, 76, 85],
  entry: [19, 30, 23, 33],
  policy: [75, 33, 77, 53],
  attempt: [66, 80, 26, 78],
};
const satellites = [
  {
    id: "filters",
    parent: "request",
    name: "Filtros",
    kind: "concept",
    x: 9,
    y: 10,
    target: "request",
    section: "resources",
  },
  {
    id: "adapter",
    parent: "format",
    name: "Adaptador",
    kind: "concept",
    x: 66,
    y: 10,
    target: "format",
    section: "detail-body",
  },
  {
    id: "library",
    parent: "format",
    name: "Papa Parse",
    kind: "external",
    x: 91,
    y: 24,
    target: "format",
    section: "resources",
  },
];
export function graphMarkup(state, nodes, ids) {
  const root = `<h1 class="intent-node" data-graph-id="intent"><button id="start-question" aria-label="Como exportar relatórios? Discutir a mudança">${glyph("question")}<span class="root-copy">Como exportar<br>relatórios?<small>sem bloquear quem usa</small></span></button></h1>`;
  const points = ids
    .map((id) => {
      const [x, y, mx, my] = positions[id];
      const n = nodes[id],
        proposed = state.mode === "proposed" && n.proposed;
      return `<button class="node ${proposed ? "proposed" : ""}" id="node-${id}" data-node="${id}" data-graph-id="${id}" aria-pressed="${!state.question && state.selected === id}" style="--x:${x}%;--y:${y}%;--mx:${mx}%;--my:${my}%">${glyph("code")}<span class="node-name">${n.name}</span><span class="node-description">${n.short}</span>${proposed ? `<span class="node-mark">${n.proposed}</span>` : ""}</button>`;
    })
    .join("");
  const leaves =
    state.scope === "overview"
      ? satellites
          .map(
            (n) =>
              `<button class="graph-leaf" id="related-${n.id}" data-related="${n.target}" data-section="${n.section}" data-graph-id="${n.id}" style="--x:${n.x}%;--y:${n.y}%">${glyph(n.kind)}<span>${n.name}</span><small>${n.kind === "external" ? "terceiro" : "conceito"}</small></button>`,
          )
          .join("")
      : "";
  return `<svg class="connections" aria-hidden="true"></svg>${root}${points}${leaves}`;
}
export function drawGraph(map, state, ids) {
  const svg = map.querySelector(".connections");
  if (!svg) return;
  const rect = map.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
  const points = {};
  map.querySelectorAll("[data-graph-id]").forEach((el) => {
    if (!el.getClientRects().length) return;
    const r = el.querySelector(".symbol").getBoundingClientRect();
    points[el.dataset.graphId] = {
      x: r.left - rect.left + r.width / 2,
      y: r.top - rect.top + r.height / 2,
    };
  });
  const edges = ids.map((id) => ({ from: "intent", to: id, related: false }));
  if (state.scope === "overview")
    satellites.forEach((n) =>
      edges.push({ from: n.parent, to: n.id, related: true }),
    );
  svg.innerHTML = edges
    .map((edge) => {
      const a = points[edge.from],
        b = points[edge.to];
      if (!a || !b) return "";
      const dx = b.x - a.x,
        dy = b.y - a.y,
        d = Math.hypot(dx, dy),
        gap = 14;
      const start = { x: a.x + (dx / d) * gap, y: a.y + (dy / d) * gap };
      const end = { x: b.x - (dx / d) * gap, y: b.y - (dy / d) * gap };
      const active =
        !state.question &&
        (edge.to === state.selected || edge.from === state.selected);
      return `<path class="${edge.related ? "related" : ""} ${active ? "active" : ""}" d="M${start.x},${start.y} L${start.x + dx * 0.44},${start.y + dy * 0.52} L${end.x},${end.y}"/>`;
    })
    .join("");
}
