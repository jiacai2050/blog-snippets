// ==UserScript==
// @name         Enhanced Github
// @namespace    https://github.com/jiacai2050
// @description  Show your commented issues on github easily.
// @match        https://github.com/*
// @author       jiacai2050
// @version      0.1.1
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @homepageURL  https://github.com/jiacai2050/jiacai2050.github.io/tree/hugo/playground/userscript
// ==/UserScript==

const url = window.location.href;

function addCommentedBtn(){
  let navDiv = document.querySelector('#issues_dashboard > div  > nav');
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

if (url.indexOf('github.com/issue')>-1) {
  window.addEventListener('load', addCommentedBtn);
  window.addEventListener('pjax:end', addCommentedBtn);
}
