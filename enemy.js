class Enemy {
  constructor(x, y, type, pattern) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.type = type;          
    this.pattern = pattern;     
    this.health = type === 'tough' ? 3 : (type === 'boss' ? 7 : 1);
    this.speed = 1 + (pattern - 1) * 0.5;
    this.dir = 1;
    this.lastShot = 0;
    this.shotInterval = 120 - currentLevel * 10;
  }

  move() {
    if (this.pattern === 1) {
      this.y += this.speed;
    } else if (this.pattern === 2) {
      this.x += this.speed * this.dir;
      this.y += this.speed / 2;
      if (this.x < this.size / 2 || this.x > width - this.size / 2) this.dir *= -1;
    } else {
      this.x += this.speed * cos(frameCount / 20);
      this.y += this.speed * sin(frameCount / 20);

      if (this.y < 200) {
        this.y += 0.5;
      }
    }
  }

  tryShoot() {
    if (currentLevel > 1 && frameCount - this.lastShot > this.shotInterval) {
      enemyProjectiles.push(new Projectile(this.x, this.y + this.size / 2, 4 + currentLevel, 'enemy'));
      this.lastShot = frameCount;
    }
  }

  display() {
  push();
  imageMode(CENTER);
  let imgToUse = enemyImg;

  if (this.type === 'tough') {
    imgToUse = toughEnemyImg;
  } else if (this.type === 'boss') {
    imgToUse = bossImg;
  }

  let s = this.size * (this.type === 'boss' ? 2 : 1);
  image(imgToUse, this.x, this.y, s, s);
  pop();
}


  isOffScreen() {
    return this.y > height + this.size;
  }

  hit() {
    this.health--;
    return this.health <= 0;
  }
}
