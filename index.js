const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  const targetUrl = 'https://graph.facebook.com' + req.url;

  const options = {
    method: req.method,
    headers: {
      'content-type': req.headers['content-type'] || 'application/json',
    },
  };

  const proxyReq = https.request(targetUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    res.writeHead(500);
    res.end('Proxy error: ' + err.message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Proxy server running on port ' + PORT);
});
