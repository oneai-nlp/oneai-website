(function () {

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
  const stepHandlers = {};

  stepHandlers["default"] = {
    setup: () => undefined,
    validate: () => true,
    output: () => undefined,
  };

  /** @type {import("../step.js").StepSetupFunction} */
  function setup$2(step) {
    step.querySelectorAll('input[type="checkbox"]').forEach(
      // @ts-ignore - these are input elements come on
      (/** @type {HTMLInputElement} */ el) => {
        el.parentElement?.classList.toggle("is-active", el.checked);
        el.addEventListener("change", () =>
          el.parentElement?.classList.toggle("is-active", el.checked),
        );
      },
    );
  }

  /**
   * @type {import("../step.js").StepOutputFunction}
   * @returns {Array<string>}
   */
  function output$3(step) {
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
    setup: setup$2,
    validate: (step) => output$3(step).length > 0,
    output: output$3,
  };

  /** @type {import("../step").StepSetupFunction} */
  function setup$1(step) {
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
  function output$2(step) {
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
    setup: setup$1,
    validate: (step) => output$2(step) !== undefined,
    output: output$2,
  };

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
   * @type {import("../step").StepValidateFunction}
   * @returns {boolean}
   */
  function validate(step) {
    if (
      step.querySelector(".g-recaptcha") &&
      window.grecaptcha &&
      !window.grecaptcha.enterprise.getResponse()
    )
      return false;
    /** @type {Array<HTMLInputElement>} */
    const allTextInputs = Array.from(step.querySelectorAll(textInputSelector));
    return allTextInputs.every((input) => input.validity.valid);
  }

  /**
   * @type {import("../step").StepOutputFunction}
   * @returns {string | { [key: string]: string }}
   */
  function output$1(step) {
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
    output: output$1,
  };

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

  /**
   * @typedef {Object} OtherOption
   * @property {HTMLElement} element
   * @property {HTMLInputElement} input
   * @property {HTMLElement} label
   * @property {string} defaultText
   */

  /**
   * @param {OtherOption} other
   */
  function focus(other) {
    other.label.style.opacity = "0";
    other.input.style.opacity = "1";
    other.input.focus();
  }

  /**
   * @param {OtherOption} other
   */
  function blur(other) {
    other.label.style.opacity = "1";
    other.input.style.opacity = "0";

    other.label.innerText = other.input.value || other.defaultText;
    other.element.classList.toggle("is-active", Boolean(other.input.value));
  }

  /** @param {HTMLElement} element */
  function createOtherOption(element) {
    const label = element.querySelector("label");
    const input = element.querySelector("input");

    // both are required
    if (!label || !input) {
      console.error(
        "Failed to create an 'other option' - element is invalid:",
        element
      );
      return;
    }

    const obj = {
      element,
      input,
      label,
      defaultText: label.innerText,
    };

    element.addEventListener("click", () => focus(obj));
    input.addEventListener("blur", () => blur(obj));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        blur(obj);
        input.blur();
        e.stopPropagation();
      }
    });
    blur(obj);
  }

  /**
   * @typedef {(
   *  flow: import("../flow").FlowManager,
   *  stepIndex: number,
   *  element: HTMLElement,
   * ) => void} CustomInputHandler
   */


  /**
   * map element types to input attachers
   * @type {{[type: string]: CustomInputHandler}}
   */
  const customInputTypes = {};

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

  customInputTypes["hs-scheduler"] = (flow, _stepIndex, el) => {
    flow.formElement.addEventListener("form:submit", () => {
      const script = document.createElement("script");
      script.src =
        "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
      const fields = flow.hs.submissionToContactInfo(flow.extractOutput());
      const params = new URLSearchParams(fields);
      params.set("embed", "true");
      const baseURL = "https://meetings-eu1.hubspot.com/";
      const schedulerId = flow.hs.chooseScheduler(fields);
      if (!schedulerId) flow.formElement.innerHTML = "Submission Received";
      el.dataset.src = `${baseURL}${schedulerId}?${params}`;
      el.classList.add("meetings-iframe-container");
      el.innerHTML = "";
      el.insertAdjacentElement("afterend", script);
      // Listen for events from the scheduler
      window.addEventListener("message", (event) => {
        if (new URL(event.origin).host !== new URL(baseURL).host) return;
        flow.formElement.dispatchEvent(
          new CustomEvent("form:scheduler", { detail: event.data }),
        );
      });
    });
  };

  function importIti(onload) {
    const linkEl = document.createElement("link");
    const scriptEl = document.createElement("script");
    linkEl.rel = "stylesheet";
    linkEl.href =
      "https://cdn.jsdelivr.net/npm/intl-tel-input@20.0.4/build/css/intlTelInput.css";
    scriptEl.src =
      "https://cdn.jsdelivr.net/npm/intl-tel-input@20.0.4/build/js/intlTelInput.min.js";
    scriptEl.async = true;
    scriptEl.onload = onload;
    document.head.appendChild(linkEl);
    document.head.appendChild(scriptEl);
  }

  customInputTypes["iti"] = (_flow, _stepIndex, el) => {
    importIti(() => {
      const initialValue = el.value;
      el.value = "";
      window.iti = window.intlTelInput(el, {
        dropdownContainer:
          isMobile() && el.dataset.dropdownContainer
            ? document.querySelector(el.dataset.dropdownContainer)
            : null,
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@20.0.4/build/js/utils.js",
        autoPlaceholder: "aggressive",
        initialCountry: "auto",
        geoIpLookup: function (success) {
          fetch("https://ipapi.co/json")
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error("Failed to fetch the user's country by IP");
            })
            .then((data) => success(data.country))
            .catch(() => success("US"));
        },
      });
      window.iti.promise.then(() => {
        if (initialValue && !window.iti.getNumber()) {
          el.value = initialValue;
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    });

    const countryInputs = [];
    // create a hidden input to store the country name & code
    for (let inputName of ["country", "countryCode"]) {
      const countryInput = document.createElement("input");
      countryInput.type = "text";
      countryInput.style.display = "none";
      countryInput.name = inputName;
      countryInputs.push(countryInput);
      el.insertAdjacentElement("afterend", countryInput);
    }
    const updateCountry = () => {
      countryInputs[0].value =
        window.iti?.getSelectedCountryData()?.name || "unknown";
      countryInputs[1].value =
        window.iti?.getSelectedCountryData()?.iso2 || "unknown";
    };

    el.addEventListener("countrychange", updateCountry);
    el.addEventListener("input", () => {
      const valid = window.iti.isValidNumber();
      let error = "";
      if (!valid) {
        const errorMap = [
          "Invalid number",
          "Invalid country code",
          "Too short",
          "Too long",
          "Invalid number",
        ];
        error = errorMap[window.iti.getValidationError()] || errorMap[0];
      } else {
        updateCountry();
      }
      el.setCustomValidity(error);
    });
  };

  let domainBlacklist = [];

  function importDomainBlacklist(onload) {
    if (domainBlacklist.length) {
      onload();
      return;
    }

    fetch("https://www.unpkg.com/email-providers/common.json")
      .then((resp) => resp.json())
      .then((data) => {
        domainBlacklist = data;
      })
      .then(onload);
  }
  function validateEmailDomain(el) {
    const domain = el.value.split("@")[1];
    if (!el.validity.valid && !el.validity.customError) return;
    let message = "";
    if (!domain) {
      message = "Missing email domain";
    } else if (domainBlacklist.includes(domain)) {
      message = `Please enter a different email address. This form doesn't accept emails from domain ${domain}`;
    }
    el.setCustomValidity(message);
  }

  customInputTypes["email"] = (_flow, _stepIndex, el) => {
    importDomainBlacklist(() => {
      if (el.value) {
        validateEmailDomain(el);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    el.addEventListener("input", () => validateEmailDomain(el));
  };

  /**
   * @param {import("../flow").FlowManager} flow
   * @param {number} index
   */
  function bindStepUI(flow, index) {
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

  /** @param {import("../flow").FlowManager} flow */
  function bindFormUI(flow) {
    // create hidden input to store the current step
    const currentStepEl = document.createElement("input");
    currentStepEl.type = "hidden";
    currentStepEl.name = "current-step";
    currentStepEl.value = "0";
    flow.formElement.appendChild(currentStepEl);

    // bind events
    if (!("nokeybindings" in flow.formElement.dataset)) {
      document.addEventListener("keydown", handleKeyboardEvent.bind(flow));
    }
    flow.formElement.addEventListener("form:step", (e) => {
      currentStepEl.value = e.detail.index.toString();
      currentStepEl.dispatchEvent(new Event("change", { bubbles: true }));
      showCurrentStep.call(flow, e);
    });
    flow.formElement.addEventListener("form:submit", (e) => {
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
    if (this.formElement.getBoundingClientRect().bottom < window.scrollY) return;
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

  /**
   * @typedef {Object} HubspotConfig
   * @property {string} portalId
   * @property {string} formGuid
   * @property {function(Object): Object} submissionToContactInfo
   * @property {function(Object): string} chooseScheduler
   */

  /**
   * Submit form data to Hubspot if required fields are present, otherwise do nothing
   * @param {HubspotConfig} hsConfig
   * @param {Object} formOutput
   */
  async function hsSubmit(hsConfig, formOutput) {
    const contactInfo = hsConfig.submissionToContactInfo(formOutput);
    if (!contactInfo) return;

    const submission = {
      fields: Object.entries(contactInfo)
        .filter(([key, _]) => key) // filter out empty keys
        .map(([name, value]) => ({ name, value })),
      submittedAt: Date.now(),
      context: {
        hutk: getCookie("hubspotutk"),
        pageUri: window.location.href,
        pageName: document.title,
      },
    };
    const baseSubmitURL =
      "https://api.hsforms.com/submissions/v3/integration/submit";
    const portalId = hsConfig.portalId;
    const formGuid = hsConfig.formGuid;
    const submitURL = `${baseSubmitURL}/${portalId}/${formGuid}`;
    const resp = await fetch(submitURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    return await resp.json();
  }

  /** @enum {string} */
  const NextBehavior = {
    // Auto-advance to the next field
    AUTO: "auto",
    // Advance to the next field only if the current field is valid
    VALIDATE: "validate",
    // Default behavior (allow advancing, not auto-advancing)
    NONE: "none",
  };

  class StepManager {
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

  class FlowManager {
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

  /**
   * @param {Storage} storage
   * @param {HTMLFormElement} form
   * @param {string} item - the key to store the form data under
   */
  function bindFormToStorage(storage, form, item = "form-data") {
    // init form fields with data from session storage
    Object.entries(
      JSON.parse(storage.getItem(item) || "{}"), // default to no values
    ).forEach(formInitializer(form));
    form.addEventListener("change", changeListener(storage, form, item));
  }

  /**
   * @param {Storage} storage
   * @param {HTMLFormElement} form
   * @param {string} item - the key to store the form data under
   * @returns {EventListener}
   */
  function changeListener(storage, form, item) {
    return (e) => {
      const data = JSON.stringify(
        Object.fromEntries(new FormData(form).entries()),
      );
      // store form data in session storage
      storage.setItem(item, data);
      // trigger custom change event
      /** @ts-ignore - @type {HTMLInputElement | null} */
      const target = e.target;
      if (target) {
        form.dispatchEvent(
          new CustomEvent("form:change", {
            detail: {
              key:
                target.type === "checkbox"
                  ? // @ts-ignore
                  target.labels[0].innerText
                  : target.name,
              value: target.type === "checkbox" ? target.checked : target.value,
            },
            bubbles: true,
          }),
        );
      }
    };
  }

  /**
   * Creates a function that initializes a form with a key-value pair
   * @param {HTMLFormElement} form
   * @returns {(keyValuePair: [string, string]) => void}
   */
  function formInitializer(form) {
    return ([key, value]) => {
      /** @type {HTMLInputElement | null} - corresponding input */
      const input = form.querySelector(`input[name=${key}]`);
      if (!input) return;
      // set input's value based on its type
      switch (input.type) {
        case "checkbox":
          input.checked = true;
          break;
        case "radio":
          /** @type {HTMLInputElement | null} - corresponding input */
          const selected = form.querySelector(`[name=${key}][value="${value}"]`);
          if (selected) selected.checked = true;
          break;
        default:
          if (value) {
            input.value = value;
            // trigger custom validation listerners (library listeners are not yet attached)
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
      }
    };
  }

  /**
   * @typedef {Object} FormInitializer
   * @property {HTMLFormElement} form
   * @property {Storage} storage
   * @property {((output: Object) => Promise<string>)} generateEndScreenUrl
   * @property {import('./hubspot').HubspotConfig} hsConfig
   */

  /**
   * @typedef {Object} FormLibrary
   * @property {FormInitializer} defaultConfig
   */

  /** @param {FormInitializer} formInitializer */
  function multiStepFormInit(formInitializer) {
    const initializer = { ...window.forms.defaultConfig, ...formInitializer };
    const storageItem = window.location.pathname.split("/").pop() + "-form-data";
    const storage = initializer.storage || sessionStorage;
    bindFormToStorage(storage, initializer.form, storageItem);
    const state = JSON.parse(storage.getItem(storageItem) || "{}");
    const currentStep = +(state["current-step"] || 0);
    return new FlowManager(
      initializer.form,
      initializer.generateEndScreenUrl,
      initializer.hsConfig,
      currentStep,
    );
  }

  /** @type {FormLibrary} */
  window.forms = {
    init: multiStepFormInit,
    defaultConfig: {},
  };

})();
