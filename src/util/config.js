export const Config = {
  DeviceType: process.env.NEXT_PUBLIC_ENV === 'WEB' ? 3 : 4,
  MetaTitle:
    '鲨鱼影视',
  channel: '',
  platform: '',
  userId: '',
  countryCode: '',
  isLogin: '',
  isHome: false,
  userGuideSlots: 50000,
  locale: 'en',
  vodEpisodeGroupMax: 2,
};
