import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'http';

const bare = createBareServer('/');
const port = parseInt(process.env.PORT || '8080');

const server = http.createServer((req, res) => {
  // CORS — allow agentiz S3 origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
    return;
  }

  // Health check / root
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('agentiz bare server ok');
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(port, () => {
  console.log(`[agentiz] bare server listening on :${port}`);
});
