import React from 'react';

export default function Page ({params}) {

  const redirect = params.slug?.join('/') || 'sports'

  return (
    <>
      <div className='desktop w-full flex flex-1 flex-col'>
        <iframe
          className={'flex-1'}
          src={`https://iframe.aha888.vip/${redirect}`}
        />
      </div>
      <div className="mobile w-screen h-full">
        <iframe
          className={'w-full h-full'}
          src={`https://iframe-m.aha888.vip/${redirect}`}
        />
      </div>
    </>
  )
}
