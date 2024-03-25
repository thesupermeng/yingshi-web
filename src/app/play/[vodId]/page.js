'use client';
import { PlayVod } from './playVod';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {

  const params = useParams();
  const vodId = params.vodId;

  return <PlayVod vodId={vodId}/>;
}
