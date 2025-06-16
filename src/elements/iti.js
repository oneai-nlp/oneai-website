import { customInputTypes } from "./customInputs";

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
