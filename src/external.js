export function setCookie(key, value, days = 0) {
  // set cookie
  localStorage.setItem(key, value);
  return true;
}

export function getOrSetCookie(key, value, days = 0) {
  return getCookie(key) || setCookie(key, value, days);
}

export function getCookie(key) {
  // get cookie
  return localStorage.getItem(key) || "";
}

export function isMobile() {
  return false;
}

export function triggerEvent(data) {
  console.log(data);
}
export function triggerAgentEvent(data) {}

export function triggerConversion(cid, callback = undefined) {}

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
