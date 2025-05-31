// Variables globales
let player;
let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];
let score = 0;
let currentLevel = 1;
let gameState = 'start';
let highscores = [];

// Imágenes
let bgImg;
let playerImg;
let enemyImg;
let toughEnemyImg;


function preload() {
  bgImg = loadImage('fondo galaga.png');
  playerImg = loadImage('jugador.png');
  enemyImg = loadImage('enemigo.png');
  toughEnemyImg = loadImage('enemigo res.png');
}

function setup() {
  createCanvas(600, 700);
  textFont('monospace', 18);
  player = new Player();
  loadHighscores();
}

// Fondo
function draw() {
  image(bgImg, 0, 0, width, height);

  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    runGame();
  } else if (gameState === 'levelUp') {
    nextLevel();
  } else if (gameState === 'gameOver') {
    drawGameOver();
  }
}

function drawStartScreen() {
  fill(255);
  textAlign(CENTER);
  text('GALAGA', width/2, height/2 - 40);
  text('Presiona ENTER para empezar', width/2, height/2);
  text('Top 5 mejores puntuaciones:', width/2, height/2 + 60);
  highscores.forEach((s, i) => {
    text(`${i+1}. ${s}`, width/2, height/2 + 90 + i*30);
  });
}

function keyPressed() {
  if (gameState === 'start' && keyCode === ENTER) {
    startLevel(1);
    gameState = 'playing';
  }
  if (gameState === 'playing' && keyCode === 32) { // espacio
    player.shoot();
  }
  if (gameState === 'gameOver' && keyCode === ENTER) {
    resetGame();
  }
}

function runGame() {
  // Jugador
  player.move();
  player.display();

  // Proyectiles jugador
  for (let p of playerProjectiles) {
    p.update();
    p.display();
  }
  // Proyectiles enemigos
  for (let p of enemyProjectiles) {
    p.update();
    p.display();
  }

  // Enemigos
  for (let e of enemies) {
    e.move();
    e.display();
    e.tryShoot();
  }

  // Colisiones y limpieza
  handleCollisions();
  cleanupEntities();

  drawHUD();

  // Fin de nivel o juego
  if (enemies.length === 0) {
    gameState = (currentLevel < 3) ? 'levelUp' : 'gameOver';
    if (currentLevel === 3) updateHighscores(score);
  }

  // Verificar vidas
  if (player.lives <= 0) {
    gameState = 'gameOver';
    updateHighscores(score);
  }
}

function drawHUD() {
  fill(255);
  textAlign(LEFT);
  text(`Puntaje: ${score}`, 10, 25);
  text(`Vidas: ${player.lives}`, 10, 50);
  text(`Nivel: ${currentLevel}`, 10, 75);
}

function handleCollisions() {
  // Proyectiles enemigos vs jugador
  for (let p of enemyProjectiles) {
    if (dist(p.x, p.y, player.x, player.y) < (p.size + player.size)/2) {
      player.hit();
      p.y = height + 100;
    }
  }
  // Proyectiles jugador vs enemigos
  for (let p of playerProjectiles) {
    for (let e of enemies) {
      if (dist(p.x, p.y, e.x, e.y) < (p.size + e.size)/2) {
        p.y = -100;
        if (e.hit()) {
          if (e.type === 'tough') score += 3;
          else if (e.type === 'boss') score += 10;
          else score++;
        }
      }
    }
  }
  // Enemigos colision con el jugador
  for (let e of enemies) {
    if (e.isOffScreen() || dist(e.x, e.y, player.x, player.y) < (e.size + player.size)/2) {
      player.hit();
      e.y = height + 100;
    }
  }
}

function cleanupEntities() {
  playerProjectiles = playerProjectiles.filter(p => !p.offScreen());
  enemyProjectiles = enemyProjectiles.filter(p => !p.offScreen());
  enemies = enemies.filter(e => e.y < height + 50 && e.health > 0);
}

function startLevel(n) {
  currentLevel = n;
  player.lives = max(player.lives, 1);
  enemies = [];
  score = (n === 1 ? 0 : score);
  let cols = 5, rows = 2 + n;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let type = 'normal', pattern = n;
      if (n >= 2 && i === 0 && j === 0) type = 'tough';
      if (n === 3 && i === 2 && j === 0) type = 'boss';
      enemies.push(new Enemy(80 + i*100, -j*60, type, pattern));
    }
  }
}

function nextLevel() {
  fill(255);
  textAlign(CENTER);
  text(` Nivel ${currentLevel + 1}!`, width/2, height/2);
  if (frameCount % 120 === 0) {
    startLevel(currentLevel + 1);
    gameState = 'playing';
  }
}

function drawGameOver() {
  fill(255);
  textAlign(CENTER);
  text('GAME OVER', width/2, height/2 - 20);
  text(`Puntaje Final: ${score}`, width/2, height/2 + 20);
  text('Presiona ENTER para reiniciar', width/2, height/2 + 60);
}

function loadHighscores() {
  let hs = getItem('highscores');
  highscores = hs ? hs : [];
}

function updateHighscores(s) {
  highscores.push(s);
  highscores.sort((a, b) => b - a);
  highscores = highscores.slice(0, 5);
  storeItem('highscores', highscores);
}

function resetGame() {
  score = 0;
  player.lives = 3;
  currentLevel = 1;
  gameState = 'start';
}
