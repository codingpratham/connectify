// websocket/index.ts
import { Server as WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';

interface Client {
  socket: WebSocket;
  userId: string;
}

const clients = new Map<string, WebSocket>();

export const initWebSocket = (server: HTTPServer) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    let userId = '';

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);

        if (data.type === 'init') {
          userId = data.userId;
          clients.set(userId, ws);
          console.log(`User ${userId} connected`);
        }

        if (data.type === 'message') {
          const recipientSocket = clients.get(data.recipientId);
          if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
            recipientSocket.send(JSON.stringify({
              type: 'message',
              from: userId,
              content: data.content,
            }));
          }
        }
      } catch (error) {
        console.error('Invalid message format:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });

  console.log('WebSocket server initialized');
};
