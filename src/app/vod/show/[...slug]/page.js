import { FilmLibrary } from './filmLibrary';
import { YingshiApi } from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import {redirect} from 'next/navigation';

export const metadata = {
  title: '推荐电视剧- 影视TV-海量高清视频免费在线观看',
  description: '全球华人在线视频媒体平台,免费点播,无广告无VIP！免费提供最新高清的电影,电视剧,综艺,动漫,台劇,日劇,泰劇,韩剧,美剧等。'
};

export default async function Page({ params }) {
  const advanceFilterItem = [
    {
      text: '新上线',
      value: 'time',
    },
    {
      text: '热播榜',
      value: 'hits_day',
    },
    {
      text: '好评榜',
      value: 'score',
    },
  ];
  const { filterTypeList, paramsFilter, videoList } = await getVideoList(params, advanceFilterItem);

  return (
    <div>
      <FilmLibrary
        advanceFilterItem={advanceFilterItem}
        filterTypeList={filterTypeList}
        paramsFilter={paramsFilter}
        videos={videoList}
      />
    </div>
  );
}

async function getFilterTypeList() {
  return YingshiApi(
    URL_YINGSHI_VOD.filteringTypeList,
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

async function getFilterParams(path, filterTypeList, by) {
  const filterParams = {}
  for (let i = 0; i < path.length; i+=2) {
    filterParams[path[i]] = decodeURIComponent(path[i+1]);
  }

  const typeInfo = filterTypeList.find((item) => item.type_id === parseInt(filterParams.id));
  if (!typeInfo) {
    redirect('/404');
  }

  const { class: classList, area: areaList, lang: langList, year: yearList } = typeInfo.type_extend_obj;

  const isValidClass = filterParams.class ? classList.split(',').includes(filterParams.class) : false;
  const isValidArea = filterParams.area ? areaList.split(',').includes(filterParams.area) : false;
  const isValidLang = filterParams.lang ? langList.split(',').includes(filterParams.lang) : false;
  const isValidYear = filterParams.year ? yearList.split(',').includes(filterParams.year) : false;

  return {
    order: 'desc',
    typeId: parseInt(filterParams.id),
    by: filterParams.by ? filterParams.by : by[0].value,
    class: isValidClass ? filterParams.class : '全部类型',
    area: isValidArea ? filterParams.area : '全部地区',
    lang: isValidLang ? filterParams.lang : '全部语言',
    year: isValidYear ? filterParams.year : '全部时间',
  };
}

async function getVideoList(params, byList) {
  const filterTypeList = await getFilterTypeList();
  const paramsFilter = await getFilterParams(params.slug, filterTypeList, byList);
  const videoList = await YingshiApi(
      URL_YINGSHI_VOD.searchingList,
      {
        order: 'desc',
        limit: 30,
        page: 1,
        tid: paramsFilter.typeId,
        by: paramsFilter.by,
        class: paramsFilter.class == '全部类型' ? '' : paramsFilter.class,
        area: paramsFilter.area == '全部地区' ? '' : paramsFilter.area,
        lang: paramsFilter.lang == '全部语言' ? '' : paramsFilter.lang,
        year: paramsFilter.year == '全部时间' ? '' : paramsFilter.year,
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

  return {
    filterTypeList: filterTypeList,
    paramsFilter: paramsFilter,
    videoList: videoList,
  }
}