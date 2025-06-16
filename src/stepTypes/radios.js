import { stepHandlers } from "../step";

/** @type {import("../step").StepSetupFunction} */
function setup(step) {
  /** @type {HTMLInputElement | null} */
  const otherElement = step.querySelector('[data-type="other"] input');
  /** @type {NodeListOf<HTMLInputElement>} */
  const radios = step.querySelectorAll('input[type="radio"]');
  // other option has a value - uncheck all radios
  otherElement?.addEventListener("change", () => {
    if (otherElement.value) {
      radios.forEach((r) => {
        r.checked = false;
        r.parentElement?.classList.toggle("is-active", false);
      });
    }
  });
  // toggle "is-active" class of wrappers ("change" is sadly only triggered when the radio is checked)
  radios.forEach((el) => {
    el.parentElement?.classList.toggle("is-active", el.checked);
    el.addEventListener("change", () => {
      radios.forEach((r) => {
        r.parentElement?.classList.toggle("is-active", r.checked);
      });
      if (otherElement) {
        otherElement.value = "";
        otherElement.dispatchEvent(new Event("blur"));
      }
    });
  });
}

/**
 * @type {import("../step.js").StepOutputFunction}
 * @returns {string | undefined}
 */
function output(step) {
  /** @type {HTMLInputElement | null} */
  const otherOption = step.querySelector('[data-type="other"] input');
  /** @type {Array<HTMLInputElement>} */
  const radios = Array.from(step.querySelectorAll('[type="radio"]'));
  // find the checked radio
  const checked = radios.find((e) => e.checked);
  const result = (checked?.labels || [checked])[0]?.innerText || checked?.name;
  // return the value of the "other" option if it's filled, or the checked value, or undefined
  return otherOption?.value || result;
}

stepHandlers["radios"] = {
  setup,
  validate: (step) => output(step) !== undefined,
  output,
};
