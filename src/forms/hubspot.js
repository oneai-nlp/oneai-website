/**
 * @typedef {Object} HubspotConfig
 * @property {string} portalId
 * @property {string} formGuid
 * @property {function(Object): Object} submissionToContactInfo
 * @property {function(Object): string} chooseScheduler
 */

/**
 * Submit form data to Hubspot if required fields are present, otherwise do nothing
 * @param {HubspotConfig} hsConfig
 * @param {Object} formOutput
 */
export async function hsSubmit(hsConfig, formOutput) {
  const contactInfo = hsConfig.submissionToContactInfo(formOutput);
  if (!contactInfo) return;

  const submission = {
    fields: Object.entries(contactInfo)
      .filter(([key, _]) => key) // filter out empty keys
      .map(([name, value]) => ({ name, value })),
    submittedAt: Date.now(),
    context: {
      hutk: getCookie("hubspotutk"),
      pageUri: window.location.href,
      pageName: document.title,
    },
  };
  const baseSubmitURL =
    "https://api.hsforms.com/submissions/v3/integration/submit";
  const portalId = hsConfig.portalId;
  const formGuid = hsConfig.formGuid;
  const submitURL = `${baseSubmitURL}/${portalId}/${formGuid}`;
  const resp = await fetch(submitURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });
  return await resp.json();
}
