import { Agent, Brand } from '@/config/User/setting';
import md5 from 'crypto-js/md5';
import CryptoJS from 'crypto-js';
import { LocalStorageKeys } from '@/config/common';
import { URL_USER } from '@/config/url';

const ServerTimeOffset = { value: 0, set: false };
export const setServerTimeOffset = (offset) => {
  ServerTimeOffset.value = offset || 0;
  ServerTimeOffset.set = true;
};

const UserApiSetting = {};
export const SetUserApiSetting = (key, val) => {
  UserApiSetting[key] = val;
};
const addHeaderSignature = (
  params,
  timestamp,
  salt = process.env.NEXT_PUBLIC_USER_API_SALT,
  excludeInSignature
) => {
  const keys = [];

  if (!excludeInSignature) {
    for (const key of params.keys()) {
      if (typeof params.get(key) !== 'object') {
        // only non-file value are involved in computing signature
        keys.push(key);
      }
    }
  }

  const end = excludeInSignature
    ? `${timestamp}${salt}`
    : `${keys
        .sort()
        .map((k) => params.get(k))
        .join('')}${timestamp}${salt}`;

  return md5(end).toString();
};

const DeviceInfo = JSON.stringify({
  model: '',
  osVersion: '',
  platform: process.env.NEXT_PUBLIC_ENV === 'WEB' ? 'pc' : 'm',
  uuid: '',
  version: '',
});
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const UserURL = process.env.NEXT_PUBLIC_URL_USER_API;
const Platform = { WEB: 1, H5: 2 }[process.env.NEXT_PUBLIC_ENV || 'WEB'];


const getQuery = (url) => {
  const queryParameters = 'appName=Shayu&platform=WEB&channelId=WEB&ip=165.21.14.226';

  if (url.includes('?')) {
    return '&' + queryParameters;
  } else {
    return '?' + queryParameters;
  }
}

const getHeader = (
  requestBody,
  method = 'POST',
  token = '',
) => {
  
  // config.headers['Authorization'] = `Bearer ${this.bearerToken}`;
  // config.headers['Device-Id'] = "";
  // config.headers['Platform-OS'] = "WEB";
  // config.headers['App-Channel'] = "WEB";
  // config.headers['App-Name'] = "WEB";
  // config.headers['IP-Address'] = "165.21.14.226";
  // config.headers['App-Version'] = "";

  const obj = {
    'Content-Type': 'application/json',
    'Device-Id': 'application/json',
    'Platform-OS': 'WEB',
    'App-Channel': 'WEB',
    'App-Name': 'WEB',
    'IP-Address': '165.21.14.226',
    'App-Version': '',
    'Access-Control-Allow-Origin': '*',
  };
  
  return obj;
};

export const YingshiApi = async (url, body = {}, options = {}) => {
  const {
    method = 'POST',
    saveUserToken,
    saveFBToken,
    saveTayaToken,
    removeToken,
    isFormdata,
    excludeInSignature,
  } = options;

  const requestBody = JSON.stringify(body);
  const requestOption = {
    method,
    headers: getHeader(requestBody, method, ''),
  };

  let getParams = '';
  let resData;
  url = "https://api.yingshi.tv/" + url


  
  if (method !== 'GET') {
    url = url +  getQuery(url);
    requestOption.body = requestBody;
  } else {
    getParams = objectToGetParams(body);
    if(getParams != ''){
      url += "?" + getParams;
    }
  }
  console.log(url);
  try {
    const response = await fetch(url, requestOption)
      .then((d) => d.json())
      .catch((e) => {
        console.log('ERROR')
        throw e;
      });
    resData = response;
  } catch (e) {
    resData = {
      code: 400,
      msg: 'Exception',
      error: e,
    };
  }
  if(resData.code === 401){
    return;
  }
  return resData.data;
};

const objectToGetParams = (paramsObject) => {
  const searchParams = new URLSearchParams();
  for (const key in paramsObject) {
    if (paramsObject.hasOwnProperty(key)) {
      searchParams.append(key, paramsObject[key]);
    }
  }
  return searchParams.toString();
};

// const decryptURL = (src) => {
//   var key = process.env.NEXT_PUBLIC_USER_DECRYPT_KEY;
//   var base64data = CryptoJS.enc.Base64.parse(src);
//   var encrypted = new CryptoJS.lib.WordArray.init(
//     base64data.words.slice(4),
//     base64data.sigBytes - 16
//   );
//   var iv = new CryptoJS.lib.WordArray.init(base64data.words.slice(0, 4));
//   var cipher = CryptoJS.lib.CipherParams.create({ ciphertext: encrypted });
//   var decrypted = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(key), {
//     iv: iv,
//     mode: CryptoJS.mode.CFB,
//     padding: CryptoJS.pad.NoPadding,
//   });
//   return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
// };

// export const updateLocalstorage = (key, val, isSessionStorage = false) => {
//   const storage = isSessionStorage ? sessionStorage : localStorage;
//   if (storage.getItem(key) == val) {
//     return;
//   }
//   if (val !== undefined) {
//     storage.setItem(key, val);
//   } else {
//     storage.removeItem(key);
//   }
//   const toDispatch = () => {
//     if (storage.getItem(key) == val) {
//       window.dispatchEvent(new Event('storage-' + key));
//     } else {
//       return setTimeout(toDispatch);
//     }
//   };
//   return toDispatch();
// };

// const checkServerTime = async (url) => {
//   const timepass = async (res) => {
//     if (
//       url === URL_USER.getServerTime ||
//       ServerTimeOffset.set ||
//       url === URL_USER.getConfig
//     ) {
//       res();
//     } else {
//       setTimeout(() => {
//         timepass(res);
//       }, 10);
//     }
//   };
//   return await new Promise(timepass);
// };
