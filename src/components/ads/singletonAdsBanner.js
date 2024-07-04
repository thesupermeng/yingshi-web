import React, { useEffect } from 'react';
import initAds from './initAds'; // Adjust the import path as needed

const SingletonAdsBanner = () => {
  useEffect(() => {
    initAds();
  }, []);

  return <div>Component Content</div>;
};

export default SingletonAdsBanner;