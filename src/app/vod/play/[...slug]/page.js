import {PlayVod} from './playVod';
import {YingshiApi} from '@/util/YingshiApi';
import {URL_YINGSHI_VOD} from '@/config/yingshiUrl';
import {redirect} from 'next/navigation';
import {PlayXVod} from '@/app/vod/play/[...slug]/playXVod';

export async function generateMetadata({ params }) {
  const {vodId, tId, nId} = generateFilterParams(params.slug);

  const vod = nId != 9999 ? await getVod(vodId, tId) : await getXVod(vodId, tId);

  if (vod && vod.List) {
    const title = `${vod.List[0].vod_name}在线观看 - 影视TV-海量高清视频免费在线观看`
    return {
      title: title,
      description: vod.List[0].vod_blurb
    };
  }
}

export default function Page({ params }) {
  const path = params.slug;
  const {vodId, tId, nId, sourceId} = generateFilterParams(path);

  return nId !== 9999 ? (
    <PlayVod
      vodId={vodId}
      tId={tId}
      nId={nId}
      sourceId={sourceId}
    />
  ) : (
    <PlayXVod
      vodId={vodId}
      tId={tId}
      nId={nId}
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
    nId: parseInt(filterParams.nid),
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
      }
    );
  }
}
