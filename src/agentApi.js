import { getCookie, getOrSetCookie, triggerEvent } from "./external";

const AGENT_BASE_URL = "https://api.oneai.com/agent/v1";

/**
 * @param {string} url - url of the page to be added to the agent
 * @returns {Promise<string>} - agent studio url with the created agent
 */
export async function createAgent(url) {
    const one_id = getCookie("ONEAI_UNIQUE_ID");
    const existing_api_key = getCookie("api_key_prod");
    const response = await fetch(AGENT_BASE_URL + "/create", {
        method: "POST",
        body: JSON.stringify({
            embedding_domain: "agent@1",
            display_name: "",
            agent_access: "public_write",
            created_by: "agentmaker", //"lp",
        }),
        headers: {
            "Content-Type": "application/json",
            ...(one_id && { "one-id": one_id }),
            ...(existing_api_key && { "api-key": existing_api_key }),
        },
    });
    const {
        agent_id: agent_id,
        api_key: api_key,
        org_id: org_id,
    } = await response.json();

    getOrSetCookie("api_key_prod", api_key);
    getOrSetCookie("user_id_prod", org_id);
    if (url) {
        // try adding the content, let the user continue even if it fails
        try {
            await addContentToAgent(agent_id, one_id, api_key, url);
        } catch (e) {
            console.error(e);
            // report the error to analytics
            triggerEvent({ type: "WIZARD_URL_ERROR", value: e.message });
        }
    }
    return `https://studio.oneai.com/agent/agents?agentId=${agent_id}&userId=${org_id}`;
}

/**
 * @param {string} url - url of the page to be added to the agent
 * @param {string} one_id - one id of the user
 * @param {string} api_key - api key of the user
 * @param {string} agent_id - id of the agent
 */
async function addContentToAgent(agent_id, one_id, api_key, url) {
    const response = await fetch(
        `${AGENT_BASE_URL}/agents/${agent_id}/insert/async`,
        {
            method: "POST",
            body: JSON.stringify({
                agent_id: agent_id,
                content_items: [
                    {
                        triggers: [],
                        content: url,
                        params: {
                            should_crawl: true,
                            max_depth: 3,
                            max_count: 100,
                            limit_to_domain: true,
                        },
                        type: "url",
                    },
                ],
                project: "string",
                metadata: {},
                item_types: [],
            }),
            headers: {
                "Content-Type": "application/json",
                ...(one_id && { "one-id": one_id }),
                ...(api_key && { "api-key": api_key }),
            },
        },
    );
    await response.json();
}
