import express from "express";


import http from "http";

import { WebSocketServer } from "ws";


const app = express();
app.use(express.static("public"));

const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true });
let i = 1;
let game;
let state = {
  player1: {
    newHead:  {
      x : 3,
      y : 10,
    },
    d: "RIGHT",
    snake: [
      {x: 3, y: 10},
      {x: 2, y: 10},
      {x: 1, y: 10},
    ],
  },
  player2: {
    newHead:  {
      x : 15,
      y : 5,
    },
    d: "DOWN",
    snake: [
      {x: 15, y: 5},
      {x: 15, y: 4},
      {x: 15, y: 3},
    ],
  },
  food: {
    x: 1,
    y: 1
  },
};

let idset = 1;

// upgrade event - websocket communication
server.on("upgrade", (req, socket, head) => {
  console.log("Upgrade event client: ", req.headers);

  // use authentication - only logged in users allowed ?
  // socket.write('HTTP/1.1 401 Unauthorized\r\nWWW-Authenticate: Basic\r\n\r\n');
  // socket.destroy();
  // return;

  // start websocket
  wss.handleUpgrade(req, socket, head, (ws) => {
      console.log("let user use websocket...");

       wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, client) => {
  console.log(`Client connected from IP ${ws._socket.remoteAddress}`);
  console.log(`Number of connected clients: ${wss.clients.size}`);
  
  
  ws.id = idset;
  idset++;
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify({ type: "id", payload: client.id }));

    if(wss.clients.size % 2 === 0 && wss.clients.size != 0 && i === 1) {
      game = setInterval(sendInfo,1000);
      i++;
      }
    });

  ws.on("close", () => {
    console.log("Client disconnected\n");
    if(ws.id % 2 === 0) idset = 2;
    else idset = 1;
  });

  

  ws.on("message", (data) => {
    //console.log(state.player2.snake[0].x);
    let message = JSON.parse(data);
    switch(message.type){
      case "gameLogic1":
        let initGameLogic1 = message.payload;
        state.player1 = initGameLogic1.first;
        break;
      case "gameLogic2":
        let initGameLogic2 = message.payload;
        state.player2 = initGameLogic2.first;
        break;
      case "sendFood":
        let newFood = message.payload;
        state.food = newFood;
        break;
        case "end":
          clearInterval(game);
          i = 1;
          break;
          

    }
  });

  





})
function sendInfo() {
  //console.log(state.player2.snake[0].x);
  wss.clients.forEach((client) => client.send(JSON.stringify({ type: "stateInfo", payload: state })));
}

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});