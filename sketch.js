var gameStarted;
var gameOver;

var myPlayer;
var enemies;
var coins;
var canJump;
var isFacingRight;
var ground;
var rightWall;
var leftWall;
var offscreenRight;
var offscreenLeft;
var offscreenBottom;

var newEnemy;
var enemySpawnInterval = 10000;
var lastEnemySpawned = 0;

var newCoin;
var coinSpawnInterval = 5000;
var lastCoinSpawned = 0;

var GRAVITY = 1;
var JUMP = 20;
var score = 0;
var gameStartedTime = 0;

var MIN_POLICEMAN_SPEED = -1.0;	  
var MAX_POLICEMAN_SPEED = -7.0;  
var policemanSpeed = MIN_POLICEMAN_SPEED;

var leftOrRightPoliceman;

var jumpSound;
var coinSound;
var deathSound;

var titolScore;
var jsonFile;

var imageBackground;

function preload(){
  jsonFile = loadJSON("myjsonfile.json");
}

function setup(){
  jumpSound = loadSound('sounds/jumpSound.mp3');
  coinSound = loadSound('sounds/coinSound.mp3');
  deathSound = loadSound('sounds/deathSound.mp3');

  var cnv = createCanvas(665, 333);
  cnv.parent('contenidor_canvas');

  imageBackground = loadImage("pictures/backgroundpicture.png");

  titolScore = createElement( 'h4' ,'SCORE: ' + score);
  titolScore.position(200,200);

  prepareTheGame();

  myPlayer = createSprite();
  
	myPlayer.addAnimation("idleright", "pictures/player-right-idle-0.png", "pictures/player-right-idle-1.png");
  myPlayer.addAnimation("runningright", "pictures/player-right-0.png", "pictures/player-right-3.png");
  myPlayer.addAnimation("runningleft", "pictures/player-left-0.png", "pictures/player-left-3.png");
  myPlayer.addAnimation("jumpingright", "pictures/player-right-jump-0.png", "pictures/player-right-jump-1.png");
  myPlayer.addAnimation("jumpingleft", "pictures/player-left-jump-0.png", "pictures/player-left-jump-1.png");
  myPlayer.addAnimation("idleleft", "pictures/player-left-idle-0.png", "pictures/player-left-idle-1.png");
  
	myPlayer.scale = .2;

  myPlayer.position.x = width/2;
  myPlayer.position.y = height/2 + 120;
  
  ground = createSprite(width / 2, height, width, 10);     
  rightWall = createSprite(width, height/2, 10, height);
  leftWall = createSprite(0, height/2, 10, height);
  offscreenLeft = createSprite(-200, height/2, 10, height);
  offscreenRight = createSprite(width + 200, height/2, 10, height);
  offscreenBottom = createSprite(width/2, height + 200, width, 10);
  

  enemies = new Group();
  coins = new Group();

  gameStartedTime = millis();
}

function draw(){
  background(imageBackground);
  //background(192,192,192);
  
	if(!gameOver) {
		if(!gameStarted) {
			// --- INITIAL MENU ---
			textSize(50);
      textAlign(CENTER, CENTER);
      fill(255);
			text(jsonFile.begintext, width/2, height/2);
			if(keyWentDown("b")) {                                      
        gameStarted = true;
        if(lastEnemySpawned != gameStartedTime){
          lastEnemySpawned = millis();
        }
        if(lastCoinSpawned != gameStartedTime){
          lastCoinSpawned = millis();
        }
			}
    } 
    else{
			// --- GAME IS CURRENTLY RUNNING ---
      doGameStuff();
		}
 
  } 
  else{
		// --- SHOW GAME OVER TEXT ---
		textSize(50);
    textAlign(CENTER, CENTER);
    fill(255);
    text(jsonFile.gameovertext + "\nFINAL SCORE: " + score, width/2, height/2);
 
		if(keyWentDown("r")) {
      prepareTheGame();
      restartTheGame();
		}	
	}
}

function prepareTheGame(){
	gameStarted = false;
  gameOver = false;
  canJump = false;
  isFacingRight = true;
}

function restartTheGame(){
  myPlayer = createSprite();
  
	myPlayer.addAnimation("idleright", "pictures/player-right-idle-0.png", "pictures/player-right-idle-1.png");
  myPlayer.addAnimation("runningright", "pictures/player-right-0.png", "pictures/player-right-3.png");
  myPlayer.addAnimation("runningleft", "pictures/player-left-0.png", "pictures/player-left-3.png");
  myPlayer.addAnimation("jumpingright", "pictures/player-right-jump-0.png", "pictures/player-right-jump-1.png");
  myPlayer.addAnimation("jumpingleft", "pictures/player-left-jump-0.png", "pictures/player-left-jump-1.png");
  myPlayer.addAnimation("idleleft", "pictures/player-left-idle-0.png", "pictures/player-left-idle-1.png");
  
	myPlayer.scale = .2;

  myPlayer.position.x = width/2;
  myPlayer.position.y = height/2 + 120;

  enemySpawnInterval = 10000;

  MIN_POLICEMAN_SPEED = -1.0;	  
  MAX_POLICEMAN_SPEED = -7.0;  
  policemanSpeed = MIN_POLICEMAN_SPEED;

  score = 0;
  titolScore.html("SCORE: " + score);
}

function doGameStuff() {
  // -- MY PLAYER MOVEMENTS -- Need to consider 6 states: runningright, runningleft, idleright, idleleft, jumpingright, jumpingleft
  myPlayer.velocity.y += GRAVITY;

  if (myPlayer.collide(ground)) {
    canJump = true;
    myPlayer.velocity.y = 0;
    myPlayer.velocity.x = 0;

    if(isFacingRight){
      myPlayer.changeAnimation("idleright");
    }
    if(!isFacingRight){
      myPlayer.changeAnimation("idleleft");
    }
    if(keyIsDown(RIGHT_ARROW)){       
      isFacingRight = true;
      myPlayer.changeAnimation('runningright');
      myPlayer.position.x = myPlayer.position.x + 3;
    }
    if(keyIsDown(LEFT_ARROW)){
      isFacingRight = false;
      myPlayer.changeAnimation('runningleft');
      myPlayer.position.x = myPlayer.position.x - 3;
    }
  }

  if(canJump){
    if (keyWentDown("j")) {
      canJump = false;
      jumpSound.play();
      if(isFacingRight){
        myPlayer.changeAnimation("jumpingright");
        if(keyIsDown(RIGHT_ARROW)){
          myPlayer.velocity.y = -JUMP;
          myPlayer.velocity.x = +JUMP/5;
        }
        else{
          myPlayer.velocity.y = -JUMP;
        }
      }
      if(!isFacingRight){
        myPlayer.changeAnimation("jumpingleft");
        if(keyIsDown(LEFT_ARROW)){
          myPlayer.velocity.y = -JUMP;
          myPlayer.velocity.x = -JUMP/5;
        }
        else{
          myPlayer.velocity.y = -JUMP;
        }
      }
    }
  }

  //We spawn a new policeman:
  if (millis() > lastEnemySpawned + enemySpawnInterval) {

    leftOrRightPoliceman = int(random(0,2));

    if(leftOrRightPoliceman == 1){
      newEnemy = createSprite();
      newEnemy.addAnimation("enemyrunningleft", "pictures/enemy-left-0.png", "pictures/enemy-left-3.png");
      newEnemy.scale = .2;

      newEnemy.position.x = width + 100;
      newEnemy.position.y = height/2 + 114;

      newEnemy.velocity.x = policemanSpeed;
    
      //newEnemy.setDefaultCollider();
      newEnemy.setCollider("rectangle",0,0,30,30);
      enemies.add(newEnemy);

      lastEnemySpawned = millis();

      // increase speed of policemans going by
      policemanSpeed = constrain(policemanSpeed - .2, MAX_POLICEMAN_SPEED, MIN_POLICEMAN_SPEED);

      // increase frequency of police spawns to match using... map!
      enemySpawnInterval = map(policemanSpeed, MIN_POLICEMAN_SPEED, MAX_POLICEMAN_SPEED, 10000, 3000);
    }
    if(leftOrRightPoliceman == 0){
      newEnemy = createSprite();
      newEnemy.addAnimation("enemyrunningright", "pictures/enemy-right-0.png", "pictures/enemy-right-3.png");
      newEnemy.scale = .2;

      newEnemy.position.x = -100;
      newEnemy.position.y = height/2 + 114;

      newEnemy.velocity.x = policemanSpeed * (-1);

      //newEnemy.setDefaultCollider();
      newEnemy.setCollider("rectangle",0,0,30,30);
      enemies.add(newEnemy);

      lastEnemySpawned = millis();

      policemanSpeed = constrain(policemanSpeed - .2, MAX_POLICEMAN_SPEED, MIN_POLICEMAN_SPEED);

      enemySpawnInterval = map(policemanSpeed, MIN_POLICEMAN_SPEED, MAX_POLICEMAN_SPEED, 10000, 3000);
    }

  }

  //We spawn a new coin:
  if(millis() > lastCoinSpawned + coinSpawnInterval){
    newCoin = createSprite();
    newCoin.addAnimation("coinanimation", "pictures/coin-0.png", "pictures/coin-1.png");
    newCoin.scale = .2;

    newCoin.position.x = int(random(50, width-50));  
    newCoin.position.y = -100;

    newCoin.velocity.y = 3;
    
    //newCoin.setDefaultCollider();
    newCoin.setCollider("circle",0,0,10);

    coins.add(newCoin);

    lastCoinSpawned = millis();
  }

  myPlayer.collide(rightWall);
  myPlayer.collide(leftWall);

  myPlayer.overlap(enemies, hitEnemy);
  myPlayer.overlap(coins, getCoin);
  offscreenLeft.overlap(enemies, deleteEnemy);
  offscreenRight.overlap(enemies, deleteEnemy);
  offscreenBottom.overlap(coins, deleteCoin);

  drawSprites();
}


function deleteEnemy(col1, col2) {
  col2.remove();
  score = score + 1;
  titolScore.html("SCORE: " + score);
}

function deleteCoin(col1, col2){
  col2.remove();
}

function getCoin(col1, col2){
  col2.remove();
  coinSound.play();
  score = score + 5;
  titolScore.html("SCORE: " + score);
}

function hitEnemy(col1, col2) {
  deathSound.play();
  gameOver = true;
  col1.remove(); //We destroy our player
  enemies.removeSprites();  //We destroy all the possible policemans in the scene
  coins.removeSprites();  //We destroy all the possible coins in the scene
}

