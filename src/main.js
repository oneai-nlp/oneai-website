import { triggerAgentEvent, triggerEvent } from "./analytics/api";
import { triggerConversion } from "./ga";
import { isMobile, urlParams } from "./util";
import { getCookie, setCookie, getOrSetCookie } from "./cookies";
import "./analytics/events";
import "./forms/main";

window.triggetAgentEvent = triggerAgentEvent;
window.triggerEvent = triggerEvent;
window.triggerConversion = triggerConversion;
window.isMobile = isMobile;
window.urlParams = urlParams;
window.getCookie = getCookie;
window.setCookie = setCookie;
window.getOrSetCookie = getOrSetCookie;
