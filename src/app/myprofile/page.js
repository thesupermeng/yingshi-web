'use client'
import React from 'react';
import H5Page from '@/app/myprofile/h5Page';
import WebPage from '@/app/myprofile/webPage';

export default function Page () {
  return (
    <div>
      <div className='desktop w-screen' style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <WebPage/>
      </div>
      <div className="mobile w-screen p-4">
        <H5Page/>
      </div>
    </div>
  )
  }
