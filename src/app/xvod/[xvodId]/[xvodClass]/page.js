import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import {XVodList} from '@/app/xvod/[xvodId]/[xvodClass]/xvod';
import {redirect} from 'next/navigation';

export default async function Page({ params }) {
  const xvodId = params.xvodId;
  const xvodClass = params.xvodClass;

  try {
    const xvodList = await getXVodListApi(xvodId, xvodClass);

    if (!xvodList.List) {
      redirect('/404')
    }

    return(
      <XVodList
        list={xvodList}
        xvodId={xvodId}
        xvodClass={xvodClass}
      />
    );
  } catch (e) {
    console.log(e);
    redirect('/404');
  }

}

async function getXVodListApi(xvodId, xvodClass) {
  let url =
    URL_YINGSHI_VOD.getXVodDetails +
    '?limit=30&page=1' +
    '&vod_source_name=' +
    xvodId +
    '&class=' +
    xvodClass;

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
