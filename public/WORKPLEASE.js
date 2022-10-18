

function init(e) {
  const canvas = document.querySelector("#canvas");
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  console.log('This is the context', ctx);
  
  const websocket = new WebSocket("ws://localhost:8080");

  const size = 25;
  let idset;
  let i = 1;
  let gameState = {
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
  
  
  //console.log(gameState.player.snake[0]);


  function collisionSelf(head,array){
  for(let i = 1; i < array.length; i++){
      if(head.x == array[i].x && head.y == array[i].y){
          return true;
      }
  }
    return false;
  }
  
  function collisionPlayer(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
      return false;
    }
  
  function initSnakeControl(){
    if(idset % 2 != 0) document.addEventListener("keydown",direction1);
    else if(idset % 2 === 0) document.addEventListener("keydown",direction2);
  
    function direction1(e){
        let key = e.keyCode;
        
        if( key == 37 && gameState.player1.d != "RIGHT")    gameState.player1.d = "LEFT";
        else if(key == 38 && gameState.player1.d != "DOWN") gameState.player1.d = "UP";
        else if(key == 39 && gameState.player1.d != "LEFT") gameState.player1.d = "RIGHT";   
        else if(key == 40 && gameState.player1.d != "UP")   gameState.player1.d = "DOWN";
        
        //console.log(idset);
    }
  
    function direction2(e){
      let key = e.keyCode;
      
      if( key == 37 && gameState.player2.d != "RIGHT")    gameState.player2.d = "LEFT";
      else if(key == 38 && gameState.player2.d != "DOWN") gameState.player2.d = "UP";
      else if(key == 39 && gameState.player2.d != "LEFT") gameState.player2.d = "RIGHT";   
      else if(key == 40 && gameState.player2.d != "UP")   gameState.player2.d = "DOWN";
      
      //console.log(gameState.player1.d);
  }
  }
  
  


  function initGameLogic1(state){
    let posX = state.player1.snake[0].x;
    let posY = state.player1.snake[0].y;
    //console.log(posX);
    //console.log(posY);
    
    if( state.player1.d === "LEFT") posX -= 1;
    if( state.player1.d === "UP") posY -= 1;
    if( state.player1.d === "RIGHT") posX += 1;
    if( state.player1.d === "DOWN") posY += 1;
    //console.log(state.player1.d);
    //console.log(posY);
    
    if(posX == state.food.x && posY == state.food.y){
        gameState.food = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        }
        websocket.send(JSON.stringify({ type: "sendFood", payload: gameState.food }));
    }else{
        
        gameState.player1.snake.pop();
    }
    
    //console.log(posX);
    //console.log(posY);
    
    gameState.player1.newHead = {
        x : posX,
        y : posY
    }
    //console.log(gameState.player1.newHead);
    
    
    // if(posX < 0 || posX > 20 || posY < 0 || posY > 20 || collision(state.player1.newHead,state.player1.snake) || collision(state.player1.newHead,state.player2.snake)){
    //   websocket.send(JSON.stringify({ type: "end"}));
        
    // }
    
    gameState.player1.snake.unshift(gameState.player1.newHead);
  }

  function initGameLogic2(state){
    let posX = state.player2.snake[0].x;
    let posY = state.player2.snake[0].y;
    //console.log(posX);
    //console.log(posX);
    //console.log(posY);

    if( state.player2.d == "LEFT") posX -= 1;
    if( state.player2.d == "UP") posY -= 1;
    if( state.player2.d == "RIGHT") posX += 1;
    if( state.player2.d == "DOWN") posY += 1;
    
    
    if(posX == state.food.x && posY == state.food.y){
        gameState.food = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        }
        websocket.send(JSON.stringify({ type: "sendFood", payload: gameState.food }));
        
    }else{
        
        gameState.player2.snake.pop();
    }
    
    //console.log(posX);
    //console.log(posY);
    
    gameState.player2.newHead = {
        x : posX,
        y : posY
    }
    //console.log(posX);
    //console.log(posY);
    
    
    // if(posX < 0 || posX > 19 || posY < 0 || posY > 19 || collision(state.player2.newHead,state.player2.snake) || collision(state.player2.newHead,state.player1.snake)){
        
    //   websocket.send(JSON.stringify({ type: "end"}));
    // }
    
    gameState.player2.snake.unshift(gameState.player2.newHead);
  }

  function draw(state){
     if(state.player1.newHead.x < 0 || state.player1.newHead.x > 19 || state.player1.newHead.y < 0 || state.player1.newHead.y > 19 || state.player2.newHead.x < 0 || state.player2.newHead.x > 19 || state.player2.newHead.y < 0 || state.player2.newHead.y > 19 || collisionSelf(state.player1.newHead,state.player1.snake) || collisionPlayer(state.player1.newHead,state.player2.snake) || collisionPlayer(state.player2.newHead,state.player1.snake) || collisionSelf(state.player2.newHead,state.player2.snake)){
        
       websocket.send(JSON.stringify({ type: "end"}));
     }
    ctx.reset();
    //console.log(gameState.player.newHead.x);
    for( let i = 0; i < state.player1.snake.length ; i++){
        ctx.fillStyle = "green";
        ctx.fillRect(state.player1.snake[i].x * size, state.player1.snake[i].y * size,size,size);
    }
    //console.log(state.player2);
    
    for( let i = 0; i < state.player2.snake.length ; i++){
      ctx.fillStyle = "red";
      ctx.fillRect(state.player2.snake[i].x * size, state.player2.snake[i].y * size,size,size);
  }
    ctx.fillStyle = 'blue';
    ctx.fillRect(state.food.x * size, state.food.y * size, size, size);
    //console.log(state.player.d);
    if(idset % 2 != 0) {
      //console.log(gameState.player1.snake[0].x);
      initGameLogic1(gameState);
      let message1 = { first: gameState.player1}; 
      console.log(gameState.player1.snake[0].x);
      console.log(gameState.player2.snake[0].x);
      websocket.send(JSON.stringify({ type: "gameLogic1", payload: message1 }))
    }
    else if(idset % 2 === 0){
      //console.log(gameState.player2.snake[0].x);
      //console.log(state);  
      initGameLogic2(gameState);}
      //console.log(gameState.player2.snake[0].x);
      let message2 = { first: gameState.player2};
      // console.log(message2);
      // console.log(message2.first);
      websocket.send(JSON.stringify({ type: "gameLogic2", payload: message2 }));
    
  }


  //let game = setInterval(draw,100);


  const handleSocketOpen = (e) => {
    console.log('Socket has been opened');
    //draw(gameState);
    //websocket.send(JSON.stringify(gameState));
  };
  const handleSocketMessage = (state) => {
    
  let info = JSON.parse(state.data);

    switch(info.type){ 
      case "id":
        idset = info.payload;
        console.log(idset);
        //draw(gameState);
        break;
      case "stateInfo":
        let gameOfState = info.payload;
        
        if(i === 1){
          initSnakeControl();
          i++;
        }
        
        gameState.food = gameOfState.food; 
        draw(gameOfState);
        //console.log(gameOfState);
    }


  //console.log(state.data);  
  
  };

  websocket.onopen = handleSocketOpen;
  websocket.onmessage = handleSocketMessage;



}


window.onload = init;