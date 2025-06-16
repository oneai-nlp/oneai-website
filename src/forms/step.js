/**
 * @typedef {(step: HTMLElement) => void} StepSetupFunction
 * @typedef {(step: HTMLElement) => boolean} StepValidateFunction
 * @typedef {(step: HTMLElement) => any} StepOutputFunction
 *
 * functions on top of a form step (usually a <fieldset> element)
 * @typedef {Object} StepHandler
 * @property {StepSetupFunction} setup - initializes the step
 * @property {StepValidateFunction} validate - checks if the step is valid
 * @property {StepOutputFunction} output - exports the step's data into a JSON compatible value
 */

/** @type {{[type: string]:  StepHandler}} */
export const stepHandlers = {};

stepHandlers["default"] = {
  setup: () => undefined,
  validate: () => true,
  output: () => undefined,
};
