(() => {
  const parent = document.currentScript.parentElement;
  const test = parent.getAttribute("test").split(",");
  const options = parent
    .getAttribute("options")
    .split(",")
    .map((x) => parseInt(x));
  if (test.length !== options.length) {
    throw new Error("Test and options count mismatch");
  }
  const version = Object.fromEntries(test.map((t, i) => [t, options[i]]));
  window.ab.register(version);
})();
