// 利用 cobalt API 解析视频地址
// https://github.com/imputnet/cobalt/blob/current/docs/api.md
//
// 创建一个 bookmarklet，内容如下（page-url 需要替换成你的页面函数地址）：
// javascript:window.open("${page-url}?url="+encodeURIComponent(document.location))
//
// 然后在任意网页上点击这个 bookmarklet，就会自动跳转到解析后的视频页面

export async function onRequest(ctx) {
  try {
    return await run(ctx.request);
  } catch (err) {
    console.log(err);
    return new Response(err.message, {
      status: 500,
    });
  }
}

const requestKeys = [
  'vCodec',
  'vQuality',
  'aFormat',
  'filenamePattern',
  'isAudioOnly',
  'isTTFullAudio',
  'isAudioMuted',
  'dubLang',
  'disableMetadata',
  'twitterGif',
  'tiktokH265',
];

async function run(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (url === null) {
    throw 'url param is missing';
  }
  const payload = {
    url: decodeURIComponent(url),
  };
  for (const arg of requestKeys) {
    const v = searchParams.get(arg);
    if (v !== null) {
      payload[arg] = v;
    }
  }

  console.log(payload);
  const jsonType = 'application/json';
  const r = await fetch('https://api.cobalt.tools/api/json', {
    method: 'POST',
    headers: {
      'Content-Type': jsonType,
      'Accept': jsonType,
    },
    body: JSON.stringify(payload),
  });
  const text = await r.text();
  console.log(text);
  if (!r.ok) {
    throw new Error(`Failed to visit cobalt: ${r.status} ${text}`);
  }

  const dest = JSON.parse(text)['url'];
  return Response.redirect(dest, 302);
}
