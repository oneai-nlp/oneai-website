import { customInputTypes } from "./customInputs";

customInputTypes["hs-scheduler"] = (flow, _stepIndex, el) => {
  flow.formElement.addEventListener("form:submit", () => {
    const script = document.createElement("script");
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
    const fields = flow.hs.submissionToContactInfo(flow.extractOutput());
    const params = new URLSearchParams(fields);
    params.set("embed", "true");
    const baseURL = "https://meetings-eu1.hubspot.com/";
    const schedulerId = flow.hs.chooseScheduler(fields);
    if (!schedulerId) flow.formElement.innerHTML = "Submission Received";
    el.dataset.src = `${baseURL}${schedulerId}?${params}`;
    el.classList.add("meetings-iframe-container");
    el.innerHTML = "";
    el.insertAdjacentElement("afterend", script);
    // Listen for events from the scheduler
    window.addEventListener("message", (event) => {
      if (new URL(event.origin).host !== new URL(baseURL).host) return;
      flow.formElement.dispatchEvent(
        new CustomEvent("form:scheduler", { detail: event.data }),
      );
    });
  });
};
