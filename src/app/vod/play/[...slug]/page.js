import {PlayVod} from './playVod';
import {YingshiApi} from '@/util/YingshiApi';
import {URL_YINGSHI_VOD} from '@/config/yingshiUrl';
import {redirect} from 'next/navigation';
import {Config} from '@/util/config';
import {PlayXVod} from '@/app/vod/play/[...slug]/playXVod';

export async function generateMetadata({ params }) {
  const {vodId, tId, nId} = generateFilterParams(params.slug);

  const vod = nId != 9999 ? await getVod(vodId, tId) : await getXVod(vodId, tId);

  if (vod && vod.List) {
    const title = `${vod.List[0].vod_name}在线观看 - 鲨鱼影视-海量高清视频免费在线观看`
    return {
      title: title,
      description: vod.List[0].vod_content
    };
  }
}

export default async function Page({ params }) {
  const path = params.slug;
  const {vodId, tId, nId, sourceId} = generateFilterParams(path);
  const vod = nId != 9999 ? await getVod(vodId, tId) : await getXVod(vodId, tId);

  if (!vod || !vod.List) {
    redirect('/404');
  }

  const vodDetails = getVodDetails(vod.List[0], sourceId, nId);
  const suggestedVods = nId != 9999 ? await getSuggestedVodType(vod.List[0]) : await getSuggestedXVodType(vod.List[0]);
  const popularList = await getPopularList();

  return nId != 9999 ? (
    <PlayVod
      vodId={vodId}
      tId={tId}
      sourceId={sourceId}
      vod={vod.List[0]}
      vodSourceSelected={vodDetails.sourceSelected}
      episodeSelected={vodDetails.selectedEpisode}
      episodeGroups={vodDetails.episodeGroups}
      initialGroupSelected={vodDetails.selectedEpisodeGroups}
      suggestedVods={suggestedVods.List}
      popularList={popularList}
    />
  ) : (
    <PlayXVod
      nId={nId}
      vod={vod.List[0]}
      vodUrl={vod.List[0]?.vod_play_list?.url_count > 0 ? vod.List[0]?.vod_play_list?.urls[0].url : ''}
      vodDetails={vodDetails}
      suggestedVods={suggestedVods.List}
      popularList={popularList}
    />
  );
}

function generateFilterParams(path) {
  const filterParams = {}
  for (let i = 0; i < path.length; i+=2) {
    filterParams[path[i]] = path[i+1];
  }

  if (!filterParams.id || !filterParams.sid || !filterParams.nid) {
    redirect('/404');
  }

  return {
    vodId: filterParams.id,
    tId: filterParams.sid,
    nId: filterParams.nid,
    sourceId: parseInt(filterParams.source)
  }
}

async function getVod(vodId, tId) {
  if (tId == 0) {
    return YingshiApi(
      URL_YINGSHI_VOD.getVodDetails,
      {
        id: vodId,
      },
      {
        method: 'GET',
        noToken: true,
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
      URL_YINGSHI_VOD.getVodDetails,
      {
        id: vodId,
        tid: tId,
      },
      {
        method: 'GET',
        noToken: true,
        extraOptions: {
          next: {
            cache: 'force-cache',
            revalidate: 3600
          }
        }
      }
    );
  }
}

async function getXVod(vodId, tId) {
  if (tId == 0) {
    return YingshiApi(
      URL_YINGSHI_VOD.getXVodDetails,
      {
        id: vodId,
        xMode: true,
      },
      {
        method: 'GET',
        noToken: true,
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
      URL_YINGSHI_VOD.getXVodDetails,
      {
        id: vodId,
        tid: tId,
        xMode: true,
      },
      {
        method: 'GET',
        noToken: true,
        extraOptions: {
          next: {
            cache: 'force-cache',
            revalidate: 3600
          }
        }
      }
    );
  }
}

async function getSuggestedVodType(vod) {
  return YingshiApi(
    URL_YINGSHI_VOD.searchingList,
    {
      category: vod.vod_class ? vod.vod_class.split(',').shift() : '',
      tid: vod.type_id ? vod.type_id.toString() : '',
      limit: 12,
    },
    {
      method: 'GET',
      noToken: true,
      extraOptions: {
        next: {
          cache: 'force-cache',
          revalidate: 3600
        }
      }
    }
  );
}

async function getSuggestedXVodType(vod) {
  // const randomInt = Math.floor(Math.random() * 10) + 1;
  const randomInt = 4;
  let url =
    URL_YINGSHI_VOD.getXVodDetails +
    '?limit=12&page=' +
    randomInt +
    '&vod_source_name=' +
    vod.vod_source_name +
    '&class=' +
    vod.vod_class;

  return YingshiApi(
    url,
    {},
    {
      method: 'GET',
      noToken: true,
      extraOptions: {
        next: {
          cache: 'force-cache',
          revalidate: 3600
        }
      }
    });
}

async function getPopularList() {
  return YingshiApi(
    URL_YINGSHI_VOD.playlistGetTopicDetail + '?id=1',
    {},
    {
      method: 'GET',
      noToken: true,
      extraOptions: {
        next: {
          cache: 'force-cache',
          revalidate: 3600
        }
      }
    });
}

function getVodDetails(vod, sourceId, nId) {
  let source = null;
  let episodeGroups = [];
  let selectedEpisodeGroups = {};
  let selectedEpisode = null;

  if (vod.vod_sources?.length > 0) {
    let index = 0;
    if (sourceId) {
      index = vod.vod_sources.findIndex(
        (x) => x.source_id === sourceId
      );
    }

    source = vod.vod_sources[index === -1 ? 0 : index];

    if (source.vod_play_list.urls.length > Config.vodEpisodeGroupMax) {
      const tolGroup = Math.ceil(
        source.vod_play_list.urls.length / Config.vodEpisodeGroupMax
      );
      const groups = [];

      for (let i = 0; i < tolGroup; i++) {
        groups.push({
          from: i * Config.vodEpisodeGroupMax + 1,
          to:
            tolGroup === i + 1
              ? source.vod_play_list.urls.length
              : (i + 1) * Config.vodEpisodeGroupMax,
        });
      }

      episodeGroups = groups;
      selectedEpisodeGroups = groups.length > 0 ?
        groups.find(group => nId >= group.from && nId <= group.to) :
        {};
    } else {
      const defaultGroup = {
        from: 1,
        to: source.vod_play_list.urls.length,
      };

      episodeGroups = [defaultGroup];
      selectedEpisodeGroups = defaultGroup;
    }

    if (source.vod_play_list.urls.length > 0) {
      if (nId && nId > 0 && nId < 9999) {
        selectedEpisode = source.vod_play_list.urls[nId - 1];
      } else {
        selectedEpisode = source.vod_play_list.urls[0];
      }
    }
  }

  return {
    sourceSelected: source,
    episodeGroups: episodeGroups,
    selectedEpisodeGroups: selectedEpisodeGroups,
    selectedEpisode: selectedEpisode
  }
}
