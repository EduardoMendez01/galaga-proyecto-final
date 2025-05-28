class Enemy {
  constructor(x, y, type, pattern) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.type = type;          
    this.pattern = pattern;     
    this.health = (type === 'tough') ? 3 : 1;
    this.speed = (pattern === 1) ? 1 : 2;
    this.direction = 1;      
  }
  

  move() {
    if (this.pattern === 1) {
      this.y += this.speed;
    } else {
      this.x += this.direction * this.speed;
      this.y += this.speed / 2;
      if (this.x < this.size/2 || this.x > width - this.size/2) {
        this.direction *= -1;
      }
    }
  }
  
  tryShoot() {
    if (currentLevel === 2 && random(1) < 0.005) {
      enemyProjectiles.push(
        new Projectile(this.x, this.y + this.size/2, 5, 'enemy')
      );
    }
  }
  
  display() {
    if (this.type === 'tough') fill(200, 100, 100);
    else fill(255, 100, 0);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
  
  isOffScreen() {
    return this.y > height + this.size;
  }
  
  hit() {
    this.health--;
    return this.health <= 0;
  }
}
