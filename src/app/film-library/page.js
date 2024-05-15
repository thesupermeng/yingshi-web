'use client';
import { FilmLibrary } from './filmLibrary';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {

  const params = useParams();

  return <FilmLibrary />;
}
