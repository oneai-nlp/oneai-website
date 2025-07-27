export function triggerConversion(
  conversion,
  callback = undefined,
  timeout = 1500,
) {
  let timeoutId = undefined;
  if (callback !== undefined && timeout !== undefined) {
    timeoutId = setTimeout(callback, timeout);
  }

  if (typeof conversion === "string") {
    conversion = { conversion_label: conversion };
  }
  window.dataLayer.push({
    event: "conversion",
    eventCallback:
      callback !== undefined &&
      (() => {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
        callback();
      }),
    ...conversion,
  });
  console.debug(`triggered conversion ${JSON.stringify(conversion, null, 2)}`);
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  for (const link of document.links) {
    if (link.hostname.endsWith(window.location.hostname)) {
      const url = new URL(link.href);
      for (const param of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "campaignid",
        "groupid",
      ]) {
        if (urlParams[param]) {
          url.searchParams.set(param, urlParams[param]);
        }
      }
      link.href = url.href;
    }

    const conversionId = link.getAttribute("ga-conversion-id");
    if (conversionId) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        triggerConversion(conversionId, () => {
          window.location = link.href;
        });
      });
    }
  }
});
