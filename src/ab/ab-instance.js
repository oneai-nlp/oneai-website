(() => {
  // get current script element
  const parent = document.currentScript.parentElement;
  const test = parent.getAttribute("test").split(",");
  const options = parent
    .getAttribute("options")
    .split(",")
    .map((x) => parseInt(x));
  if (test.length !== options.length) {
    throw new Error("Test and options count mismatch");
  }

  function generateVersion() {
    const version = {};
    for (let i = 0; i < test.length; i++) {
      const optionIndex = Math.floor(Math.random() * options[i]);
      const option = String.fromCharCode(97 + optionIndex);
      version[test[i]] = option;
    }
    return version;
  }

  function versionFromURL() {
    return Object.fromEntries(
      Object.entries(urlParams)
        .filter(([k, v]) => k.startsWith("ab-") && v.length === 1)
        .map(([k, v]) => [k.slice(3), v]),
    );
  }

  function handleElement(elem) {
    for (let t of test) {
      const ab = elem.getAttribute("ab-" + t);
      if (ab && ab !== version[t]) {
        elem.remove();
      }
    }
  }

  const key = "ab";
  let version = {
    ...generateVersion(),
    ...(localStorage[key] && JSON.parse(localStorage[key])),
    ...versionFromURL(),
  };
  localStorage[key] = JSON.stringify(version);
  window.version = Object.entries(version)
    .map(([k, v]) => `${k}-${v}`)
    .join(";");

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          handleElement(node);
        }
      });
    });
  });
  // start observing
  observer.observe(document.body, { childList: true, subtree: true });

  const selector = test.map((t) => `[ab-${t}]`).join(",");
  const elements = document.querySelectorAll(selector);
  elements.forEach(handleElement);
})();
