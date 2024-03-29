// ==UserScript==
// @name         emacs-china user blocker
// @namespace    https://github.com/jiacai2050
// @match        https://emacs-china.org/
// @grant        none
// @version      1.1
// @author       jiacai2050
// @description  Emacs-China 论坛，屏蔽指定用户的帖子
// @homepageURL  https://github.com/jiacai2050/blog-snippets/tree/master/userscript
// @supportURL   https://github.com/jiacai2050/blog-snippets/issues
// @icon        https://emacs-china.org/uploads/default/optimized/2X/d/dd05943671ee57856f9d7fa7ba6497f31bfcd332_2_180x180.png
// ==/UserScript==

// user ids your want to block
const blockedUsers = ['nesteiner'];
const prefix = 'https://emacs-china.org/users/';

let seenPostCount = 0;

function removeBlockedPosts() {
  const allPosts = document.querySelectorAll('div.creator a');
  console.log(allPosts.length);
  if (seenPostCount >= allPosts.length) {
    // console.log('already removed, return directly');
    return;
  }
  const oldLength = seenPostCount;
  seenPostCount = allPosts.length;
  for (let i=oldLength;i<allPosts.length;i++) {
    const post = allPosts[i];
    const url = post.href;

    for (let blocked of blockedUsers) {
      const userLink = prefix + blocked;
      if (url === userLink) {
        const tr = post.parentNode.parentNode.parentNode;
        console.log(`remove post by ${blocked}`);
        tr.remove();
      }
    }
  }
}

window.addEventListener('wheel', removeBlockedPosts);
window.addEventListener('load', function() {
  setTimeout(removeBlockedPosts, 200);
});
