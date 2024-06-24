export const URL_YINGSHI_USER = {
  signInUp: 'users/v1/signinup',
  logout: 'users/v1/logout',
  userInfo: 'users/v1/me',
  countryList: 'country/v1/country',
  updateUser: 'users/v1/update',
  feedback: 'feedback/v2/submit',
  refreshAhaToken: 'users/v2/aha/refresh'
};

export const URL_YINGSHI_VOD = {
  homeGetNav: 'nav/v1/navItems?channelId=WEB',
  homeGetPages: 'page/v4.5/typepage',
  getVodDetails: 'vod/v3/vod',
  playlistGetTopic: 'topic/v1/topic',
  playlistGetTopicDetail: 'topic/v1/topic/detail',
  topTenList: 'topic/v1/topic/hot',
  searchingList: 'vod/v3/vod',
  filteringTypeList: 'type/v2/type',
  getXVodDetails: 'svod/v2/vod',
  getAdsSlot: 'ads/v1/slot',
  getAdsVideoSlot: 'ads/v2/slot',
  getAllAds: 'ads/v1/app',
  setAhaWithdrawalPin: 'users/v2/aha/setpin',
};

export const URL_YINGSHI_PAYMENT = {
  getProducts: 'products/v3/nativeProducts',
  createPayOrder: 'finzf/v2/order',
  getTransactionDetail: 'finzf/v1/transactions',
};
