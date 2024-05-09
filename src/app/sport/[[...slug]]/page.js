import React from 'react';

export default function Page ({params}) {

  const redirect = params.slug?.join('/') || 'sports'

  return (
    <>
      <div className='desktop w-full flex flex-1 flex-col'>
        <iframe
          className={'flex-1'}
          src={`https://iframe-web.aha666.site/${redirect}`}
        />
      </div>
      <div className="mobile w-screen h-full">
        <iframe
          className={'w-full h-full'}
          src={`https://iframe-h5.aha666.site/${redirect}`}
        />
      </div>
    </>
  )
}
