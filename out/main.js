(function () {

  function isMobile$1() {
    var check = false;
    (function(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a,
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4),
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const urlParams = (function() {
    const urlParams = {};
    const querystring = window.location.toString().split("#")[0].split("?");
    if (querystring.length > 1) {
      const pairs = querystring[1].split("&");
      for (const pair of pairs) {
        const keyval = pair.split("=");
        urlParams[keyval[0]] = decodeURIComponent(keyval[1]);
      }
    }
    return urlParams;
  })();

  function getCookie$1(name) {
    const value = ` ; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length >= 2) return parts[1].split(";").shift();
  }

  // true on success, otherwise false
  function setCookie(name, value, days = 0) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name +
      "=" +
      (value || "") +
      expires +
      `;domain=.${window.location.hostname};path=/`;
    // not a hard ===, as we convert value to string
    return getCookie$1(name) == value;
  }

  // return cookie if exists, otherwise try to create it, return true on success, otherwise false
  function getOrSetCookie(name, value, days = 0) {
    return getCookie$1(name) || setCookie(name, value, days);
  }

  // only true if setCookie was called and ran successfully
  const visitorCreated =
    (getCookie$1("ONEAI_UNIQUE_ID") || setCookie("ONEAI_UNIQUE_ID", uuid())) ===
    true;

  function triggerEvent(data) {
    console.debug("triggering event:", isMobile$1() ? JSON.stringify(data) : data);
    const { type, value, ...d } = data;
    return fetch("https://api.oneai.com/analytics/web", {
      keepalive: true,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        value,
        date_time: new Date().toISOString().split(".")[0],
        device: isMobile$1() ? "Mobile" : "Desktop",
        one_id: getCookie$1("ONEAI_UNIQUE_ID"),
        path: window.location.pathname,
        version: window.ab.version,
        data: {
          ...d,
          os: navigator?.userAgentData?.platform || "",
          user_agent: navigator?.userAgent || "",
          referrer: document.referrer,
          utm_source: urlParams["utm_source"] || "",
          utm_medium: urlParams["utm_medium"] || "",
          utm_campaign: urlParams["utm_campaign"] || "",
          utm_term: urlParams["utm_term"] || "",
          groupid: urlParams["groupid"] || "",
          campaignid: urlParams["campaignid"] || "",
        },
      }),
    });
  }

  function triggerAgentEvent(_) {}

  function triggerConversion(
    conversion,
    callback = undefined,
    timeout = 1500,
  ) {
    let timeoutId = undefined;
    if (callback !== undefined && timeout !== undefined) {
      timeoutId = setTimeout(callback, timeout);
    }

    if (typeof conversion === "string") {
      conversion = { conversion_label: conversion };
    }
    window.dataLayer.push({
      event: "conversion",
      eventCallback:
        callback !== undefined &&
        (() => {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
          }
          callback();
        }),
      ...conversion,
    });
    console.debug(`triggered conversion ${JSON.stringify(conversion, null, 2)}`);
    return false;
  }

  document.addEventListener("DOMContentLoaded", () => {
    for (const link of document.links) {
      if (link.hostname.endsWith(window.location.hostname)) {
        const url = new URL(link.href);
        for (const param of [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
          "campaignid",
          "groupid",
        ]) {
          if (urlParams[param]) {
            url.searchParams.set(param, urlParams[param]);
          }
        }
        link.href = url.href;
      }

      const conversionId = link.getAttribute("ga-conversion-id");
      if (conversionId) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          triggerConversion(conversionId, () => {
            window.location = link.href;
          });
        });
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    // immediately trigger page load
    triggerEvent({ type: "PAGE_LOAD" });

    if (!visitorCreated) return;

    // send VISITOR_CREATED event to MarketingWebsite dataset
    triggerEvent({ type: "VISITOR_CREATED" });
  });

  function searchEventValue(element) {
    const value = element?.getAttribute("clickevent_type");
    return (
      (value && {
        type: value,
        value: element?.getAttribute("clickevent_value"),
      }) ||
      (element?.parentElement && searchEventValue(element?.parentElement))
    );
  }

  document.addEventListener("click", (event) => {
    // new way
    const target = event.target.closest("[data-click-type]");
    if (target) {
      triggerEvent({
        type: target.dataset.clickType,
        value: target.dataset.clickValue,
      });
      return;
    }
    // old way
    const value = searchEventValue(event.target);
    if (value) {
      triggerEvent(value);
    }
  });

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
    flow.elt.addEventListener("form:submit", (e) => {
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
    flow.elt.addEventListener("form:init", () => {
      forEl.addEventListener("input", () => {
        el.innerText = forEl.validationMessage;
      });
    });
  };

  customInputTypes["hs-scheduler"] = (flow, _stepIndex, el) => {
    const script = document.createElement("script");
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    el.insertAdjacentElement("afterend", script);

    flow.elt.addEventListener("form:submit", () => {
      const fields = flow.hs.submissionToContactInfo(flow.extractOutput());
      const params = new URLSearchParams(fields);
      params.set("embed", "true");
      const baseURL = "https://meetings-eu1.hubspot.com/";
      const schedulerId = flow.hs.chooseScheduler(fields);
      if (!schedulerId) flow.elt.innerHTML = "Submission Received";
      el.dataset.src = `${baseURL}${schedulerId}?${params}`;
      el.classList.add("meetings-iframe-container");
      el.innerHTML = "";

      MeetingsEmbedCode?.createMeetingsIframe(".meetings-iframe-container");
      // Listen for events from the scheduler
      window.addEventListener("message", (event) => {
        if (new URL(event.origin).host !== new URL(baseURL).host) return;
        flow.elt.dispatchEvent(
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
      this.elt = form;
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
      this.elt.dispatchEvent(event);
    }

    submit() {
      const output = this.extractOutput();
      const dispatchSubmission = () => {
        this.elt.dispatchEvent(
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

  window.forms = {
    init: multiStepFormInit,
    defaultConfig: {},
    flow: undefined,
  };

  (() => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector("form[data-form]");
      if (el && el.querySelector("fieldset[data-step-type=end]")) {
        observer.disconnect();
        requestAnimationFrame(
          () => (window.forms.flow = multiStepFormInit({ form: el })),
        );
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    document.addEventListener("DOMContentLoaded", () => observer.disconnect());
  })();

  /**
   * @typedef {'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'} ABVariant
   * @typedef {Object.<string, ABVariant>} ABVersion
   */


  const ab = {
    key: "ab",
    /** @type {ABVersion} */
    tests: {},
    /**
     * @param {Object.<string, number | ABVariant>} newTests
     *   - map test name to random choice from n variants (number value) or a specific variant (ABVariant value)
     * @param {boolean} override
     */
    register: function (newTests, override = false) {
      if (!override) {
        newTests = Object.fromEntries(
          Object.entries(newTests).filter(([test]) => !(test in this.tests)),
        );
      }
      if (!newTests) return;

      // handle existing elements
      const selector = Object.keys(newTests)
        .map((t) => `[ab-${t}]`)
        .join(",");
      const elements = document.querySelectorAll(selector);
      elements.forEach(handleElement);

      // add to tests object for future elements
      Object.entries(newTests).forEach(([test, options]) => {
        if (typeof options === "number") {
          const optionIndex = Math.floor(Math.random() * options[i]);
          options = /** @type {ABVariant} */ (
            String.fromCharCode(97 + optionIndex)
          );
        }
        this.tests[test] = options;
      });
      localStorage[key] = JSON.stringify(this.tests);
    },
    get version() {
      return Object.entries(this.tests)
        .map(([k, v]) => `${k}-${v}`)
        .join(";");
    },
    /**
     * @param {HTMLElement} elem
     */
    handleElement: function (elem) {
      for (let t of Object.keys(this.tests)) {
        const ab = elem.getAttribute("ab-" + t);
        if (ab && ab !== version[t]) {
          elem.remove();
          break;
        }
      }
    },
  };

  const storageVersion = localStorage[ab.key]
    ? JSON.parse(localStorage[ab.key])
    : {};
  const urlVersion = Object.fromEntries(
    Object.entries(urlParams)
      .filter(([k, v]) => k.startsWith("ab-") && v.length === 1)
      .map(([k, v]) => [k.slice(3), v]),
  );
  ab.register({
    ...storageVersion,
    ...urlVersion,
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          ab.handleElement(node);
        }
      });
    });
  });
  // start observing
  observer.observe(document.body, { childList: true, subtree: true });

  window.ab = ab;
  window.triggetAgentEvent = triggerAgentEvent;
  window.triggerEvent = triggerEvent;
  window.triggerConversion = triggerConversion;
  window.isMobile = isMobile$1;
  window.urlParams = urlParams;
  window.getCookie = getCookie$1;
  window.setCookie = setCookie;
  window.getOrSetCookie = getOrSetCookie;

})();
