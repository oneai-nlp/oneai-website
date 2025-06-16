import { stepHandlers } from "./step";
import { bindFormUI } from "./elements/form";
import { hsSubmit } from "./hubspot";

/** @enum {string} */
export const NextBehavior = {
  // Auto-advance to the next field
  AUTO: "auto",
  // Advance to the next field only if the current field is valid
  VALIDATE: "validate",
  // Default behavior (allow advancing, not auto-advancing)
  NONE: "none",
};

export class StepManager {
  /**
   * @param {FlowManager} flow
   * @param {HTMLFieldSetElement} stepElement
   */
  constructor(flow, stepElement) {
    /*@__MANGLE_PROP__*/
    this.name = stepElement.name;
    /*@__MANGLE_PROP__*/
    this.stepElement = stepElement;
    /*@__MANGLE_PROP__*/
    this.moveBehavior = stepElement.dataset.nextBehavior || NextBehavior.NONE;
    /*@__MANGLE_PROP__*/
    this.handler =
      stepHandlers[stepElement.dataset.stepType] || stepHandlers["default"];
    /*@__MANGLE_PROP__*/
    this.valid = false;
    /*@__MANGLE_PROP__*/
    this.value = undefined;
    this.handler.setup(stepElement);
    // "reactive" properties `valid` and `value`
    stepElement.addEventListener("input", () => {
      this.valid = this.handler.validate(stepElement);
      this.value = this.handler.output(stepElement);
    });
    stepElement.dispatchEvent(new Event("input"));
    // auto advance behavior
    stepElement.addEventListener("change", () => {
      if (this.moveBehavior === NextBehavior.AUTO && this.valid) {
        setTimeout(
          () => flow.next(),
          parseInt(stepElement.dataset.nextDelay) || 1000,
        );
      }
    });
  }
}

/**
 * @typedef {CustomEvent<{
 *  previousIndex: number;
 *  index: number;
 * }>} FormStepEvent
 */

export class FlowManager {
  /**
   * @param {HTMLFormElement} form
   * @param {(output: Object) => Promise<string>} generateEndScreenUrl
   * @param {import("./hubspot").HubspotConfig} hsConfig
   * @param {number} currentStep
   */
  constructor(form, generateEndScreenUrl, hsConfig, currentStep) {
    /*@__MANGLE_PROP__*/
    this.formElement = form;
    /*@__MANGLE_PROP__*/
    this.currentStep = -1;
    /*@__MANGLE_PROP__*/
    this.generateSubmissionUrl = generateEndScreenUrl;
    /*@__MANGLE_PROP__*/
    this.hs = hsConfig;

    // find steps
    const stepElements = Array.from(form.querySelectorAll("fieldset"));
    /** @type {Array<StepManager>} */
    this.steps = stepElements.map((el) => new StepManager(this, el));

    // bind UI
    bindFormUI(this);
    form.dispatchEvent(new CustomEvent("form:init", { bubbles: true }));
    // initial state
    this.move(currentStep || 0);
  }

  next(skipValidation = false) {
    // out of bounds
    if (this.currentStep === this.steps.length - 1) {
      return;
    }
    const currentStep = this.steps[this.currentStep];
    // invalid step which requires validation
    if (
      !skipValidation &&
      !currentStep.valid &&
      currentStep.moveBehavior === NextBehavior.VALIDATE
    ) {
      this.move(this.currentStep);
      return;
    }
    // OK to move
    this.move(this.currentStep + 1);
    // we moved to end screen - awesome!
    if (this.currentStep === this.steps.length - 1) {
      this.submit();
    }
  }

  back() {
    if (this.currentStep <= 1 || this.currentStep >= this.steps.length - 1) {
      return;
    }
    // OK to move
    this.move(this.currentStep - 1);
  }

  /** @param {number} stepIndex */
  move(stepIndex) {
    /** @type {FormStepEvent} */
    const event = new CustomEvent("form:step", {
      detail: {
        index: stepIndex,
        previousIndex: this.currentStep,
      },
      bubbles: true,
    });
    // set the current step
    this.currentStep = stepIndex;
    // dispatch an event to update the UI
    this.formElement.dispatchEvent(event);
  }

  submit() {
    const output = this.extractOutput();
    const dispatchSubmission = () => {
      this.formElement.dispatchEvent(
        new CustomEvent("form:submit", {
          detail: output,
          bubbles: true,
        }),
      );
    };

    if (this.hs) {
      hsSubmit(this.hs, output).then(dispatchSubmission);
    } else {
      dispatchSubmission();
    }
  }

  extractOutput() {
    return this.steps.reduce(
      (
        /** @type {{ [x: string]: any; }} */ acc,
        /** @type {StepManager} */ step,
      ) => {
        if (step.value !== undefined) {
          acc[step.name] = step.value;
        }
        return acc;
      },
      {},
    );
  }
}
