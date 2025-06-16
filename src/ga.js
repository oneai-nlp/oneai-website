export function triggerConversion(
  conversionId,
  callback = undefined,
  timeout = 1500,
) {
  if (urlParams["utm_campaign"]?.toLowerCase().includes("remarketing")) {
    callback();
    return false;
  }
  let timeoutId = undefined;
  if (callback !== undefined && timeout !== undefined) {
    timeoutId = setTimeout(callback, timeout);
  }
  gtag("event", "conversion", {
    send_to: `AW-10840240452/${conversionId}`,
    event_callback:
      callback !== undefined &&
      (() => {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
        callback();
      }),
  });
  console.debug(`triggered conversion ${conversionId}`);
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
