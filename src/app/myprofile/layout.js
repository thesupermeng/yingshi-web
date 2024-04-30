'use client'
import React from 'react';
import H5Page from '@/app/myprofile/h5Page';
import WebPage from '@/app/myprofile/webPage';

export default function Layout ({children, subMenus}) {
  return (
    <div>
      <div className='desktop w-screen' style={{paddingTop: '100px', minHeight: '80vh'}}>
        <WebPage subMenus={subMenus}/>
      </div>
      <div className="mobile w-screen p-4">
        <H5Page/>
      </div>
    </div>
  )
}
