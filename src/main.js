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
  const storageItem = window.location.pathname.split("/").pop() + "-form-data";
  const storage = formInitializer.storage || sessionStorage;
  bindFormToStorage(storage, formInitializer.form, storageItem);
  const state = JSON.parse(storage.getItem(storageItem) || "{}");
  const currentStep = +(state["current-step"] || 0);
  return new FlowManager(
    formInitializer.form,
    formInitializer.generateEndScreenUrl,
    formInitializer.hsConfig,
    currentStep,
  );
}

// @ts-ignore
window.multiStepFormInit = multiStepFormInit;
// @ts-ignore
// window.createAgent = createAgent;

/**
 * TODO:
 * [ ] Hubspot slides
 * [V] Hubspot submission - requires: (1) hidden fields (2) passing portalId and formId
 * [V] multi-input-single-slide-step: ux
 * [V] contact inputs custom validation, in addition to library validation
 * [V] automatic label sync
 * [V] iti integration
 */
