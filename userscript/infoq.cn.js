// ==UserScript==
// @name         InfoQ 纯净阅读
// @namespace    https://github.com/jiacai2050
// @version      0.1
// @description  去除页面上无关内容，只为阅读!
// @author       jiacai2050
// @match        https://*infoq.cn/*
// @icon         https://www.google.com/s2/favicons?domain_url=https://infoq.cn
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
  let selectorsToRemove = [
    'div.geo-banner',
    'div.header-notice',
    'div.friendship-link-wrap',
    'div.com-app-download',
    'div.hot-ppt',
    'div.article-extra',
    'div.widget-minibook'
  ];
  let removed = false;
  let cleanWorker = setInterval(function() {
    let rets = [];

    for(let sel of selectorsToRemove) {
      rets.push($(sel).remove().length);
    }

    let sum = rets.reduce((a, b) => a+b, 0);
    if(!removed && sum > 0) {
      removed = true;
    }
    console.log(`removed ${sum}`);
    if(sum === selectorsToRemove.length || (removed && sum === 0)) { // all div are removed
      clearInterval(cleanWorker);
    }
  }, 1000);

})();
