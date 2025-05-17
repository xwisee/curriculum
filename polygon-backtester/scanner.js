const WebSocket = require('ws');

const apiKey = process.env.POLYGON_API_KEY;
const tickers = process.argv.slice(2);
if (!apiKey) {
  console.error('POLYGON_API_KEY environment variable required');
  process.exit(1);
}

const ws = new WebSocket('wss://socket.polygon.io/stocks');

ws.on('open', () => {
  ws.send(JSON.stringify({ action: 'auth', params: apiKey }));
  const symbols = tickers.length ? tickers.join(',') : 'T.*';
  ws.send(JSON.stringify({ action: 'subscribe', params: symbols }));
});

ws.on('message', data => {
  try {
    const messages = JSON.parse(data);
    messages.forEach(msg => {
      if (msg.ev === 'T' && msg.v > 10000) {
        console.log(`${msg.sym} traded ${msg.v} @ ${msg.p}`);
      }
    });
  } catch (err) {
    console.error('parse error', err);
  }
});

ws.on('error', err => console.error('WebSocket error', err));
