// 'use server'

import { URL_YINGSHI_VOD } from "@/config/yingshiUrl";
import { YingshiApi } from "@/util/YingshiApi";

export const getTypePage = async (idValue) => {
  if (idValue == 99) {
    return YingshiApi(
      URL_YINGSHI_VOD.homeGetPages,
      {
        id: idValue,
        dj: true,
        page: 1,
        limit: 60,
        vod_limit: 6,
      },
      {
        method: 'GET',
        extraOptions: {
          next: {
            cache: 'force-cache',
            revalidate: 3600
          }
        }
      }
    );
  } else {
    return YingshiApi(
      URL_YINGSHI_VOD.homeGetPages,
      {
        id: idValue,
      },
      {
        method: 'GET',
        extraOptions: {
          next: {
            cache: 'force-cache',
            revalidate: 3600
          }
        }
      }
    );
  }
};

export const getTopicListApi = async (nextPage) => {
  return YingshiApi(
    URL_YINGSHI_VOD.playlistGetTopic + '?limit=5&page=' + nextPage,
    {},
    {
      method: 'GET',
      extraOptions: {
        next: {
          cache: 'force-cache',
          revalidate: 3600
        }
      }
    }
  );
};