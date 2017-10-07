class Player {

  constructor(game) {
    this.game = game;
    this.bullets = this.createBullets();
    //  The base of our tank
    this.tank = game.add.sprite(0, 0, 'tank', 'tank1');
    this.tank.anchor.setTo(0.5, 0.5);
    this.tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.drag.set(1);
    this.tank.body.maxVelocity.setTo(400, 400);
    this.tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    this.turret = game.add.sprite(0, 0, 'tank', 'turret');
    this.turret.anchor.setTo(0.3, 0.5);

    //  A shadow below our tank
    this.shadow = game.add.sprite(0, 0, 'tank', 'shadow');
    this.shadow.anchor.setTo(0.5, 0.5);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.cursors["w"] = game.input.keyboard.addKey(Phaser.KeyCode.W)
    this.cursors["a"] = game.input.keyboard.addKey(Phaser.KeyCode.A)
    this.cursors["s"] = game.input.keyboard.addKey(Phaser.KeyCode.S)
    this.cursors["d"] = game.input.keyboard.addKey(Phaser.KeyCode.D)

    this.fireRate = 100;
    this.nextFire = 0;
    this.game.player = this
  }

  bringToTop() {
    this.tank.bringToTop();
    this.turret.bringToTop();
  }

  update() {
    game.physics.arcade.collide(game.obstacles, this.tank);
    game.physics.arcade.overlap(this.game.enemyManager.bullets, this.tank, this.bulletHitPlayer, null, this);
    if (this.cursors.left.isDown || this.cursors.a.isDown)
    {
        this.tank.angle -= 4;
    }
    else if (this.cursors.right.isDown || this.cursors.d.isDown)
    {
        this.tank.angle += 4;
    }

    if (this.cursors.up.isDown || this.cursors.w.isDown)
    {
        //  The speed we'll travel at
        if (this.currentSpeed < 300) {
          this.currentSpeed += 100;
        } else {
          this.currentSpeed = 300;
        }
    }
    else
    {
        if (this.currentSpeed <= 0) {
          this.currentSpeed = 0
        } else {
          this.currentSpeed -= 200;
        }
    }

    this.game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);

    land.tilePosition.x = -this.game.camera.x;
    land.tilePosition.y = -this.game.camera.y;

    //  Position all the parts and align rotations
    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;

    this.turret.rotation = this.game.physics.arcade.angleToPointer(this.turret);

    if (this.game.input.activePointer.isDown) {
      //  Boom!
      this.fire();
    }
  }

  fire() {

    if (game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;
      var bullet = this.bullets.getFirstExists(false);
      bullet.reset(this.turret.x, this.turret.y);
      bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer);
    }
  }

  bulletHitPlayer (tank, bullet) {
      bullet.kill();
  }

  createBullets() {
    //  Our bullet group
    var bullets = this.game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(100, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    return bullets
  }
}
