import { bindStepUI } from "./step";

/** @param {import("../flow").FlowManager} flow */
export function bindFormUI(flow) {
  // create hidden input to store the current step
  const currentStepEl = document.createElement("input");
  currentStepEl.type = "hidden";
  currentStepEl.name = "current-step";
  currentStepEl.value = "0";
  flow.elt.appendChild(currentStepEl);

  // bind events
  if (!("nokeybindings" in flow.elt.dataset)) {
    document.addEventListener("keydown", handleKeyboardEvent.bind(flow));
  }
  flow.elt.addEventListener("form:step", (e) => {
    currentStepEl.value = e.detail.index.toString();
    currentStepEl.dispatchEvent(new Event("change", { bubbles: true }));
    showCurrentStep.call(flow, e);
  });
  flow.elt.addEventListener("form:submit", (e) => {
    currentStepEl.value = "0";
    currentStepEl.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // bind steps
  flow.steps.forEach((_, index) => bindStepUI(flow, index));
}

/**
 * @this {import("../flow").FlowManager}
 * @param {import("../flow").FormStepEvent} e
 */
function showCurrentStep(e) {
  const prev = this.steps[e.detail.previousIndex]?.stepElement;
  const curr = this.steps[e.detail.index]?.stepElement;
  if (prev && prev !== curr) {
    // hide the step
    prev.style.opacity = "0";
    prev.style.zIndex = "-1";
    prev.style.position = "absolute";
  }
  if (curr) {
    // show the step
    curr.style.opacity = "1";
    curr.style.zIndex = "1";
    curr.style.position = "relative";

    const inputs = Array.from(curr.querySelectorAll("input, textarea"));
    /** @type {HTMLInputElement | null} -
    choose which input to focus:
    1. the first input with "autofocus"
    2. the first invalid input
    3. the first input */
    const input =
      inputs.find((input) => input.autofocus) ||
      inputs.find((input) => !input.validity.valid) ||
      inputs[0];
    if (input) {
      input.focus();
      if (input.value && !input.validity.valid) {
        input.reportValidity();
      }
    }
  }
}

/**
 * @this {import("../flow").FlowManager}
 * @param {KeyboardEvent} e
 */
function handleKeyboardEvent(e) {
  if (this.elt.getBoundingClientRect().bottom < window.scrollY) return;
  switch (e.key) {
    case "Enter":
    case "ArrowDown":
      if (this.steps[this.currentStep].valid) {
        this.next();
        e.preventDefault();
      }
      break;
    case "ArrowUp":
      this.back();
      e.preventDefault();
      break;
  }
}
