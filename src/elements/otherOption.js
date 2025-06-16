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
export function createOtherOption(element) {
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
