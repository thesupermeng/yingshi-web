import {YingshiApi} from '@/util/YingshiApi';
import {URL_YINGSHI_USER} from '@/config/yingshiUrl';

const platformId = 5 // for web

export const loginRequestEmailOtp = async ({email, referralCode}) => {
    return YingshiApi(
        URL_YINGSHI_USER.signInUp,
        {
            request_otp_by: 'EMAIL',
            is_social_login: false,
            email: email,
            referral_code: referralCode,
            platform_id: platformId
        },
        {method: 'POST'}
    )
}

export const loginRequestSmsOtp = async ({phone, countryId, referralCode}) => {
    return YingshiApi(
        URL_YINGSHI_USER.signInUp,
        {
            request_otp_by: 'SMS',
            is_social_login: false,
            phone: phone,
            country_id: countryId,
            referral_code: referralCode,
            platform_id: platformId
        },
        {method: 'POST'}
    )
}

export const loginEmail = async ({email, referralCode, otp}) => {
    return YingshiApi(
        URL_YINGSHI_USER.signInUp,
        {
            request_otp_by: 'EMAIL',
            is_social_login: false,
            email: email,
            referral_code: referralCode,
            platform_id: platformId,
            otp: otp
        },
        {
            method: 'POST',
            saveUserToken: true
        }
    )
}

export const loginSms = async ({phone, countryId, referralCode, otp}) => {
    return YingshiApi(
        URL_YINGSHI_USER.signInUp,
        {
            request_otp_by: 'SMS',
            is_social_login: false,
            phone: phone,
            country_id: countryId,
            referral_code: referralCode,
            platform_id: platformId,
            otp
        },
        {
            method: 'POST',
            saveUserToken: true
        }
    )
}

export const logout = async () => {
    return YingshiApi(
        URL_YINGSHI_USER.logout,
        {},
        {
            method: 'POST',
            removeToken: true
        }
    )
}

export const queryUserInfo = async () => {
    return YingshiApi(
        URL_YINGSHI_USER.userInfo,
        {},
        {method: 'GET'}
    )
}
