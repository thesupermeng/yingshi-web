'use client'
import React from 'react';
import H5Page from '@/app/payment/h5Page';

export default function Page () {
  return (
    <div>
      <div className='desktop w-screen' style={{paddingTop: '100px', minHeight: '80vh'}}>
        desktop
      </div>
      <div className="mobile w-screen h-screen">
        <H5Page/>
      </div>
    </div>
  )
}
