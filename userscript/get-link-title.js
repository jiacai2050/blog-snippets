// ==UserScript==
// @name        Extract Link Title
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @inject-into content
// @resource    IMPORTED_CSS https://unpkg.com/microtip/microtip.css
// @description Show link title automatically when hover over
// ==/UserScript==

const my_css = GM_getResourceText("IMPORTED_CSS");
GM_addStyle(my_css);

// 用于存储已获取的标题
let titleCache = {};
window.onload = () => {
  const links = document.querySelectorAll('a[href]:not([href=""]):not([href^="#"])');
  links.forEach(async (link) => {
    console.log(link.href);
    if (link.href && link.href !== '#') {
      const role = link.getAttribute('role');
      if (role === "tooltip") {
        return;
      }

      link.setAttribute('role', 'tooltip');
      link.setAttribute('data-microtip-position', 'top');
      link.setAttribute('data-microtip-size', 'fit');
      try {
        await getTitleFromURL(link);
      } catch(e) {
        console.error(`Fetch tile failed, url:${link.href}, err:${e}`);
        link.setAttribute('role', 'failed');
      }
    }
  });
};

async function getTitleFromURL(element) {
  const url = element.href;
  if (titleCache[url]) {
    element.setAttribute('aria-label', titleCache[url]);
    return;
  }

  if (element.title) {
    element.setAttribute('aria-label', element.title);
    titleCache[url] = element.title;
    return;
  }

  // 使用fetch获取URL内容
  const resp = await fetch('https://liujiacai.net/api/get-title?' + new URLSearchParams({'url': url}), { mode: 'cors' });
  if (!resp.ok) {
    const txt = await resp.text();
    element.setAttribute('aria-label', `Err:${txt}`);
    return;
  }

  const j = await resp.json();
  const pageTitle = j['title'];
  const pageDesc = j['description'];
  let value = 'NA';
  if(pageTitle) {
    value = pageTitle;
  }
  if(pageDesc) {
    if (value === 'NA') {
      value = pageDesc;
    } else {
      value += ' -- ' + pageDesc;
    }
  }

  element.setAttribute('aria-label', value);
  if(value === 'NA') {
    return;
  }

  titleCache[url] = value;
}
