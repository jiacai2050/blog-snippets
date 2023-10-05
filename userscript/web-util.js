// ==UserScript==
// @name         网页助手
// @namespace    https://github.com/jiacai2050
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @version      1.1
// @supportURL   https://github.com/jiacai2050/jiacai2050.github.io/issues
// @icon         https://img.alicdn.com/imgextra/i3/581166664/O1CN01eJIXdW1z6A5aWa5fW_!!581166664.png
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @description  我的网页我做主
// ==/UserScript==

const url = window.location.href;
const title = window.document.title;

function translate() {
  // https://violentmonkey.github.io/api/gm/#gm_openintab
  GM_openInTab(`https://translate.google.com/translate?tl=zh-CN&sl=auto&u=${url}`, {
    active: true,
    insert: true
  });
}

function copy_as_org_capture() {
  alert(title);
  GM_setClipboard(`[[${url}][${title}]]`);
}

function copy_as_markdown() {
  alert(title);
  GM_setClipboard(`[${title}](${url})`);
}

function custom_font() {
  GM_addStyle ( `
    * {
        font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif !important;
        line-height: 1.75;
        font-size: 17px;
    }
` );
}

function pretty_it() {
  // common style
  GM_addStyle ( `
body {
  max-width: 70ch;
  padding: 3em 1em;
  margin: auto;
  line-height: 1.75;
  font-size: 1.25em;
}
h1,h2,h3,h4,h5,h6 {
  margin: 3em 0 1em;
}

p,ul,ol {
  margin-bottom: 2em;
  color: #1d1d1d;
  font-family: sans-serif;
}
`);
}

// https://github.com/t-mart/kill-sticky
function kill_sticky() {
  document.querySelectorAll('body *').forEach(function(node) {
    if (['fixed', 'sticky'].includes(getComputedStyle(node).position))  {
      node.parentNode.removeChild(node);
    }
  });

  document.querySelectorAll('html *').forEach(function(node) {
    var s = getComputedStyle(node);
    if ('hidden' === s['overflow']) { node.style['overflow'] = 'visible'; }
    if ('hidden' === s['overflow-x']) { node.style['overflow-x'] = 'visible'; }
    if ('hidden' === s['overflow-y']) { node.style['overflow-y'] = 'visible'; }
  });

  var htmlNode = document.querySelector('html');
  htmlNode.style['overflow'] = 'visible';
  htmlNode.style['overflow-x'] = 'visible';
  htmlNode.style['overflow-y'] = 'visible';
}

// https://github.com/pomber/git-history
function github_file_history() {
  const new_url = url.replace('github.com', 'github.githistory.xyz');
  GM_openInTab(new_url, {
    active: true,
    insert: true
  });
}


GM_registerMenuCommand("org-capture", copy_as_org_capture);
GM_registerMenuCommand("makedown-link", copy_as_org_capture);
GM_registerMenuCommand("En->中", translate);
GM_registerMenuCommand("居中美化", pretty_it);
GM_registerMenuCommand("自定义字体", custom_font);
GM_registerMenuCommand("Kill sticky", kill_sticky);
GM_registerMenuCommand("GitHub History", github_file_history);

VM.shortcut.register('c-i', copy_as_org_capture);
VM.shortcut.register('c-o', copy_as_markdown);
VM.shortcut.register('c-f', translate);
VM.shortcut.register('c-l', custom_font);
VM.shortcut.register('c-p', pretty_it);
VM.shortcut.register('c-k', kill_sticky);
VM.shortcut.register('c-h', github_file_history);

function github_remove_unread() {
  const date = new Date();
  if (date.getDay() === 6 || date.getDay() === 0()) {
    for(let unread of document.getElementsByClassName('unread')) {
      unread.remove();
    }
  }
}

window.onload = function() {
  if (url.indexOf('dydytt.net')>0) {
    kill_sticky();
    setTimeout(2, kill_sticky);
    return;
  }

  if (url.indexOf('danluu.com')>0 || url.indexOf('metamodular.com')>0 || url.indexOf('freedesktop.org')>0) {
    pretty_it();
    return;
  }

  if (url.indexOf('lwn.net')>0) {
    GM_addStyle ( `div.middlecolumn {
  max-width: 70ch;
  padding: 3em 1em;
  margin: auto;
  line-height: 1.75;
  font-size: 1.25em; }`);

  }

  if (url.indexOf('gushiwen.cn')>0) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        document.getElementById('threeWeixin2').remove();
      }, 200);
    });
  }

  if (url.indexOf('github.com')>0) {
    github_remove_unread();
    setTimeout(3, github_remove_unread);
  }
}
