import './globals.css';
import '../asset/style/custom-bs.css';
import '../asset/style/cms.css';

import { Inter } from 'next/font/google';
import { Providers } from '@/store/Provider';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import FloatingPill from '@/components/floatingPill';
import Script from 'next/script';
import MyFooter from '@/components/myFooter';
import MyFooter2 from '@/components/myFooter2';
import Announcement from '@/components/announcement';
//import FullBetSlip from '@/components/betSlip/FullBetSlip';
import RightSideMenu from '@/components/rightSideMenu';
import { LiveChat } from '@/components/liveChat';
import { H5Only, WEBOnly } from '@/components/Fragments/EnvComponent';
import { isWeb } from '@/util/common';
import { H5Perpetual } from '@/components/Perpetual/H5Perpetual';
import { ChatMessages } from '@/components/Perpetual/ChatMessages';
import WebPerpetual from '@/components/Perpetual/WebPerpetual';
import { NotifyMessages } from '@/components/Perpetual/NotifyMessages';
import Head from 'next/head';
import { H5LiveChat } from '@/componentsH5/H5LiveChat';
import { Config } from '@/util/config';
import dynamic from 'next/dynamic';
import { Favicon } from '@/asset/icons';
import Image from 'next/image';
import { ScrollView } from './scroll-view';
import ModalOverlays from '@/components/modalOverlays';
import '@fortawesome/fontawesome-svg-core/styles.css';

const inter = Inter({ subsets: ['latin'] });


export async function generateMetadata({ params }) {
  const title = `鲨鱼影视-海量高清视频免费在线观看`
  return {
    referrer: 'no-referrer',
    title: title,
    description:
     '鲨鱼影视,全球华人在线视频媒体平台,免费点播,免费提供最新高清的电影,电视剧,综艺,动漫,台劇,日劇,泰劇,韩剧,美剧等。',
  };
}
export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <>
    <Script id="facebook-pixel">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '493542889715736');
          fbq('track', 'PageView');
        `}
      </Script>
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-2562H7TH3Z'
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-2562H7TH3Z');
        `}
      </Script>

      <html
        translate='no'
        lang='cn'
        className={`notranslate root-class relative w-screen h-full`}
        // className={`bg-sideMenu notranslate root-class ${
        //   isWeb()
        //     ? 'webcontent h-full overflow-x-auto overflow-y-hidden'
        //     : 'h5content overscroll-none h-dvh'
        // } relative w-[100vw]`}
      >
        {/* <DynamicComponentWithNoSSR /> */}
        <Head>
          <meta name='google' content='notranslate' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <link rel='icon' href='/icon.png' sizes='any' />
          <link
            rel='apple-touch-icon'
            href='/apple-touch-icon.png'
            type='image'
            sizes='any'
          />
          <link
            rel='apple-touch-icon'
            href='/favicon-16x16.png'
            type='image'
            sizes='16x16'
          />
          <link
            rel='apple-touch-icon'
            href='/favicon-32x32.png'
            type='image'
            sizes='32x32'
          />
          <link
            rel='apple-touch-icon'
            href='/android-chrome-192x192.png'
            type='image'
            sizes='192x192'
          />
          <link
            rel='apple-touch-icon'
            href='/android-chrome-512x512.png'
            type='image'
            sizes='512x512'
          />
        </Head>
        <body
          className={`${inter.className}
            text-white relative w-full h-full overflow-hidden
            `}
          // className={`${
          //   inter.className
          // } h-full bg-sideMenu text-white flex flex-col w-full overscroll-none overflow-x-hidden ${
          //   isWeb() ? '' : 'min-h-[100dvh]'
          // }`}
        >
          <Providers>
            <ModalOverlays />
            <ScrollView>
              <Header />

              <div className='w-full grow flex justify-center '>{children}</div>
              {/* <div className=''>{children}</div> */}

              <MyFooter2 />
              <MyFooter />
              <div
                className='px-8 py-3 desktop'
                style={{
                  marginTop: '2rem',
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: '#1D2023',
                  fontSize: '14px',
                  borderTop: '1px solid hsla(0, 0%, 100%, .05)',
                }}
              >
                <div
                  style={{
                    color: '#6B6B6B !important',
                    lineHeight: '24px',
                  }}
                >
                  版权声明：鲨鱼影视内容均来自互联网，不提供存储/录制/上传。
                  <br />
                  如果鲨鱼影视提供内容侵犯了您的版权，请发送电子邮件至
                  <a href='mailto:shayuyingshi@gmail.com'>
                    shayuyingshi@gmail.com
                  </a>
                  进行说明，我们将立即删除内容，保护版权所有者的权益。
                  <br />
                  <br />
                  <a className='hover-blue custom-link' href={'/privacy'}>
                    隐私协议
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                  <a className='hover-blue custom-link' href={'/service'}>
                    用户服务协议
                  </a>
                  <br />
                  Copyright © 2024 shayuyingshi.com All Rights Reserved
                </div>
              </div>
            </ScrollView>

            {/* <div className='w-screen h-[100dvh] flex flex-col bg-[#000000]'>
              <Header />
              <ModalOverlays/>
              <ScrollView>
                <>
                    {children}
                    <div className='fixed bottom-[60px] w-full justify-center'>
                      <MyFooter2 />
                    </div>

                    <div
                      className='fixed bottom-0 w-full bg-[#161616eb] pt-2'
                      style={{ backdropFilter: 'blur(3px)' }}
                    >
                      <MyFooter />
                    </div>

                    <div
                      className='px-8 py-3 desktop'
                      style={{
                        marginTop: '5rem',
                        width: '100%',
                        textAlign: 'center',
                        backgroundColor: '#1D2023',
                        fontSize: '14px',
                        borderTop: '1px solid hsla(0, 0%, 100%, .05)',
                      }}
                    >
                      <div
                        style={{
                          color: '#6B6B6B !important',
                          lineHeight: '24px',
                        }}
                      >
                        版权声明：鲨鱼影视内容均来自互联网，不提供存储/录制/上传。
                        <br />
                        如果鲨鱼影视提供内容侵犯了您的版权，请发送电子邮件至
                        <a href='mailto:shayuyingshi@gmail.com'>
                          shayuyingshi@gmail.com
                        </a>
                        进行说明，我们将立即删除内容，保护版权所有者的权益。
                        <br />
                        <br />
                        <a className='hover-blue custom-link' href={'/privacy'}>
                          隐私协议
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                        <a className='hover-blue custom-link' href={'/service'}>
                          用户服务协议
                        </a>
                        <br />
                        Copyright © 2024 shayuyingshi.com All Rights Reserved
                      </div>
                    </div>
                </>
              </ScrollView>
            </div> */}
          </Providers>
        </body>
      </html>
    </>
  );
}
