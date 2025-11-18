const http = require('http');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  // Common CORS headers so the browser at localhost:8000 can call this server
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    // Reply to preflight requests
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  if (req.method === 'GET' && req.url === '/health') {
    console.log('[mock] GET /health from', req.socket.remoteAddress);
    res.writeHead(200, Object.assign({ 'Content-Type': 'application/json' }, corsHeaders));
    return res.end(JSON.stringify({ status: 'ok', mock: true }));
  }

  if (req.method === 'POST' && req.url === '/predict') {
    // consume body (we don't need to parse multipart here)
    console.log('[mock] POST /predict from', req.socket.remoteAddress);
    let chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const size = chunks.reduce((s, c) => s + c.length, 0);
      console.log(`[mock] Received ${size} bytes in POST /predict`);
      // return a simple sample response similar to Roboflow detect output
      const sample = {
        predictions: [
          { class: 'Early Blight', confidence: 0.87 },
          { class: 'Healthy', confidence: 0.12 }
        ]
      };
      res.writeHead(200, Object.assign({ 'Content-Type': 'application/json' }, corsHeaders));
      res.end(JSON.stringify(sample));
    });
    return;
  }

  res.writeHead(404, Object.assign({ 'Content-Type': 'text/plain' }, corsHeaders));
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Mock server listening on http://localhost:${PORT}`);
});
