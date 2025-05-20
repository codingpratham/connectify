// websocket/index.ts
import { Server as WebSocketServer, WebSocket } from 'ws';

interface User {
  socket: WebSocket;
  room: string;
}

const allSocket: User[] = [];

export const initWebSocket = (server: any) => {
  const wss = new WebSocketServer({ server });

wss.on('connection',(socket)=>{

   socket.on('message',(message)=>{
    //@ts-ignore
     const parsedMessage = JSON.parse(message)

     if(parsedMessage.type === "join"){
        allSocket.push({
            socket,
            room:parsedMessage.payload.roomId
        })
     }

     if(parsedMessage.type === "chat"){
        let currentUserRoom= null
        for(let i=0 ; i<allSocket.length ; i++){
            if(allSocket[i].socket==socket){
                currentUserRoom=allSocket[i].room
            }
        }

        for(let i=0 ; i<allSocket.length ; i++){
            if(allSocket[i].room == currentUserRoom){
                allSocket[i].socket.send(parsedMessage.payload.message)
            }
        }

     }
   })
})

  console.log('✅ WebSocket server initialized');
};
