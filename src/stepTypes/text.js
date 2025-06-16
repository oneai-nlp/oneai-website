import { stepHandlers } from "../step";

const textInputSelector =
  'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea';

/** @type {import("../step").StepSetupFunction} */
function setup(step) {
  const inputs = Array.from(step.querySelectorAll(textInputSelector));
  inputs.forEach((input, index) => {
    input.addEventListener("change", () => {
      if (input.validity.valid) {
        inputs[index + 1]?.focus();
      }
    });
  });
}

/**
 * @type {import("../step.js").StepValidateFunction}
 * @returns {boolean}
 */
function validate(step) {
  /** @type {Array<HTMLInputElement>} */
  const allTextInputs = Array.from(step.querySelectorAll(textInputSelector));
  return allTextInputs.every((input) => input.validity.valid);
}

/**
 * @type {import("../step.js").StepOutputFunction}
 * @returns {string | { [key: string]: string }}
 */
function output(step) {
  /** @type {Array<HTMLInputElement>} */
  const inputs = Array.from(step.querySelectorAll(textInputSelector));
  if (inputs.length === 1) return inputs[0].value;
  // construct string -> string object
  return Object.fromEntries(
    inputs
      .filter((input) => input.name)
      .map((input) => [input.name, input.value]),
  );
}

stepHandlers["text"] = {
  setup,
  validate,
  output,
};
