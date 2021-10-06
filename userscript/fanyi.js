// ==UserScript==
// @name         翻译助手
// @namespace    https://github.com/jiacai2050
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @version      1.0
// @homepageURL  https://github.com/jiacai2050/blog-snippets/tree/master/userscript
// @supportURL   https://github.com/jiacai2050/blog-snippets/issues
// @icon         https://img.alicdn.com/imgextra/i3/581166664/O1CN01eJIXdW1z6A5aWa5fW_!!581166664.png
// @description  使用谷歌翻译当前网页
// ==/UserScript==

GM_registerMenuCommand("En->中", function() {
  const url = window.location.href;
  console.log(url);
  GM_openInTab(`https://translate.google.com/translate?tl=zh-CN&sl=en&u=${url}`, {
    active: true,
  });
});
