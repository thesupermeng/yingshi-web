import {YingshiApi} from '@/util/YingshiApi';
import {URL_YINGSHI_VOD} from '@/config/yingshiUrl';
import HeaderComponent from '@/components/header/headerComp';


const Header = async () => {
  const getTopNav = async () => {
    return YingshiApi(URL_YINGSHI_VOD.homeGetNav, {}, { method: 'GET' });
  };

  const getTopTenList = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.playlistGetTopicDetail + '?id=1',
      {},
      { method: 'GET' }
    );
  };

  let menuItem = await getTopNav();
  const topTenItem = await getTopTenList();
  menuItem.push({
    id: 998,
    name: '播单',
  });
  menuItem.push({
    id: 999,
    name: '片库',
  });

  return (
    <HeaderComponent headerMenu={menuItem} topTenList={topTenItem.vod_list} />
  )
};

export default Header;
