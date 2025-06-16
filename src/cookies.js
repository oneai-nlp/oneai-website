import { uuid } from "./util";

export function getCookie(name) {
  const value = ` ; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length >= 2) return parts[1].split(";").shift();
}

// true on success, otherwise false
export function setCookie(name, value, days = 0) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name +
    "=" +
    (value || "") +
    expires +
    `;domain=.${window.location.hostname};path=/`;
  // not a hard ===, as we convert value to string
  return getCookie(name) == value;
}

// return cookie if exists, otherwise try to create it, return true on success, otherwise false
export function getOrSetCookie(name, value, days = 0) {
  return getCookie(name) || setCookie(name, value, days);
}

// only true if setCookie was called and ran successfully
export const visitorCreated =
  (getCookie("ONEAI_UNIQUE_ID") || setCookie("ONEAI_UNIQUE_ID", uuid())) ===
  true;
