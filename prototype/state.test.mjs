import test from "node:test";
import assert from "node:assert/strict";
import { initial, change } from "./state.mjs";

test("explorar o caminho atual não cria uma proposta", () => {
  let s = change(initial(), { type: "select", node: "request" });
  s = change(s, { type: "step", delta: 1 });
  assert.equal(s.selected, "prepare");
  assert.equal(s.mode, "today");
  assert.equal(s.hypothesis, null);
});
test("responder registra uma hipótese sem transformar o código atual em implementado", () => {
  const s = change(initial(), { type: "answer", answer: "immediate" });
  assert.equal(s.mode, "proposed");
  assert.equal(s.hypothesis, "immediate");
  assert.equal(
    change(s, { type: "mode", mode: "today" }).hypothesis,
    "immediate",
  );
});
test("incerteza é uma saída e entradas inválidas não viram decisões", () => {
  assert.equal(
    change(initial(), { type: "answer", answer: "unknown" }).hypothesis,
    "unknown",
  );
  assert.throws(() => change(initial(), { type: "answer", answer: "yes" }));
  assert.throws(() => change(initial(), { type: "select", node: "other" }));
  assert.equal(
    change(initial(), { type: "step", delta: -1 }).selected,
    "request",
  );
});
