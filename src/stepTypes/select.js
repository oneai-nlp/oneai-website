import { stepHandlers } from "../step";

/**
 * @type {import("../step.js").StepOutputFunction}
 * @returns {string | undefined}
 */
function output(step) {
  /** @type {Array<HTMLInputElement>} */
  const selects = Array.from(step.querySelectorAll('select'));
  if (selects.length === 1) return selects[0].value;
  return Object.fromEntries(
    selects
      .filter((select) => select.name)
      .map((select) => [select.name, select.value]),
  );
}

stepHandlers["select"] = {
  setup: (_) => { },
  validate: (step) => output(step) !== undefined,
  output,
};
