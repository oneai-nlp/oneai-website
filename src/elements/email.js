import { customInputTypes } from "./customInputs";

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
