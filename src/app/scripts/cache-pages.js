const fetch = require('node-fetch');

const pages = [

];

async function cachePages() {
  const baseUrl = 'https://shayutv.com'; // Your live domain

  for (const page of pages) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay between requests to prevent overload
      const res = await fetch(`${baseUrl}${page}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        console.log(`Cached: ${page}`);
      } else {
        console.error(`Failed to cache ${page}: ${res.statusText}`);
      }
    } catch (error) {
      console.error(`Error caching ${page}:`, error);
    }
  }
}

cachePages()
  .then(() => console.log('Pages cached successfully'))
  .catch(error => console.error('Error caching pages:', error));
