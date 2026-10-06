import {
  nodes,
  hypotheses,
  evidence,
  fileRoles,
  dependencies,
  learning,
} from "./scenario.mjs";
import { initial, change, flow } from "./state.mjs";
import { graphMarkup, drawGraph } from "./graph.mjs";

const $ = (selector) => document.querySelector(selector);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let state = initial();
const mobile = matchMedia("(max-width:600px)");
const arrow = (direction) =>
  `<svg class="inline-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${direction === "left" ? "M19 12H5m7-7-7 7 7 7" : "M5 12h14m-7-7 7 7-7 7"}"/></svg>`;
// The sample is authored for this prototype; it is not repository context.

function send(action) {
  state = change(state, action);
  render();
  $("#announcement").textContent =
    action.type === "answer"
      ? "Hipótese registrada no desenho, sem alterações no código."
      : `Em foco: ${nodes[state.selected].name}`;
}
function showDetailsLink(id) {
  const refs = state.question
    ? [...evidence.prepare, ...evidence.policy]
    : evidence[id];
  const files = new Set(refs.map((ref) => ref.path)).size;
  const tools = state.question ? [] : dependencies[id] || [];
  return `<button class="resource-jump" id="open-detail">Entender esta etapa <span>Conceitos · ${files} ${files === 1 ? "arquivo" : "arquivos"} · ${refs.length} ${refs.length === 1 ? "trecho" : "trechos"}${tools.length ? ` · ${tools.length} ferramentas` : ""} ↗</span></button>`;
}
function renderLearning() {
  const id = state.question ? "policy" : state.selected;
  const lesson = learning[id];
  $("#detail-context").textContent =
    `Exportação de relatórios / ${nodes[id].name}`;
  $("#detail-title").textContent = nodes[id].title;
  $("#detail-body").innerHTML =
    `<div class="lesson"><h3>O papel desta etapa</h3><p class="lesson-purpose">${lesson.purpose}</p><h3>Como acontece aqui</h3><ol>${lesson.steps.map((step) => `<li>${step}</li>`).join("")}</ol><div class="change-context"><h3>O que isso muda na exportação</h3><p>${lesson.implication}</p></div></div><aside class="concepts" aria-label="Conceitos usados nesta etapa"><h3>Os nomes, neste código</h3><dl>${lesson.terms.map(([term, definition]) => `<dt>${term}</dt><dd>${definition}</dd>`).join("")}</dl></aside>`;
}
function openDetail() {
  $("#detail-dialog").showModal();
  $("#detail-dialog").scrollTop = 0;
}
function renderResources() {
  const refs = state.question
    ? [...evidence.prepare, ...evidence.policy]
    : evidence[state.selected];
  const tools = state.question ? [] : dependencies[state.selected] || [];
  const groups = new Map();
  refs.forEach((ref, index) => {
    if (!groups.has(ref.path)) groups.set(ref.path, []);
    groups.get(ref.path).push({ ...ref, index });
  });
  const context = state.question
    ? "Tempo de espera"
    : nodes[state.selected].name;
  $("#resources").innerHTML =
    `<div class="resources-heading"><div><p class="eyebrow">${context} · evidências desta etapa</p><h2 id="resources-title">Onde isso vive no código.</h2></div><a href="#detail-body">Voltar à explicação ↑</a></div><div class="resources-grid"><div class="file-list"><h3>Arquivos e trechos</h3>${[
      ...groups,
    ]
      .map(
        ([path, snippets]) =>
          `<article class="source-file"><h4>${escape(path.split("/").pop())}</h4><p class="file-path">${escape(path)}</p><p class="file-role">${fileRoles[path]}</p>${snippets
            .map(
              (ref) =>
                `<details class="source-snippet" id="source-${ref.index}" ${ref.index === 0 ? "open" : ""}><summary>${ref.title}<span>L${ref.line}–${ref.end}</span></summary><pre tabindex="0" aria-label="Trecho de ${escape(path)}"><code>${ref.code
                  .split("\n")
                  .map(
                    (line, i) =>
                      `<span class="code-line"><span class="line-number" aria-hidden="true">${ref.line + i}</span>${escape(line)}</span>`,
                  )
                  .join("")}</code></pre></details>`,
            )
            .join("")}</article>`,
      )
      .join(
        "",
      )}</div><aside class="dependency-list" aria-label="Ferramentas e integrações"><h3>Ferramentas e integrações</h3>${tools.length ? tools.map((tool) => `<article class="dependency"><p class="dependency-kind">${tool.kind}</p><h4>${tool.name}</h4><p>${tool.role}</p><button class="evidence-link" data-source="${refs.findIndex((ref) => ref.title === tool.evidenceTitle)}">Ver uso no código ↗</button><a href="${tool.doc}" target="_blank" rel="noopener noreferrer">${tool.docLabel} ↗</a>${tool.unknown ? `<p class="dependency-unknown">Em aberto: ${tool.unknown}</p>` : ""}</article>`).join("") : '<p class="empty-dependencies">Nenhuma biblioteca externa neste trecho fictício. Abra Formato CSV para ver um exemplo de dependência.</p>'}<p class="resource-note">Uso ilustrativo. A biblioteca não é instalada nem executada por este protótipo.</p></aside></div><p class="resource-note">Trechos fictícios · escritos para esta demonstração · não representam um projeto real.</p>`;
}
function render() {
  const activeId = document.activeElement?.id;
  const ids = flow(state.scope);
  const step = ids.indexOf(state.selected);
  const node = nodes[state.selected];
  $("#breadcrumbs").innerHTML =
    state.scope === "overview"
      ? "<span>Exportação de relatórios</span>"
      : '<button id="back">Exportação de relatórios</button><span>/</span><strong>Preparação</strong>';
  document
    .querySelectorAll("[data-mode]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.mode === state.mode),
      ),
    );
  $("#map-title").textContent =
    state.scope === "prepare" ? "Por dentro da preparação" : "Mapa da questão";
  $("#map-subtitle").textContent =
    state.mode === "today"
      ? "Abra um ponto para entender sua relação com a mudança."
      : "Hipóteses de mudança · ainda não implementadas.";
  $("#focus-button").textContent =
    state.scope === "overview" ? "Abrir preparação" : "Voltar à exportação";
  $("#map").innerHTML = graphMarkup(state, nodes, ids);
  $("#branch-index").innerHTML = ids
    .map(
      (id) =>
        `<button data-index="${id}" aria-pressed="${!state.question && id === state.selected}"><span class="index-point"></span>${nodes[id].name}<span class="index-arrow" aria-hidden="true">↗</span></button>`,
    )
    .join("");
  $("#trace-control").innerHTML =
    `<div><strong>${step + 1}/${ids.length} · ${node.title}</strong><p>${state.mode === "today" ? node.sends : node.proposed ? "Ponto em estudo · confira o comportamento atual ao lado." : "Comportamento a preservar."}</p></div><div class="trace-buttons"><button id="previous" aria-label="Etapa anterior" ${step === 0 ? "disabled" : ""}>${arrow("left")}</button><button id="next" aria-label="Próxima etapa" ${step === ids.length - 1 ? "disabled" : ""}>${arrow("right")}</button></div>`;
  $("#decision-strip").hidden = !state.hypothesis;
  if (state.hypothesis) {
    $("#decision-strip").dataset.kind = "experiment";
    $("#decision-strip").textContent = hypotheses[state.hypothesis].strip;
  }
  $("#conversation-context").textContent = state.question
    ? "A primeira decisão"
    : node.name;
  $("#conversation-body").innerHTML = state.question
    ? renderQuestion()
    : `<h2>${node.title}</h2><p class="lead">${node.text}</p><details class="flow-boundary"><summary>Entradas e saídas</summary><dl class="relationship"><dt>Recebe</dt><dd>${node.receives}</dd><dt>Entrega</dt><dd>${node.sends}</dd></dl></details>${state.mode === "proposed" ? `<div class="question-note">Em estudo: ${node.change}</div>` : ""}${showDetailsLink(state.selected)}<button class="primary wide" id="discuss">Discutir exportação</button>`;
  renderLearning();
  renderResources();
  draw();
  if (activeId)
    document.getElementById(activeId)?.focus({ preventScroll: true });
}
function renderQuestion() {
  return `<h2>Esperar ou continuar?</h2><p class="lead">Neste exemplo, o arquivo é preparado antes da resposta.</p><p>Para um relatório grande, a pessoa deve esperar pelo download ou continuar trabalhando e buscar o arquivo depois?</p><div class="hypothesis-options"><button class="secondary" data-answer="immediate" aria-pressed="${state.hypothesis === "immediate"}">Esperar pelo download</button><button class="secondary" data-answer="background" aria-pressed="${state.hypothesis === "background"}">Preparar em segundo plano</button><button class="quiet" data-answer="unknown" aria-pressed="${state.hypothesis === "unknown"}">Ainda não sei</button></div>${state.hypothesis ? `<div class="answer-outcome"><h3>${hypotheses[state.hypothesis].title}</h3><p>${hypotheses[state.hypothesis].text}</p><p class="hint">Hipótese de demonstração. Nenhum código foi alterado.</p><button class="secondary wide" id="open-prepare">Entender a preparação</button></div>` : '<p class="hint">Uma decisão por vez. Podemos investigar antes de escolher.</p>'}${showDetailsLink("policy")}`;
}
function draw() {
  drawGraph($("#map"), state, flow(state.scope));
}
document.addEventListener("click", (event) => {
  const b = event.target.closest("button");
  if (!b || b.disabled) return;
  if (b.dataset.source !== undefined) {
    const snippet = document.getElementById(`source-${b.dataset.source}`);
    if (snippet) {
      snippet.open = true;
      snippet.querySelector("summary").focus();
      snippet.scrollIntoView({ block: "center" });
    }
  } else if (b.id === "open-detail") openDetail();
  else if (b.id === "close-detail") $("#detail-dialog").close();
  else if (b.dataset.index) {
    send({ type: "select", node: b.dataset.index });
  } else if (b.dataset.related) {
    send({ type: "select", node: b.dataset.related });
    openDetail();
    document
      .getElementById(b.dataset.section)
      .scrollIntoView({ block: "start" });
  } else if (b.dataset.node) {
    send({ type: "select", node: b.dataset.node });
    openDetail();
  } else if (b.dataset.mode) send({ type: "mode", mode: b.dataset.mode });
  else if (b.dataset.answer) send({ type: "answer", answer: b.dataset.answer });
  else if (["start-question", "discuss"].includes(b.id)) {
    send({ type: "question" });
    focusPanel();
  } else if (b.id === "previous" || b.id === "next")
    send({ type: "step", delta: b.id === "next" ? 1 : -1 });
  else if (b.id === "focus-button")
    send({ type: state.scope === "overview" ? "focus" : "back" });
  else if (b.id === "open-prepare") send({ type: "focus" });
  else if (b.id === "back") send({ type: "back" });
  else if (b.id === "reset") send({ type: "reset" });
});
function focusPanel() {
  const h = $("#conversation-body h2");
  h.tabIndex = -1;
  h.focus({ preventScroll: !mobile.matches });
}
new ResizeObserver(draw).observe($("#map"));
mobile.addEventListener("change", draw);
render();
