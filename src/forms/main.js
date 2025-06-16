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
