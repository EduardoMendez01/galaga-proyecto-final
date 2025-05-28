class Projectile {
  constructor(x, y, speed, owner) {
    this.x = x;
    this.y = y;
    this.size = 8;
    this.speed = speed;
    this.owner = owner; 
  }
  
  update() {
    this.y += this.speed;
  }
  
  display() {
    if (this.owner === 'player') fill(0, 255, 100);
    else fill(255, 50, 50);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
  
  offScreen() {
    return this.y < -this.size || this.y > height + this.size;
  }
}
