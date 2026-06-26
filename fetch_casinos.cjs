const https = require('https');

const urls = [
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/betluckmak/%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%8C%E0%B8%A3%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%85%E0%B9%81%E0%B8%88%E0%B8%81%E0%B8%8Ref%E0%B8%B4%E0%B8%95%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%85.jpg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/betluckmak/%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%A3%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%85%E0%B9%81%E0%B8%88%E0%B8%81%E0%B8%8Ref%E0%B8%B4%E0%B8%95%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%85.jpg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/betluckmak/%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%A3%E0%B8%A5%E0%B9%88%E0%B8%B2%E0%B8%AA%E0%B8%B8%E0%B8%94.jpg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/88fed/%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%A3.jpg'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url} -> ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
