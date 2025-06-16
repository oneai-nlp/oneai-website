import "./stepTypes/checkboxes";
import "./stepTypes/radios";
import "./stepTypes/text";
import "./stepTypes/select";
import "./elements/hsMeeting";
import "./elements/iti";
import "./elements/email";
import { FlowManager } from "./flow";
import { bindFormToStorage } from "./state";

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
    const el = document.querySelector("[data-form]");
    if (el) {
      observer.disconnect();
      window.forms.flow = multiStepFormInit({ form: el });
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  document.addEventListener("DOMContentLoaded", () => observer.disconnect());
})();
