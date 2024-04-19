import './globals.css';
import '../asset/style/custom-bs.css';
import '../asset/style/cms.css';

import { Inter } from 'next/font/google';
import { Providers } from '@/store/Provider';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

import MyFooter from '@/components/myFooter';
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

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  referrer: 'no-referrer',
  title: Config.MetaTitle,
  description:
    'Experience the thrill of live sports and exciting betting, all in one platform! Dive into the latest games, enjoy live streams, and place your bets effortlessly. Join us now for sports and betting excitement like never before!',
};
export const viewport = {
  themeColor: '#000000',
};
export default function RootLayout({ children }) {
  return (
    <html
    translate="no"
      lang='en'
      className={`bg-sideMenu notranslate ${
        isWeb()
          ? 'webcontent h-full overflow-x-auto overflow-y-hidden'
          : 'h5content overscroll-none'
      } relative w-[100vw]`}
      // className={`bg-sideMenu ${
      //   isWeb() ? 'webcontent min-w-[1360px] min-h-[500px]' : 'h5content'
      // } overflow-x-auto overflow-y-hidden relative w-[100vw] h-[100vh]`}
    >
      <Head>
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
        className={`${
          inter.className
        } h-full bg-sideMenu text-white flex flex-col w-full overscroll-none overflow-auto ${
          isWeb() ? '' : 'min-h-[100svh]'
        }`}
      >
        <Providers>
          <div className='w-screen h-screen flex flex-col'>
            <Header />
            <div
              className='flex-1 overflow-y-scroll flex flex-col'
              style={{ alignItems: 'center' }}
            >
              {children}
              {/* </div> */}
              {/* <H5Perpetual /> */}
              {/* <LiveChat /> */}
              {/* <H5LiveChat /> */}
              {/* </div> */}
              {/* </div> */}
            </div>
            <MyFooter />
          </div>
          {/* <WEBOnly>
            <div className='absolute top-0 bottom-0 left-0 right-0 bg-sideMenu container w-full '>
              <Announcement />
              <div className='flex flex-row h-[100vh] overflow-y-auto w-full'>
                <div className='flex self-stretch flex-initial'>
                  <Sidebar />
                </div>
                <div className='flex flex-col flex-1 w-full'>
                  <div className='flex flex-initial absolute top-0 right-0 xl:static'>
                    <Header />
                  </div>
                  <div className='flex flex-1 bg-[#121212] overflow-x-auto mt-20 xl:mt-0'>
                    {children}
                  </div>
                  <div className='bg-[#121212] overflow-x-auto mt-20 xl:mt-0'>
                    {children}
                  </div> 
                </div>
                <RightSideMenu />
              </div>
            </div>
            <WebPerpetual />
            <LiveChat /> 
          </WEBOnly>
          <H5Only>
            <div className='w-full h-screen flex flex-col'>
              <Header />
              <div className='h-full overflow-y-scroll flex flex-col'>
                {children}
                {/* </div>
                {/* <H5Perpetual />
                {/* <LiveChat />
                {/* <H5LiveChat />
                {/* </div>
                {/* </div>
              </div>
            </div>
          </H5Only> */}
          {/* <ChatMessages />
          <NotifyMessages /> */}
        </Providers>
      </body>
    </html>
  );
}
