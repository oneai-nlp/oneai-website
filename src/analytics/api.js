import { isMobile, urlParams } from "../util";
import { getCookie } from "../cookies";

export function triggerEvent(data) {
  console.debug("triggering event:", isMobile() ? JSON.stringify(data) : data);
  const { type, value, ...d } = data;
  return fetch("https://api.oneai.com/analytics/web", {
    keepalive: true,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      value,
      date_time: new Date().toISOString().split(".")[0],
      device: isMobile() ? "Mobile" : "Desktop",
      one_id: getCookie("ONEAI_UNIQUE_ID"),
      path: window.location.pathname,
      version: window.version,
      data: {
        ...d,
        os: navigator?.userAgentData?.platform || "",
        user_agent: navigator?.userAgent || "",
        referrer: document.referrer,
        utm_source: urlParams["utm_source"] || "",
        utm_medium: urlParams["utm_medium"] || "",
        utm_campaign: urlParams["utm_campaign"] || "",
        utm_term: urlParams["utm_term"] || "",
        groupid: urlParams["groupid"] || "",
        campaignid: urlParams["campaignid"] || "",
      },
    }),
  });
}

export function triggerAgentEvent(_) {}
