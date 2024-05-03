import {URL_YINGSHI_PAYMENT} from '@/config/yingshiUrl';
import {YingshiApi} from '@/util/YingshiApi';

export const getYingshiProducts = async () => {
  return YingshiApi(
    URL_YINGSHI_PAYMENT.getProducts,
    {},
    { method: 'GET' }
  );
}
