// 介绍文章：https://liujiacai.net/blog/2024/05/07/telegram-bot-functions/

const CHAT_ID = '@chat_name'; // 替换成你的频道名

export async function onRequest(ctx) {
  try {
    return await run(ctx);
  } catch (err) {
    console.log(err);
    return new Response(err.message, {
      status: 500,
    });
  }
}

// https://developers.cloudflare.com/workers/examples/read-post/
async function readJSONBody(request) {
  const contentType = request.headers.get("content-type");
  if (contentType.includes("application/json")) {
    return await request.json();
  } else {
    throw new Error(`expect json, currenty: ${contentType}`);
  }
}

async function issueHandler(payload, token) {
  const action = payload['action'];
  if (action !== 'opened') {
    throw new Error(`issueHandler only care open action, current:${action}`);
  }
  const html_url = payload['issue']['html_url'];
  const title = payload['issue']['title'];
  const msg = `[${normalize(title)}](${html_url})`;
  return sendTelegram(msg, html_url, token);
}

async function discussionHandler(payload, token) {
  const action = payload['action'];
  if (action !== 'created') {
    throw new Error(`discussionHandler only care created action, current:${action}`);
  }
  const html_url = payload['discussion']['html_url'];
  const title = payload['discussion']['title'];
  const category_name = payload['discussion']['category']['name'];
  const msg = `[${normalize(title)}](${html_url}) in ${normalize(category_name)}`;
  return sendTelegram(msg, html_url, token);
}

// Escape those chars according to https://core.telegram.org/bots/api#sendmessage
function normalize(title) {
  return title.replace(/([-_*\[\]()~`>#+=|{}.!])/g, "\\$1");
}

// https://core.telegram.org/bots/api#sendmessage
async function sendTelegram(message, url, token) {
  const api = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = JSON.stringify({
    'text': `论坛有新帖了：${message}`,
    'chat_id': CHAT_ID,
    'parse_mode': 'MarkdownV2',
    'link_preview_options': { 'url': url }
  });
  return await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

async function run(ctx) {
  const { request, env } = ctx;
  const token = env['TELEGRAM_TOKEN'];
  const ua = request.headers.get('user-agent');
  if (ua.indexOf('GitHub-Hookshot') === -1) {
    throw new Error(`not from github webhook, current:${ua}`);
  }
  const event = request.headers.get('x-github-event');
  const payload = await readJSONBody(request);
  if(event === 'issues') {
    return await issueHandler(payload, token);
  } else if(event === 'discussion') {
    return await discussionHandler(payload, token);
  } else {
    return new Response(`ok ${event}`);
  }
}
