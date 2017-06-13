# wx-amplitude
Amplitude SDK for WeChat small app.
微信小程序中使用的 Amplitude SDK。

## 配置

在微信小程序中，需要设置请求域，这个域要求必须是备案的域名，所以需要设置一个已备案的服务器做转发（在 Nginx 中直接转发即可）

## 使用

在小程序中引入对应的文件，按照以下方式使用

```
const Amplitude = require('./libs/wx-amplitude').default;
const amplitude = Amplitude({
  // the proxy of amplitude api server
  apiUrl: 'xxxxx',
  // change to the userId
  userId: 'wangxiao123',
  // change to your apiKey
  apiKey: 'api-key-xxxxxxx',
  // change to your app version
  version: '1.2.3',
});
amplitude.track('wangxiaotest', {
  // custom event properties
  aaa: 123,
});
```

