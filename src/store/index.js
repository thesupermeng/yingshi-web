import { configureStore } from '@reduxjs/toolkit';
import { user } from './user';
import { test } from './test';
import { matchDetail } from './matchDetail';
import { common } from './common';
import { videoPlayer } from './videoPlayer';
import { betCart } from './betCart';
import { Profile } from './profile';
import { sportsTaya } from './sportsTaya';
import { orders } from './orders';
import { chatRoom } from './chatroom';
import { streams } from './streams';
import { stats } from './stats';
import { withdraw } from './withdraw';
import { recharge } from './recharge';
import { promotion } from './promotion';
import { voucher } from './voucher';
import { deposit } from './deposit';
import { userGuide } from './userGuide';
import { hostRecommendation } from './hostRecommendation';
import { videoPlayerMisc } from './videoPlayerMisc';
import { livechat } from './livechat';
import { games } from './games';
import { streamGame } from './streamGame';

export const store = configureStore({
  reducer: {
    betCart: betCart.reducer,
    chatRoom: chatRoom.reducer,
    streams: streams.reducer,
    games: games.reducer,
    stats: stats.reducer,
    withdraw: withdraw.reducer,
    common: common.reducer,
    deposit: deposit.reducer,
    matchDetail: matchDetail.reducer,
    orders: orders.reducer,
    profile: Profile.reducer,
    promotion: promotion.reducer,
    recharge: recharge.reducer,
    sportsTaya: sportsTaya.reducer,
    test: test.reducer,
    user: user.reducer,
    userGuide: userGuide.reducer,
    videoPlayer: videoPlayer.reducer,
    voucher: voucher.reducer,
    hostRecommendation: hostRecommendation.reducer,
    videoPlayerMisc: videoPlayerMisc.reducer,
    streamGame: streamGame.reducer,
    livechat: livechat.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
