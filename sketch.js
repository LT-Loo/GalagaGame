//Global variables
let W = 800;
let H = W * (7/8);
let data;
let currentScreen = "START";
let font = new Array;
//Image variables
let star = new Array;
let rocketImg = new Array;
let enemyImg = new Array;
let bulletImg;
//Group variables
let enemyGroup = new Array;
let shotGroup;
//Sound or music variables
let startBgm, gameBgm, shootSound, gameOver, killSound, click;
let sound = "ON";
let soundSlide;
//Score variables
let lowKill = 0;
let highKill = 0;
let score = 0;
//Aircraft variabls
let fighter;
let r_ind;
let life = 2;
let explosion; //Animation
let pause, soundBtn; //Buttons
let vid; //Video

function preload() {
  data = loadJSON("data.json", loadData); //Load JSON file
  bulletImg = loadImage("Img/Attack.png"); //Load image of bullet
  //Load musics and sound effects
  click = loadSound("Bgm/Click.mp3");
  startBgm = loadSound("Bgm/Start.mp3");
  gameBgm = loadSound("Bgm/Game.mp3");
  shootSound = loadSound("Bgm/Shoot.mp3");
  killSound = loadSound("Bgm/Kill.mp3");
  gameOver = loadSound("Bgm/End.mp3");
  //Load animation of explosion
  explosion = loadAnimation("Img/Explosion/01.png", "Img/Explosion/09.png");
}

function setup() {
  print("setting up");
  createCanvas(W, H);
  angleMode(DEGREES);
  imageMode(CENTER);
  textAlign(CENTER);
  rectMode(CENTER);
  startBgm.setLoop(true);
  gameBgm.setLoop(true);
  startBgm.setVolume(0.5);
  startScreenSetup();
  buttonsNVideoSetup();
  spriteSetup();
}

//Draw screen according to variable "currentScreen"
function draw() {
  soundVol(); //Adjust volume of bgm and sound effects
  switch(currentScreen) {
    case "START" : drawStartScreen(); break;
    case "CHOOSE": drawChooseScreen(); break;
    case "LOADING" : drawLoadingScreen(); break;
    case "PLAY" : drawPlayScreen(); break;
    case "LEADERBOARD" : drawBoardScreen(); break;
  }
}

/***************PRELOAD FUNCTION***************/
//Load data after JSON file is read
function loadData() {
  //FOR loops to load images
  for (let i = 0; i < 3; i++) {
    rocketImg[i] = loadImage(data.rocket[i].path);
    star[i] = loadImage(data.star[i].path);
  }
  for (let i = 0; i < 2; i++) {
    enemyImg[i] = loadImage(data.enemy[i].path);
  }
  //FOR loop to load font
  for (let i = 0; i < 4; i++) {
    font[i] = loadFont(data.font[i].path);
  }
}

/***************SETUP FUNCTIONS***************/
let x = new Array;
let y = new Array;
let angle = new Array;
let startScreenRockets = new Array;
let starBg = new Array;
function startScreenSetup() { 
  //Create rotating aircrafts on Start Menu
  for (let i = 0; i < 3; i++) {
    angle[i] = 120 * i;
    x[i] = (W/2) + (W * (5/16) * cos(angle[i]));
    y[i] = H*(27*70) + (H/7 * sin(angle[i]));
    startScreenRockets[i] = createSprite(x[i], y[i], W/8, H/7);
    startScreenRockets[i].addImage(rocketImg[i]);
    startScreenRockets[i].rotation = angle[i];
    startScreenRockets[i].rotationSpeed = 1;
  }
  //Set properties for background stars
  for (let i = 0; i < W*(7/80); i++) {
    starBg[i] = {
      x : random(0, W),
      y : random(0, H),
      size : random(50, 150),
      img : random(star),
      brightness : random(-0.3, 0.3),
      count : 0,
      countMax : random(30, 60),
      speed : random(1, 2)
    }
  }
  //Create slider for sound and play bgm
  soundSlide = createSlider(0, 10, 5);
  soundSlide.size(W*(5/16), H/35);
  soundSlide.position((W/2)-125, H*(51/70));
  startBgm.setVolume(0.5);
  startBgm.play();
}

function buttonsNVideoSetup() {
  //"PAUSE" button
  pause = createButton("PAUSE");
  pause.size(W/8, H/28);
  pause.position(W*(69/80), H*(127/140));
  pause.mouseClicked(doPause);
  pause.hide();
  //"SOUND" button
  soundBtn = createButton("SOUND ON");
  soundBtn.size(W/8, H/28);
  soundBtn.position(W*(69/80), H*(19/20));
  soundBtn.mouseClicked(doSound);
  soundBtn.hide();
  //Video for Loading screen
  vid = createVideo("gameVideo.mp4");
  vid.size(W*(3/8), H*0.4);
  vid.position((W/2)-150, H*(8/35));
  vid.volume(0);
  vid.noLoop();
  vid.hide();
}

function spriteSetup() {
  shotGroup = new Group();
  for (let i = 0; i < 2; i++) {
    enemySpr[i] = new Array;
    enemyGroup[i] = new Group();
  }
}

/***************DRAW FUNCTIONS***************/
function drawBackground() {
  background(1, 1, 25);
  for (let i = 0; i < W*(7/80); i++) {
    image(starBg[i].img, starBg[i].x, starBg[i].y, starBg[i].size, starBg[i].size);
    starBg[i].size += starBg[i].brightness;
    starBg[i].count++;
    if (starBg[i].count >= starBg[i].countMax) {
      starBg[i].count = 0;
      starBg[i].brightness *= -1;
    }
  }
}

let r, g, b, count = 0; 
function drawStartScreen() {
  drawBackground();
  //Draw rotating aircrafts
  for (let i = 0; i < 3; i++) {
    angle[i]++;
    startScreenRockets[i].position.x = (W/2) - (W * (5/16) * cos(angle[i]));
    startScreenRockets[i].position.y = H*(2/7) - (H/7 * sin(angle[i]));
    drawSprite(startScreenRockets[i]);
  }
  startButtons(); //Create and draw options
  //Game title
  textFont(font[1]);
  fill(r, g, b);
  textSize(W/8);
  textLeading(W*0.1125);
  text("G A L A G A\nG A M E", W/2, H*(2/7));
  if (count > 60) { //Title changes colour every second
    count = 0;
    r = random(0, 256);
    g = random(0, 256);
    b = random(0, 256);
  }
  count++;
}

let ptro = 170, ptrx = 250, ptry = 170, float = 0.5;
function drawChooseScreen() {
  drawBackground();
  soundSlide.hide();
  textFont(font[1]);
  textSize(50);
  fill(30, 15, 255);
  text("CHOOSE  YOUR  AIRCRAFT", W/2, 100);
  textSize(35);
  text("Press ENTER or SPACEBAR to continue", W/2, 500);
  textFont(font[0]);
  textSize(30);
  fill(255);
  //FOR loop to display aircrafts' images and strengths
  for (let i = 0; i < 3; i++) {
    fill(0, 255, 220);
    text(data.rocket[i].name, i*200+250, 200);
    image(rocketImg[i], i*200+250, 300, 200, 200);
    fill(255, 0, 140);
    text("STRENGTH", 90, 400);
    fill(255)
    text(data.rocket[i].strength, i*200+250, 400);
  }
  //Create pointer for player to choose aircraft
  fill(100, 245, 90);
  stroke(10, 60, 10);
  strokeWeight(2);
  triangle(ptrx, ptry, ptrx-10, ptry-30, ptrx+10, ptry-30);
  ptry += float; //Create floating effect to pointer
  if (ptry >= ptro + 5 || ptry <= ptro - 5) {float *= -1;}
}

let loadCount = 0, n = -1;
function drawLoadingScreen() {
  drawBackground();
  soundSlide.hide();
  pause.hide();
  soundBtn.hide();
  textFont(font[2]);
  textSize(70);
  let load = "LOADING";
  //Display video
  fill(255);
  rect(W/2, 300, 305, 270);
  vid.play();
  vid.show();
  //FOR loop to create loading "bar"
  for (let i = 0; i < load.length; i++) {
    fill(255);
    text(load[i], i*70+190, 140);
    fill(140, 135, 230);
    circle(i*60+220, 480, 15);
    for (let j = 0; j <= n; j++) {
      image(enemyImg[1], j*60+220, 480);
    }
  }
  //Random loading duration
  let count = random(40, 120);
  if (loadCount >= count) {
    loadCount = 0;
    n++;
  }
  //Loading complete
  //Close video and change screen to Play screen
  if (n >= load.length) {
    n = 0;
    vid.stop();
    vid.hide();
    currentScreen = "PLAY";
  }
  loadCount++
}

let time = 0, timer = 60; 
function drawPlayScreen() {
  soundSlide.hide();
  pause.show();
  soundBtn.show();
  //Draw moving star background
  background(1, 1, 25);
  for (let i = 0; i < 70; i++) {
    image(starBg[i].img, starBg[i].x, starBg[i].y, starBg[i].size, starBg[i].size);
    if (pause.html() == "PAUSE") {starBg[i].y += starBg[i].speed;}
    if(starBg[i].y > H + 50) {starBg[i].y = -10;}
  }
  //Play bgm if sound button is on
  if (soundBtn.html() == "SOUND ON") {
    if (!gameBgm.isPlaying()) {gameBgm.play();}
  }
  //Draw sprites of aircrafts and enemies
  drawSprite(fighter);
  for (let i = 0; i < 2; i++) {drawSprites(enemyGroup[i]);}
  printScoreNTime(); //Display current score and time left
  if (pause.html() == "PAUSE") { //Condition : If game is NOT paused 
    motion(); //Control aircraft's movement
    enemyNumber(); //Create enemies
    if (enemyGroup[1].size() > 0) {checkBoundary();} //Side collision detection for high class enemy
    for (let i = 0; i <= shotCount; i++) {drawSprite(shot[i]);} //Draw bullet when spacebar is pressed
    checkCollision(); //Collision detection
    if (time % 60 == 0 && time < 3600) {timer--;} //Calculate time left
    time++;
 }
 //Time's up! Stop bgm and change screen to Leaderboard screen
 if (time >= 3600) {
   gameBgm.stop();
   currentScreen = "LEADERBOARD";
  }
}

function drawBoardScreen() {
  drawBackground();
  soundSlide.hide();
  pause.hide();
  soundBtn.hide();
  if (!startBgm.isPlaying() && !gameOver.isPlaying()) {startBgm.play();} 
  //Draw board and its content
  fill(50, 15, 140, 100);
  rect(W/2, H/2, 450, 600, 20);
  fill(255);
  textFont(font[3]);
  textSize(60);
  text("LEADER  BOARD", W/2, 100);
  //Colour of "OK" option changes depends of position of mouse
  if (mouseY >= 560 && mouseY <= 680 && mouseX >= 540 && mouseX <= 620) {
    fill("grey");
    text("OK", 580, 620);
  }
  else {
    fill(255);
    text("OK", 580, 620);
  }
  //Display player's final score
  fill(105, 105, 105, 50);
  rect(W/2, 210, 400, 150, 20);
  textFont(font[1]);
  textSize(30);
  fill(210, 200, 240);
  text("MY SCORE", W/2, 170);
  enemyImg[0].resize(80, 80);
  image(enemyImg[0], 250, 200);
  text(lowKill+" kills", 320, 210);
  enemyImg[1].resize(80, 80);
  image(enemyImg[1], 450, 205);
  text(highKill+" kills", 525, 210);
  text("TOTAL SCORE  " + score, W/2, 260);
  //Display ranking
  fill(250, 230, 10);
  text("R A N K I N G", W/2, 320);
  textSize(25);
  fill(240, 235, 145);
  for (let i = 0; i < 8; i++) {
    text(data.leaderboard[i].rank, 315, i*35+360);
    text(data.leaderboard[i].player, 378, i*35+360);
    text(data.leaderboard[i].score, 465, i*35+360);
  }
}

/***************START SCREEN FUNCTIONS***************/
//Adjust volume according to slider
function soundVol() {
  click.setVolume(soundSlide.value()/10);
  startBgm.setVolume(soundSlide.value()/10);
  gameOver.setVolume(soundSlide.value()/10);
  gameBgm.setVolume(soundSlide.value()/10);
  killSound.setVolume(soundSlide.value()/10);
  shootSound.setVolume(soundSlide.value()/10);
}

//Create buttons for Start Menu
function startButtons() {
  //"START GAME" option
  textFont(font[0]);
  fill(255);
  textSize(50);
  text("START GAME", W/2, 400, 270, 50);
  //Sound option
  if (sound == "ON") { //Sound ON
    if (startBgm.isPaused()) {startBgm.play()};
    text("SOUND   ON", W/2, 470, 220, 50);
    soundSlide.show();
  }
  else { //Sound OFF
    startBgm.pause();
    text("SOUND  OFF", W/2, 470, 250, 50);
    soundSlide.hide();
  }
  //Change colour when mouse point to option
  if (mouseX >= 265 && mouseX <= 535 && mouseY >= 375 && mouseY <= 425) {
    fill(0, 255, 0);
    text("START GAME", W/2, 400, 270, 50);
  }
  if (mouseX >= 290 && mouseX <= 510 && mouseY >= 445 && mouseY <= 495) {
    fill(0, 255, 0);
    if (sound == "ON") {text("SOUND   ON", W/2, 470, 220, 50);}
    else {text("SOUND  OFF", W/2, 470, 250, 50);}
  }
}

//Changes to be done when mouse is clicked
//Different screens have different changes
function mouseClicked() {
  if (currentScreen == "START") { //Start Menu
    //Change screen to Choosing Menu
    if (mouseX >= 265 && mouseX <= 535 && mouseY >= 375 && mouseY <= 425) {
      click.play();
      currentScreen = "CHOOSE";
    }
    //Sound on or off
    if (mouseX >= 290 && mouseX <= 510 && mouseY >= 445 && mouseY <= 495) {
      click.play();
      if (sound == "ON") {sound = "OFF"; startBgm.pause();}
      else {sound = "ON";}
    }
  }
  if (currentScreen == "LEADERBOARD") { //Leaderboard
    //Reset the whole game and return to Start Menu
    if (mouseY >= 560 && mouseY <= 680 && mouseX >= 540 && mouseX <= 620) {
      click.play();
      reset();
      currentScreen = "START";
    }
  }
}

/***************CHOOSE SCREEN FUNCTIONS***************/
//Changes to be done when keyboard is pressed
//Used during the screentime of Choosing Menu
function keyPressed() {
  if (currentScreen == "CHOOSE") {
    click.play();
    //Move pointer to left or right
    if (keyCode == RIGHT_ARROW) {
      if (ptrx == 250 || ptrx == 450) {ptrx += 200;}
    }
    if (keyCode == LEFT_ARROW) {
      if (ptrx == 650 || ptrx == 450) {ptrx -= 200;}
    }
    //Create sprite for aircraft and change screen to Loading screen
    if (keyCode == ENTER || keyCode == 32) {
      let i;
      if (ptrx == 250) {i = 0;}
      else if (ptrx == 450) {i = 1;}
      else if (ptrx == 650) {i = 2;}
      fighter = createSprite(W/2, 650, 50, 50);
      fighter.setCollider("circle", 0, 0, 32);
      fighter.addImage(rocketImg[i]);
      r_ind = i;
      startBgm.stop(); //Stop bgm
      currentScreen = "LOADING";
    }
  }
}

/***************PLAY SCREEN FUNCTIONS***************/
let shot = new Array;
let shotCount = 0;
function motion() {
  //Move aircraft in four directions
  if (keyIsDown(LEFT_ARROW)) {
    fighter.position.x -= data.rocket[r_ind].speed;
    if (fighter.position.x <= 30) {fighter.position.x = 30;}
  }
  if (keyIsDown(RIGHT_ARROW)) {
    fighter.position.x += data.rocket[r_ind].speed;
    if (fighter.position.x >= 770) {fighter.position.x = 770;}
  }
  if (keyIsDown(UP_ARROW)) {
    fighter.position.y -= data.rocket[r_ind].speed;
    if (fighter.position.y <= 30) {fighter.position.y = 30;}
  }
  if (keyIsDown(DOWN_ARROW)) {
    fighter.position.y += data.rocket[r_ind].speed;
    if (fighter.position.y >= 670) {fighter.position.y = 670;}
  }
  //Create and shoot bullets when spacebar is pressed
  if (keyIsDown(32)) {
    shootSound.play();
    shot[shotCount] = createSprite(fighter.position.x+25, fighter.position.y+15, 100, 100);
    shot[shotCount].setCollider("rectangle", 0, 0, 4, 11);
    shotGroup.add(shot[shotCount]);
    bulletImg.resize(200, 200);
    shot[shotCount].addImage(bulletImg);
    //Different aircrafts have different standard of bullets
    if (r_ind == 1) {shot[shotCount].setVelocity(0, -20);}
    else {shot[shotCount].setVelocity(0, -50);}
    shotCount++;
    if (shotCount >= 50) {
      shotGroup.clear();
      shot = [];
      shotCount = 0;
    }  
  }
}

//Create different amounts of enemies according to time
//enemy() function is called to create enemies
function enemyNumber() {
  switch (time) {
    case 0 : enemy(8, 0, 2); break; 
    case 600 : enemy(13, 0, 3); break;
    case 1200 : enemy(17, 0, 3); break;
    case 1800 : enemy(12, 0, 3); enemy(5, 1, 3); break;
    case 2400 : enemy(17, 0, 4); enemy(7, 1, 3); break;
    case 3000 : enemy(20, 0, 4); enemy(10, 1, 4); break;
    case 3600 : currentScreen = "LEADERBOARD"; break;
  }
}

let horiz = new Array;
let vert = new Array;
let s = new Array;
let enemySpr = new Array;
//Create different types of enemies
function enemy(n, ind, sp) {
  enemySpr[ind] = [];
  horiz = []; vert = []; s = [];
  enemyGroup[ind].clear();
  //FOR loop to create different types of enemies
  for (let i = 0; i < n; i++) {
    let x = random(25, W-25); //Enemies have random positions
    enemySpr[ind][i] = createSprite(x, -100, 100, 100);
    enemySpr[ind][i].addImage(enemyImg[ind]);
    enemyGroup[ind].add(enemySpr[ind][i]);
    //Enemies move in random speeds or directions according to types
    if (ind == 0) { //For low class enemy
      s[i] = random(1, sp);
      enemySpr[ind][i].setCollider("circle", 0, 0, 18);
      enemySpr[ind][i].setVelocity(0, s[i]);
    }
    else { //For high class enemy
      horiz[i] = random(-2, 2);
      vert[i] = random(1, sp);
      enemySpr[ind][i].setCollider("circle", 0, 0, 23);
      enemySpr[ind][i].setVelocity(horiz[i], vert[i]);
    }
  }  
}

//Side collision detection for high class enemy
function checkBoundary() {
  for (let i = 0; i < enemyGroup[1].size(); i++) {
    if (enemySpr[1][i].position.x <= 20 || enemySpr[1][i].position.x >= 780) {
      horiz[i] *= -1;
      enemySpr[1][i].setVelocity(horiz[i], vert[i]);
    }
  }
}

//Collision detection
function checkCollision() {
  //Between aircraft and enemy
  fighter.overlap(enemyGroup[0], explode);
  fighter.overlap(enemyGroup[1], explode);
  //Between bullet and enemy
  enemyGroup[0].overlap(shotGroup, killLow);
  enemyGroup[1].overlap(shotGroup, killHigh);
}

//Display current score and time left
function printScoreNTime() {
  textFont(font[1]);
  textSize(30);
  fill(255);
  text("SCORE\t" + score, W/2, 30);
  textSize(50);
  //If game is paused, stop the timer
  if (pause.html() == "PAUSE") {text(timer, 760, 40);}
  else {text(storeTime, 760, 40);}
}

//If collision occurs between aircraft and enemy
//Display explosion animation whenever collision occurs
function explode(fighter, enemy) {
  if (r_ind == 2 && life > 1) { //Only valid for BERSERKER
    enemy.visisble = false;
    animation(explosion, enemy.position.x, enemy.position.y);
    enemy.remove();
    life--;
  }
  else { //Valid for all aircrafts -> GAME OVER
    gameBgm.stop();
    gameOver.play();
    fighter.visible = false;
    animation(explosion, fighter.position.x, fighter.position.y);
    fighter.remove(); //Remove aircraft sprite 
    currentScreen = "LEADERBOARD"; //Change screen to Leaderboard Screen
  }
}

//If collision occurs between bullet and enemy
//Display explosion animation whenever collision occurs
function kill(enemy, shot) {
  if (enemy.position.y >= 0) {
    killSound.play();
    enemy.visisble = false;
    animation(explosion, enemy.position.x, enemy.position.y);
    shot.remove();
    enemy.remove();
  }   
}

//Count the number of low class enemy killed
//Update score
function killLow(enemy, shot) {
  kill(enemy, shot);
  lowKill++;
  score += 100;
}

//Count the number of high class enemy killed
//Update score
function killHigh(enemy, shot) {
  kill(enemy, shot);
  highKill++;
  score += 300;
}

/***************BUTTONS FUNCTIONS IN PLAY SCREEN***************/
//When "PAUSE" button is pressed
let storeTime;
function doPause() {
  click.play();
  if (pause.html() == "PAUSE") { //If game is running, pause game
    pause.html("RESUME");
    storeTime = timer;
    //FOR loop to stop the motion of enemies
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < enemyGroup[j].size(); i++) {
        enemySpr[j][i].setVelocity(0, 0);
      } 
    }
  }
  else { //If game is paused, run the game
    pause.html("PAUSE");
    //FOR loops to make the enemies move again
    for (let i = 0; i < enemyGroup[0].size(); i++) {
      enemySpr[0][i].setVelocity(0, s[i]);
    } 
    for (let i = 0; i < enemyGroup[1].size(); i++) {
      enemySpr[1][i].setVelocity(horiz[i], vert[i]);
    }
  }
}

//When "SOUND" button is pressed
function doSound() {
  if (soundBtn.html() == "SOUND ON") { //To turn sound off
    soundBtn.html("SOUND OFF");
    if (gameBgm.isPlaying()) {gameBgm.pause();}
  }
  else { //To turn sound on
    soundBtn.html("SOUND ON");
    gameBgm.play();
  }
}

//Reset game after game ends
function reset() {
  time = 0;
  shot = [0];
  score = 0;
  lowKill = 0;
  highKill = 0;
  timer = 59;
  life = 2;
  shotGroup.clear();
  enemyGroup[0].clear();
  enemyGroup[1].clear();
}

