// ==UserScript==
// @name        Remove GitHub unread notification
// @namespace   https://github.com/jiacai2050
// @match       https://github.com/*
// @grant       none
// @version     0.1.0
// @author      jiacai2050
// @icon        https://github.githubassets.com/favicons/favicon.svg
// @description Help programmers have a happy weekend
// ==/UserScript==

function isWeekend(date = new Date()) {
  return date.getDay() === 6 || date.getDay() === 0;
}

function removeUnread() {
  if (isWeekend) {
    for(let unread of document.getElementsByClassName('unread')) {
      unread.remove();
    }
  }
}

window.addEventListener('load', removeUnread);
