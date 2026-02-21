import { WebSocketServer } from 'ws';

const PORT = 3007;
const wss = new WebSocketServer({ port: PORT });

console.log(`Clock WebSocket server running on port ${PORT}`);

// Broadcast the current time to all connected clients every second
setInterval(() => {
  const now = new Date().toISOString();
  wss.clients.forEach((client) => {
    if (client.readyState === 1 /* WebSocket.OPEN */) {
      client.send(now);
    }
  });
}, 1000);

wss.on('connection', (ws) => {
  console.log('Client connected for clock sync');
  
  // Send immediate time upon connection
  ws.send(new Date().toISOString());

  ws.on('close', () => {
    console.log('Client disconnected from clock sync');
  });
});
