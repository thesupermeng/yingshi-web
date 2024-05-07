'use client'
import React from 'react';
import H5Page from '@/app/payment/h5Page';

export default function Page () {
  return (
    <>
      <div className='desktop w-screen' style={{paddingTop: '100px', minHeight: '80vh'}}>
        desktop
      </div>
      <div className="mobile w-screen h-full">
        <H5Page/>
      </div>
    </>
  )
}
