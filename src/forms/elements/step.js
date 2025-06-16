import { customInputTypes } from "./customInputs";

/**
 * @param {import("../flow").FlowManager} flow
 * @param {number} index
 */
export function bindStepUI(flow, index) {
  const step = flow.steps[index];
  const { stepElement: stepElement } = step;

  // initially hide step
  stepElement.style.inset = "0";
  stepElement.style.position = "absolute";
  stepElement.style.display = "none";
  stepElement.style.opacity = "0";
  stepElement.style.zIndex = "-1";
  setTimeout(() => {
    stepElement.style.display = "";
  });

  // create custom inputs
  Object.entries(customInputTypes).forEach(([type, handler]) => {
    /** @type {NodeListOf<HTMLElement>} - bind custom inputs */
    const inputs = stepElement.querySelectorAll(`[data-type=${type}]`);
    inputs.forEach((el) => handler(flow, index, el));
  });
}
