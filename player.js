class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 40;
    this.lives = 3;
    this.speed = 5;
  }
  
// Controles
  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
  }

  display() {
    fill(0, 255, 0);
    triangle(
      this.x, this.y - this.size / 2,
      this.x - this.size / 2, this.y + this.size / 2,
      this.x + this.size / 2, this.y + this.size / 2
    );
  }
  
  // Disparar
  shoot() {
    playerProjectiles.push(
      new Projectile(this.x, this.y - this.size / 2, -7, 'player')
    );
  }

  hit() {
    this.lives--;
  }
}
