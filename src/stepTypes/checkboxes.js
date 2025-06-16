import { stepHandlers } from "../step";

/** @type {import("../step.js").StepSetupFunction} */
function setup(step) {
  step.querySelectorAll('input[type="checkbox"]').forEach(
    // @ts-ignore - these are input elements come on
    (/** @type {HTMLInputElement} */ el) => {
      el.parentElement?.classList.toggle("is-active", el.checked);
      el.addEventListener("change", () =>
        el.parentElement?.classList.toggle("is-active", el.checked)
      );
    }
  );
}

/**
 * @type {import("../step.js").StepOutputFunction}
 * @returns {Array<string>}
 */
function output(step) {
  /** @type {HTMLInputElement | null} */
  const otherOption = step.querySelector('[data-type="other"] input');
  /** @type {Array<HTMLInputElement>} */
  const checkboxes = Array.from(step.querySelectorAll('[type="checkbox"]'));
  // return an array of checked values
  const result = checkboxes
    .filter((e) => e.checked)
    .map((e) => (e.labels || [e])[0].innerText || e.name);
  // add the value of the "other" option if it's filled
  if (otherOption?.value) result.push(otherOption.value);
  return result;
}

stepHandlers["checkboxes"] = {
  setup,
  validate: (step) => output(step).length > 0,
  output,
};
