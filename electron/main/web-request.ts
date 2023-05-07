import { app, session } from 'electron'

const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'

export function initWebRequest() {
  // https://www.electronjs.org/docs/latest/api/web-request
  session.defaultSession.webRequest.onBeforeSendHeaders({
    // https://github.com/listen1/listen1_chrome_extension/blob/v2.28.0/js/background.js#L42-L53
    urls: [
      // QQ
      ...[
        'c.y.qq.com',
        'i.y.qq.com',
        'qqmusic.qq.com',
        'music.qq.com',
        'imgcache.qq.com',
      ].map(url => `https://${url}/*`),
      // 酷我
      ...[
        '*://www.kuwo.cn/*',
      ],
      // 咪咕
      ...[
        'https://music.migu.cn/*',
        'https://app.c.nf.migu.cn/*',
        'https://jadeite.migu.cn/*',
      ],
    ],
  }, (details, callback) => {
    details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'].replace(`Electron/${[process.versions.electron]} `, '')

    const { url } = details

    // QQ
    if (url.includes('qq.com')) {
      details.requestHeaders.origin = 'https://y.qq.com'
      details.requestHeaders.referer = 'https://y.qq.com/'
    }

    // 酷我
    else if (url.includes('www.kuwo.cn')) {
      details.requestHeaders.referer = 'https://www.kuwo.cn/'
    }

    // 咪咕
    else if (url.includes('music.migu.cn')) {
      details.requestHeaders.referer = 'https://music.migu.cn/v3/music/player/audio?from=migu'
    } else if (url.includes('app.c.nf.migu.cn')) {
      details.requestHeaders.origin = ''
      details.requestHeaders.referer = ''
      details.requestHeaders['User-Agent'] = MOBILE_UA
    } else if (url.includes('jadeite.migu.cn')) {
      details.requestHeaders.origin = ''
      details.requestHeaders.referer = ''
      details.requestHeaders['User-Agent'] = 'okhttp/3.12.12'
    }

    // console.log(' ')
    // console.log(' ')
    // console.log(' ')
    // console.log(details.requestHeaders['User-Agent'])
    // console.log(' ')
    // console.log(' ')
    // console.log(' ')
    callback({ requestHeaders: details.requestHeaders })
  })
}
