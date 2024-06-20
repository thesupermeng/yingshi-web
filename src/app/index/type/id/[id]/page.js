import React from 'react';
import {redirect} from 'next/navigation';
import Home from '@/app/page';

export default function Page({ params }) {
  const id = params.id;
  const headerId = [1, 2, 3, 4, 5, 6, 7, 99];
  const isInteger = (str) => {
    return /^\d+$/.test(str);
  };

  if (isInteger(id)) {
    const intId = parseInt(id);
    if (intId === 0) {
      redirect('/');
    } else if (intId === 998) {
      redirect('/topic/index/page');
    } else if (intId === 999) {
      redirect('/vod/show/by/time/id/1')
    } else if (headerId.includes(intId)) {
      // No routing needed, return to render Home component below
      return <Home category={parseInt(id)} />;
    } else {
      redirect('/404');
    }
  } else {
    redirect('/404');
  }
}
