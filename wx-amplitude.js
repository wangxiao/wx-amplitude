const amplitude = (options) => {
  const apiKey = options.apiKey;
  const userId = options.userId;
  const appVersion = options.version;
  const apiUrl = options.apiUrl;

  // 获取用户信息
  let userInfo;
  const getUserInfo = (callback) => {
    if (userInfo) {
      if (callback) callback();
    } else {
      wx.getUserInfo({
        success: (res) => {
          userInfo = res.userInfo;
          if (callback) callback();
        },
      });
    }
  };

  // 获取系统信息
  const systemInfo = wx.getSystemInfoSync();

  // 获取与时间相关的随机引子
  const getRandomId = () => {
    let res = Date.now().toString(36);
    const getItem = () => Math.random().toString(36).substring(2, 3);
    res += getItem() + getItem() + getItem();
    return res;
  };

  // 获取 deviceId
  let deviceId;
  const getDeviceId = (callback) => {
    deviceId = wx.getStorageSync('snap-deviceId');
    if (deviceId) {
      if (callback) callback();
    } else {
      deviceId = getRandomId();
      wx.setStorage({ key: 'snap-deviceId', data: deviceId });
    }
  };

  const init = (callback) => {
    getUserInfo(() => getDeviceId(() => {
      if (callback) callback();
    }));
  };

  const trackEvent = (eventType, eventProperties) => {
    const url = apiUrl || 'https://api.amplitude.com/httpapi';
    const eventObj = [{
      user_id: userId,
      device_id: deviceId,
      user_properties: userInfo,
      event_type: eventType,
      event_properties: eventProperties,
      country: userInfo.country,
      time: new Date().getTime(),
      app_version: appVersion,
      platform: 'WeChatSmallApp',
      os_name: systemInfo.platform,
      os_version: systemInfo.system,
      device_model: systemInfo.model,
      city: userInfo.city,
      region: userInfo.province,
      language: systemInfo.language,
    }];
    const data = {
      api_key: apiKey,
      event: JSON.stringify(eventObj),
    };
    wx.request({
      url,
      data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  };

  // 自动初始化
  init();

  return {
    track(eventType, eventProperties) {
      init(() => trackEvent(eventType, eventProperties));
    },
  };
};

export default amplitude;
