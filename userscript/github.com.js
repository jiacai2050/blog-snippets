// ==UserScript==
// @name         Github Commented Issues
// @namespace    https://github.com/jiacai2050
// @description  Show your commented issues on github easily.
// @match        https://github.com/issues*
// @author       jiacai2050
// @version      0.2.3
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @homepageURL  https://github.com/jiacai2050/blog-snippets/tree/master/userscript
// @supportURL   https://github.com/jiacai2050/blog-snippets/issues
// ==/UserScript==

function addCommentedBtn(){
  let navDiv = document.querySelector('#js-pjax-container > div > div.subnav.d-flex.mb-3.flex-column.flex-md-row > nav');
  for (let i=0;i<navDiv.children.length;i++) {
    let oldHref = navDiv.children[i].getAttribute('href');
    let newHref = oldHref.replace(/\+commenter.+?\+/, '+');
    navDiv.children[i].setAttribute('href', newHref);
  }
  let mentionedBtn = navDiv.children[2];
  let mentionedFilter = mentionedBtn.getAttribute("href");
  let commenterFilter = mentionedFilter.replace('+mentions', '+commenter') + " sort:updated-desc";
  let clazz = 'js-selected-navigation-item subnav-item';
  if (/commenter/.test(window.location.search)) {
    clazz = `${clazz} selected`;
  }
  mentionedBtn.insertAdjacentHTML('afterend', `<a class="${clazz}" role="tab" href="${commenterFilter}">Commented</a>`);
}

window.addEventListener('load', addCommentedBtn);
window.addEventListener('pjax:end', addCommentedBtn);
