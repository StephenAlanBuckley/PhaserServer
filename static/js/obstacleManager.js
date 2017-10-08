class ObstacleManager {
  constructor(game) {
    this.obstacleIndex = 0
    this.game = game
    this.obstacles = game.add.group()
    //So we can access this in other update functions
    this.game.obstacles = this.obstacles
    this.obstaclesArray = []
    this.game.obstacleManager = this
  }

  //Wall should be a separate subclass that obstacle manager manages
  createWall() {
    let x = game.world.randomX;
    let y = game.world.randomY;
    let wall = this.obstacles.create(x, y, 'wall', null, true, this.obstacleIndex)
    game.physics.enable(wall, Phaser.Physics.ARCADE)
    wall.body.immovable = true
    wall.width = Math.floor(Math.random() * 100) + 50
    wall.height = Math.floor(Math.random() * 100) + 50
    wall.anchor.setTo(0.5, 0.5);

    this.obstaclesArray.push(wall)
    this.obstacleIndex += 1
  }

  makeWalls(number_of_walls = 2) {
    for (var i = 0; i < number_of_walls; i++) {
      this.createWall()
    }
  }

  update() {
    for (var i = 0; i < this.obstaclesArray.length; i++) {
      this.game.physics.arcade.overlap(this.game.enemyManager.bullets, this.obstaclesArray[i], this.bulletHitObstacle, null, this);
      this.game.physics.arcade.overlap(this.game.player.bullets, this.obstaclesArray[i], this.bulletHitObstacle, null, this);
    }
  }

  bulletHitObstacle(obstacle, bullet) {
    bullet.kill();
  }
}
