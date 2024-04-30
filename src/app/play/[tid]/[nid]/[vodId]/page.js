'use client';
import { PlayVod } from './playVod';
import { PlayXVod } from './playXVod';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {

  const params = useParams();
  console.log(params);
  const vodId = params.vodId;
  const tId = params.tid;
  const nId = params.nid;

  return nId != 9999 ? <PlayVod vodId={vodId} tId={tId} nId={nId}/> : <PlayXVod vodId={vodId} tId={tId} nId={nId}/>;
}
