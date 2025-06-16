/**
 * @typedef {(
 *  flow: import("../flow").FlowManager,
 *  stepIndex: number,
 *  element: HTMLElement,
 * ) => void} CustomInputHandler
 */

import { createOtherOption } from "./otherOption";

/**
 * map element types to input attachers
 * @type {{[type: string]: CustomInputHandler}}
 */
export const customInputTypes = {};

customInputTypes["other"] = (_flow, _stepIndex, el) => {
  createOtherOption(el);
};

customInputTypes["next"] = (flow, stepIndex, el) => {
  el.addEventListener("click", (e) => {
    flow.next(false);
    e.preventDefault();
  });
  if (el.hasAttribute("data-alwayson")) return;

  const step = flow.steps[stepIndex];
  step.stepElement.addEventListener("input", () => {
    // @ts-ignore - if disabled is not available, we don't care
    el.disabled = !step.valid;
    el.classList.toggle("is-disabled", !step.valid);
  });
};

customInputTypes["skip"] = (flow, _stepIndex, el) => {
  el.addEventListener("click", (e) => {
    flow.next(true);
    e.preventDefault();
  });
};

customInputTypes["back"] = (flow, _stepIndex, el) => {
  el.addEventListener("click", () => flow.back());
};

customInputTypes["breadcrumb"] = (flow, _stepIndex, el) => {
  const indexString = el.dataset.breadcrumb;
  if (indexString) {
    el.addEventListener("click", () => flow.move(+indexString));
  }
};

customInputTypes["end"] = (flow, stepIndex, el) => {
  /** @type {HTMLElement | null} */
  const spinner = flow.steps[stepIndex].stepElement.querySelector(
    "[data-type=spinner]",
  );
  el.style.display = "none";
  flow.formElement.addEventListener("form:submit", (e) => {
    // @ts-ignore - this is a custom event
    flow.generateSubmissionUrl(e.detail).then((url) => {
      if ("redirect" in el.dataset) {
        window.location.href = url;
      }

      // @ts-ignore - this is a link, we can set the href
      el.href = url;
      el.style.display = "";
      if (spinner) {
        spinner.style.display = "none";
      }
    });
  });
};

customInputTypes["error"] = (flow, stepIndex, el) => {
  const forId = el.getAttribute("for");
  if (!forId) return;
  const forEl = flow.steps[stepIndex].stepElement.querySelector(`#${forId}`);
  if (!forEl) return;

  el.innerText = forEl.value ? forEl.validationMessage : "";
  // add this event listener after form is initialized, to ensure that every validation message is caught
  flow.formElement.addEventListener("form:init", () => {
    forEl.addEventListener("input", () => {
      el.innerText = forEl.validationMessage;
    });
  });
};
