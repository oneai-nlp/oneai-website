/**
 * @typedef {'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'} ABVariant
 * @typedef {Object.<string, ABVariant>} ABVersion
 */

import { urlParams } from "../util";

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
    if (Object.keys(newTests).length === 0) return;

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
observer.observe(document.documentElement, { childList: true, subtree: true });
export default ab;
