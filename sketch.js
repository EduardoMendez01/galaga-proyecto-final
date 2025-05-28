// Variables globales
let player;
let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];
let score = 0;
let currentLevel = 1;
let gameState = 'start';
let highscores = [];

function setup() {
  createCanvas(600, 700);
  textFont('monospace', 18);
  player = new Player();
  loadHighscores();
}

function draw() {
  background(20);
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
  text('GALAGA - 2 NIVELES', width/2, height/2 - 40);
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
  if (gameState === 'playing' && keyCode === 32) {
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
  
  // Proyectiles del jugador
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
  
  handleCollisions();
  cleanupEntities();

  drawHUD();
  
  if (enemies.length === 0) {
    if (currentLevel < 2) {
      gameState = 'levelUp';
    } else {
      gameState = 'gameOver';
      updateHighscores(score);
    }
  }
  
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
  // Proyectiles enemigos hacia el jugador
  for (let p of enemyProjectiles) {
    if (dist(p.x, p.y, player.x, player.y) < (p.size + player.size)/2) {
      player.hit();
      p.y = height + 100;
    }
  }
  // Proyectiles jugador hacia los enemigos
  for (let p of playerProjectiles) {
    for (let e of enemies) {
      if (dist(p.x, p.y, e.x, e.y) < (p.size + e.size)/2) {
        p.y = -100;
        if (e.hit()) {
          score += (e.type === 'tough') ? 3 : 1;
        }
      }
    }
  }
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
  if (n === 1) score = 0;
  let cols = 5, rows = 1 + n; 
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let type = (n === 2 && i === 0 && j === 0) ? 'tough' : 'normal';
      let pattern = n; 
      enemies.push(new Enemy(80 + i*100, -j*60, type, pattern));
    }
  }
}

function nextLevel() {
  fill(255);
  textAlign(CENTER);
  text(`¡Nivel ${currentLevel + 1}!`, width/2, height/2);
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
  // Cargar top 5
  let hs = getItem('highscores');
  highscores = hs ? hs : [];
}

function updateHighscores(s) {
  // Actualizar tabla de puntaje
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
