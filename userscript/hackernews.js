// ==UserScript==
// @name        Pretty HackerNews
// @namespace   https://github.com/jiacai2050
// @match       https://news.ycombinator.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      https://github.com/jiacai2050
// @icon        https://news.ycombinator.com/y18.gif
// @description 3/10/2021, 10:29:59 AM
// ==/UserScript==

// https://github.com/olivierlacan/Designed-Hacker-News/blob/master/designed-hn.css
GM_addStyle ( `
@media(prefers-color-scheme: dark) {
  body, .c00, .c00 {
    background: black;
    color: #fff; }

  body a {
    color: #ddd !important;
  }

  td.title a.storylink {
    color: #eee !important;
  }

  #hnmain > tbody > tr:nth-child(2) td {
    background-color: #333 !important;
  }
}

.comment p, .comment + p {
  line-height: 16px;
  margin: 8px 0 0 0;
}

.comment u, .comment u a, .comment u a:visited, .comment + p u, .comment + p u a, .comment + p u a:visited {
  color: #777;
  text-decoration: none ;
}

.pagetop {
  font-family: "Lucida Grande", "Segoe UI", Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.subtext {
  font-family: "Lucida Grande", "Segoe UI", Arial, Helvetica, sans-serif;
  font-size: 11px;
  height: 20px;
  vertical-align: top;
}

.title {
  color: #ccc;
  font-family: "Lucida Grande", "Segoe UI", Arial, Helvetica, sans-serif;
  font-size: 16px;
}

a {
  color: #000000;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

body {
  margin: 0;
}

body > center > table {
  background-color: transparent;
  width: 100%;
}

body > center > table > tbody > tr > td > table {
  margin: 0 auto;
  width: 960px;
}

body > center > table > tbody > tr:first-child > td {
  background-image: -webkit-linear-gradient(top, #f60, #f70);
  border-bottom: solid 1px #f60;
  box-shadow: 0 2px rgba(0,0,0,.1);
}

body > center > table > tbody > tr:first-child > td > table {
  margin: 0 auto;
  padding: 7px;
  width: 960px;
}

body > center > table > tbody > tr:first-child > td > table > tbody > tr > td:first-child {
  padding-right: 10px;
}

body > center > table > tbody > tr:nth-child(3) > td {
  padding: 10px 0;
}

body > center > table > tbody > tr:nth-child(3) > td > form {
  margin: 0 auto;
  width: 960px;
}

body > center > table > tbody > tr:nth-child(3) > td > table {
  margin: 0 auto;
  width: 960px;
}

body > center > table > tbody > tr:nth-child(3) > td > table > tbody > tr:first-child > td:nth-child(2).title > a {
  font-size: 18px;
}

td > center > table {
  background-color: white;
  border: solid 1px #000;
  width: 940px;
}

td > center > table td {
  padding: 10px;
}

td, .comment, .default, .comhead, .yclinks, .dead {
  font-family: "Lucida Grande", "Segoe UI", Arial, Helvetica, sans-serif;
  font-size: 15px;
}

td.subtext.pocket-inserted {
  color: #bfbfbf;
}

td.subtext.pocket-inserted a {
  color: #919191;
}

td.title a {
  color: #4d4d4d;
  text-decoration: none;
}

` );
