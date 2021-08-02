const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//variables
var game = false;
var scoreMaker;
var score;
var highscore;
var player;
var obstacleArray = [];
var gameSpeed;
var currentGameSpeed;
var playerStatus = 'down';
var power1Status = false;
var power2Status = false;
var power1Present = false;
var power2Present = false;
var initialPower1Time = 10;
var initialPower2Time = 5;
var a=1000;
var b=500;
var isPower1 = 'off';
var isPower2 = 'off';

var displayScore = document.getElementById('score');
var displayHighscore = document.getElementById('highscore');
var startAudio = document.getElementById('startaudio');
var stopAudio = document.getElementById('stop');
var hit = document.getElementById('hit');

var startGame = document.getElementById('start');
startGame.innerHTML = 'Start Game';


let initialSpawnTimer = 150;
let spawnTimer = initialSpawnTimer;
var animationId;



//eventlisteners

document.addEventListener('keyup', function(event){
  if(event.keyCode == '32'){
    playerStatus = (playerStatus== 'down') ? 'up' : 'down';
  }
})

startGame.addEventListener('click', ()=>{
  
  if(game == false){
    animate();
    startGame.style.visibility = 'hidden';
    game = true;

    startAudio.play();
    
  }
})


//class for player

function Point( x, y){
  this.x = x;
  this.y = y;
}


function Triangle(color) {

  this.color = color;
  this.vertices = [];
  this.addVertices = function (playerStatus){
      if(playerStatus == 'down'){
          this.vertices[0] = new Point(200, 390);
          this.vertices[1] = new Point(230, 390);
          this.vertices[2] = new Point(215, 320); 
          if(power1Status == true){
            ctx.beginPath();
            ctx.fillStyle = 'rgba(209,171,2,0.5)';
            ctx.arc(215, 360,40, 0, Math.PI*2 );
            ctx.fill();
            
          }
          
      }
      if(playerStatus == 'up'){
          this.vertices[0] = new Point(200, 210);
          this.vertices[1] = new Point(230, 210);
          this.vertices[2] = new Point(215, 280); 
          
          if(power1Status == true){
            ctx.beginPath();
            ctx.fillStyle = 'rgba(209,171,2,0.5)';
            ctx.arc(215, 240,40, 0, Math.PI*2 );
            ctx.fill();
            

          }
      }
      
      
  }

  this.Draw = function(){
    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
    ctx.lineTo(this.vertices[2].x, this.vertices[2].y);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

  }
}

//class for obstacles-holes and powerup-square

class Obstacles {
  constructor ( name, x, y, width, height, color){
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.dx = -gameSpeed ;
  }
  Update(){
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }
  Draw(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

  }

}
//class for obstacles-balls and powerup-balls

class Ball {
  constructor(name,x,y,r,sa,ea, color){
      this.name = name;
      this.x = x;
      this.y=y;
      this.r=r;
      this.sa=sa;
      this.ea=ea;
      this.dy = 2;
      this.status;
      this.color = color;

  }
  draw(){
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x,this.y, this.r, this.sa, this.ea);
      ctx.fill();

  }
  Update(){

     
      if(this.name=='ball'){

        this.draw();
        if(this.y==370){
          this.status='down';
        }
        if(this.y==230){
          this.status='up';
        }
        if(this.status=='down'){
          this.y -= this.dy;
        }
        if(this.status=='up'){
          this.y += this.dy;
        }

        this.x -= gameSpeed;
      }
      if(this.name =='powerup' && power1Status == false){
        this.draw();
        this.x -= gameSpeed;
      }
      
     
      
  }
  

}
//spawning obstacles, powerups

function spawnObstacle(score){

  let size = random(50,150);
  let flip = random(1,100);
  let powerPosition = random(250, 350);
  
  var totsize = canvas.width;
  
  var lastobstacle = obstacleArray[0];
  
  if( obstacleArray.length > 1){

    var lastobstacle = obstacleArray[obstacleArray.length - 1];
    let xvalue = lastobstacle.x;
      
    switch(lastobstacle.name){
      case 'hole': totsize = xvalue + lastobstacle.width; break;
      case 'ball': totsize = xvalue + lastobstacle.r; break;
      case 'powerup': totsize = xvalue + lastobstacle.r ; break;
      case 'powerSlow': totsize = xvalue + lastobstacle.width; break;
    }
     
  }
  
  if(flip%2 == 0 && flip%5 != 0 ){
    var obstacle = new Obstacles('hole', 200 +  size + totsize, 0, size, 210, 'black');
      
  }
  if(flip%5 ==0 ){
    var obstacle = new Ball('ball', 200 + 20 + totsize ,370,20,0,Math.PI * 2, 'red');
      
  }
  if(flip%2 ==1 && flip%5 !=0 ) {
    var obstacle = new Obstacles('hole',200 + size + totsize , 390, size, canvas.height - 390, 'black');
      
  }

  if(score%100 == 0 && power1Present==false){
    var obstacle = new Ball('powerup',  200 + 20 + totsize ,powerPosition,20,0,Math.PI * 2, '#FFD700');
    power1Present = true;
  }

  if(gameSpeed>=6 && flip%10==0 && power2Present == false){
    
    var obstacle = new Obstacles('powerSlow', 200 + size + totsize, powerPosition, 40, 40, '#32CD32');
    power2Present = true;
    
  }
  obstacleArray.push(obstacle);
  
}
//generating random no.s
function random(min, max){

  return Math.round(Math.random()*(max - min) + min);
}
//initial setup
function start(){
  
  gameSpeed = 3;
  scoreMaker =0;
  score = 0;
  highscore = 0;
  if(window.localStorage.getItem('highscore')){
    highscore = window.localStorage.getItem('highscore');
  }
  player = new Triangle('#6E1A73');
  player.addVertices(playerStatus);
  player.Draw();
  land();

  

}

//wall and ceiling

function land(){

  ctx.beginPath();
  ctx.fillStyle = '#024554';
  ctx.fillRect(0, 0, canvas.width, 210);
  ctx.fillRect(0, 390, canvas.width, canvas.height - 390);
  ctx.closePath;
  
}
//functions for detecting collision between ball and player

function ballCollision(vertices, cx, cy, cr){
 
  var next = 0;
  for(let current=0; current < vertices.length; current++){
      next = current + 1;
      if(next == vertices.length){
          next = 0;
      }
      let vc = vertices[current];
      let vn = vertices[next];
      var iscollision = lineCircle(vc.x, vc.y, vn.x, vn.y, cx, cy, cr);
      if(iscollision){
          return true;
      } 
  }
  return false;


}
function lineCircle(x1, y1, x2, y2, cx, cy, cr){
  let inside1 = pointCircle(x1, y1, cx, cy, cr);
  let inside2 = pointCircle(x2, y2, cx, cy, cr);
  if(inside1 || inside2){
      return true;

  }
  let distx = x1 - x2;
  let disty = y1 - y2;
  let linelen = Math.sqrt( distx*distx + disty*disty);
  var dot = (((cx - x1)*(x2 - x1)) + ((cy - y1)*(y2 - y1))) / Math.pow(linelen, 2);

  var closestx = x1 + (dot * (x2 - x1));
  var closesty = y1 + (dot * (y2 - y1));
  
  let online = linePoint(x1, y1, x2, y2, closestx, closesty);
  if(!online){
      return false;
  }
  distx = closestx - cx;
  disty = closesty - cy;
  let distance = Math.sqrt( distx*distx + disty*disty);
  if(distance <= cr){
      return true;
  }
  return false;
}

function linePoint(x1, y1, x2, y2, pointx, pointy){

  let d1 = dist(x1, y1, pointx, pointy);
  let d2 = dist(x2, y2, pointx, pointy);
  let len = dist(x1, y1, x2, y2);

  if(d1+d2 == len){
      return true;
  }
  return false;


}

function pointCircle(x, y, cx, cy, cr){

   let dx = cx - x;
   let dy = cy - y;
   let distance = Math.sqrt(dx*dx + dy*dy);
   if(distance <= cr){
       return true;
   }
   return false;

}

function dist(x1, y1, x2, y2){

  let dx = x2 - x1;
  let dy = y2 - y1;
  let distance = Math.sqrt(dx*dx + dy*dy);
  return distance;
}
//functions for detecting collision between hole and square with player
function holeCollision(vertices, rx, ry, rw, rh){
  var next = 0;
  for(let current=0; current < vertices.length; current++){
      next = current + 1;
      if(next == vertices.length){
          next = 0;
      }
      let vc = vertices[current];
      let vn = vertices[next];
      var iscollision = lineRectangle(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
      if(iscollision){
          return true;
      } 
  }
  return false;


}

function lineRectangle(x1, y1, x2, y2, rx, ry, rw, rh){

    let left = lineLine(x1, y1, x2, y2, rx, ry, rx, ry+rh);
    let right = lineLine(x1, y1, x2, y2, rx+rw, ry, rx+rw, ry+rh );
    let top = lineLine(x1, y1, x2, y2, rx, ry, rx+rw, ry);
    let bottom = lineLine(x1, y1, x2, y2, rx, ry+rh, rx+rw, ry+rh);

    if(left || right || top || bottom){
        return true;
    }
    return false;
}

function lineLine(x1, y1, x2, y2, startx, starty, endx, endy){

    let A = ((endx - startx)*(y1 - starty) - (endy - starty)*(x1 - startx)) / ((endy - starty)*(x2 - x1) - (endx - startx)*(y2 - y1));
    let B = ((x2 - x1)*(y1 - starty) - (y2 - y1)*(x1 - startx)) / ((endy - starty)*(x2 - x1) - (endx - startx)*(y2 - y1));

    if(A>=0 && A<=1 && B>=0 && B<=1){
        return true;
    }
    return false;
}

//to-do after collision
function collisionResult(){
 
  startGame.style.visibility = 'visible';
  startGame.innerHTML = 'Game Over!!';
  obstacles = [];
  spawnTimer = initialSpawnTimer;
  gameSpeed = 1;
  window.localStorage.setItem('highscore',highscore);
  window.cancelAnimationFrame(animationId);
  startAudio.pause();
  stopAudio.play();
}
//time interval after hitting powerups
//for balls
function power_1_Time(is){
  if(is== 'on'){
    a--;
    if(a>=0 && a%100 == 0){
      initialPower1Time -= 1;
      document.getElementById('power1').innerHTML = initialPower1Time;
    }
    
    if(initialPower1Time == 0){
     
      power1Status = false;
      power1Present = false;
      isPower1 = 'off';
      document.getElementById('power1').style.visibility = 'hidden';
      document.getElementById('power1').innerHTML = initialPower1Time;

    }

  }
}
//for squares
function power_2_Time(is){
  if(is == 'on'){
    b--;
    if(b>=0 && b%100 == 0){
      initialPower2Time -= 1;
      document.getElementById('power2').innerHTML = initialPower2Time;
    }
    
    if(initialPower2Time == 0){
     console.log(power2Present);
      power2Status = false;
      power2Present = false;
      isPower2 = 'off';
      document.getElementById('power2').style.visibility = 'hidden';
      document.getElementById('power2').innerHTML = initialPower2Time;

      gameSpeed = currentGameSpeed;

    }

  }
  
}

//animation
function animate(){

  
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  land();
  //player flipping
  switch(playerStatus){
    case 'up':
        player.addVertices('up');
        break;
    case 'down':
        player.addVertices('down');
        break;
    
  }
  player.Draw();
  
  spawnTimer--;
  if(spawnTimer <= 0){
    spawnObstacle(score);
    spawnTimer = initialSpawnTimer - gameSpeed*15;

    /*if(spawnTimer <30 game){
      spawnTimer = 30;
    }*/
    if(gameSpeed>=6){
      spawnTimer = 1;
    }
    
  }
  
  
  for(let i=0; i< obstacleArray.length ; i++){
    let o = obstacleArray[i];

    if(o.x + o.width < 0 || o.x + o.r < 0){

      obstacleArray.splice(i,1);
      i--;
    
      switch(o.name){
        case 'powerup':  power1Present=false; break;
        case 'powerSlow': power2Present = false; break;
      }
    }

    if(o.name == 'ball' && power1Status==false){
      let collided = ballCollision(player.vertices, o.x, o.y, o.r);
      if(collided){
          collisionResult();
        }
    }
   
    if(o.name == 'hole' && power1Status == false){
      let collided = holeCollision(player.vertices, o.x, o.y, o.width, o.height);

      if(collided){
          collisionResult();
        }
    }
    if(o.name == 'powerup'  && power1Status == false){
      
      let collided = ballCollision(player.vertices, o.x, o.y, o.r);
      
      if(collided){
        obstacleArray.splice(i,1);
        i--;
         
         power1Status = true;
         
         a=1000;
         initialPower1Time = 10;
         isPower1 = 'on';
         document.getElementById('power1').style.visibility = 'visible';
         document.getElementById('power1').innerHTML = initialPower1Time;
         hit.play();
        
      }
    }
    if(o.name == 'powerSlow' && power2Status == false){
      let collided = holeCollision(player.vertices, o.x, o.y, o.width, o.height);
      if(collided){
        obstacleArray.splice(i, 1);
        i--;

        gameSpeed = 3;

        power2Status = true;
        b = 500;
        initialPower2Time = 5;
        isPower2 = 'on';
        document.getElementById('power2').style.visibility = 'visible';
        document.getElementById('power2').innerHTML = initialPower2Time;
        hit.play();

      }
      

    }
    
    o.Update();
  }
  
  power_1_Time(isPower1);
  power_2_Time(isPower2);

  
  displayScore.innerHTML = 'Score : '+ score;
  if(score > highscore){
    highscore = score;
    
  }
  displayHighscore.innerHTML = 'Highscore : ' + highscore;
  scoreMaker++;
  if(scoreMaker % 10 == 0){
    score++;
  }

  if(scoreMaker%1000 == 0){
    if(power2Status == false){
      gameSpeed += 1;
      currentGameSpeed = gameSpeed;
    }
   
    spawnObstacle(score);
    
  }
}

start();





