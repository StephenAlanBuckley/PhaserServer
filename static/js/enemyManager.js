class EnemyManager {
  constructor(game) {
    //  The enemies bullet group
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(100, 'bullet');

    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    this.game = game
    //  Create some baddies to waste :)

    this.enemies = []

    this.enemiesTotal = 0
    this.enemiesAlive = 0

    //  Explosion pool
    this.explosions = this.game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = this.explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    this.game.enemyManager = this

  }

  createMoreEnemies(numberNewEnemies) {
    for (var i = 0; i < numberNewEnemies; i++)
    {
        this.enemies.push(new EnemyTank(i, this.game, game.player.tank, this.bullets))
        this.enemiesTotal += 1
        this.enemiesAlive += 1
    }
  }

  bulletHitEnemy(tank, bullet) {
    bullet.kill();

    var destroyed = this.enemies[tank.name].damage();

    if (destroyed)
    {
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }
  }

  update() {
    this.enemiesAlive = 0;

    for (var i = 0; i < this.enemies.length; i++)
    {
        if (this.enemies[i].alive)
        {
            this.enemiesAlive++;
            game.physics.arcade.collide(game.player.tank, this.enemies[i].tank);
            game.physics.arcade.collide(game.obstacles, this.enemies[i].tank);
            game.physics.arcade.overlap(game.player.bullets, this.enemies[i].tank, this.bulletHitEnemy, null, this);
            this.enemies[i].update();
        }
    }
  }

}
