'use client'
import React from 'react';

export default function Page ({children}) {
  return (
    <>
      <div className='desktop w-full flex flex-1 flex-col'>
        <iframe
          className={'flex-1'}
          src={'https://iframe.ggsimida.com/home'}
        />
      </div>
      <div className="mobile w-screen h-full">
        <iframe
          className={'w-full h-full'}
          src={'https://iframe-m.ggsimida.com/home'}
        />
      </div>
    </>
  )
}
