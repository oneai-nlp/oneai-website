/**
 * @param {Storage} storage
 * @param {HTMLFormElement} form
 * @param {string} item - the key to store the form data under
 */
export function bindFormToStorage(storage, form, item = "form-data") {
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
