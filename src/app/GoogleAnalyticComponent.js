'use client';
import { useEffect } from 'react';

const GoogleAnalyticComponent = () => {

  useEffect(() => {
    // Google Analytics script
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-VRZW8QLRHZ';
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-VRZW8QLRHZ');

    return () => {
      // Clean up function if needed
      // For example, if you need to remove the script element
      document.head.removeChild(script);
    };
  }, []);

  return (
  <></>
  );
};

export default GoogleAnalyticComponent;
