// ==UserScript==
// @name         网页助手
// @namespace    https://github.com/jiacai2050
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @version      1.0
// @homepageURL  https://github.com/jiacai2050/blog-snippets/tree/master/userscript
// @supportURL   https://github.com/jiacai2050/blog-snippets/issues
// @icon         https://img.alicdn.com/imgextra/i3/581166664/O1CN01eJIXdW1z6A5aWa5fW_!!581166664.png
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @description  我的网页我做主
// ==/UserScript==

GM_registerMenuCommand("En->中", function() {
  const url = window.location.href;
  console.log(url);
  GM_openInTab(`https://translate.google.com/translate?tl=zh-CN&sl=auto&u=${url}`, {
    active: true,
  });
});

function copy_as_org_capture() {
  const url = window.location.href;
  const title = window.document.title;
  GM_setClipboard(`[[${url}][${title}]]`);
  alert(title);
}
GM_registerMenuCommand("org-capture", copy_as_org_capture);

VM.shortcut.register('c-i', copy_as_org_capture);
