import { visitorCreated } from "../cookies";
import { triggerEvent, triggerAgentEvent } from "./api";

document.addEventListener("DOMContentLoaded", () => {
  // immediately trigger page load
  triggerEvent({ type: "PAGE_LOAD" });

  if (!visitorCreated) return;

  // send VISITOR_CREATED event to MarketingWebsite dataset
  triggerEvent({ type: "VISITOR_CREATED" });
  // send VISITOR_CREATED event to AgentUI dataset
  triggerAgentEvent({ type: "VISITOR_CREATED" });
});

function searchEventValue(element) {
  const value = element?.getAttribute("clickevent_type");
  return (
    (value && {
      type: value,
      value: element?.getAttribute("clickevent_value"),
    }) ||
    (element?.parentElement && searchEventValue(element?.parentElement))
  );
}

document.addEventListener("click", (event) => {
  // new way
  const target = event.target.closest("[data-click-type]");
  if (target) {
    triggerEvent({
      type: target.dataset.clickType,
      value: target.dataset.clickValue,
    });
    return;
  }
  // old way
  const value = searchEventValue(event.target);
  if (value) {
    triggerEvent(value);
  }
});
