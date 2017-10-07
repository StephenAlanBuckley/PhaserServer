//requires "/js/player.js",
//requires "/js/enemyManager.js",
//requires "/js/enemyTank.js",
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example',
    { preload: preload,
      create: create,
      update: update,
      render: render
    }
);

function preload () {
    game.load.atlas('tank', 'assets/tanks/tanks.png', 'assets/tanks/tanks.json');
    game.load.atlas('enemy', 'assets/tanks/enemy-tanks.png', 'assets/tanks/tanks.json');
    game.load.image('logo', 'assets/tanks/logo.png');
    game.load.image('bullet', 'assets/tanks/bullet.png');
    game.load.image('wall', 'assets/tanks/badwall.png');
    game.load.image('earth', 'assets/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/tanks/explosion.png', 64, 64, 23);
}

var land;
var player;
var enemyManager

var logo;

function create () {

    //  Resize our game world to be a giant square
    game.world.setBounds(-1000, -1000, 5000, 5000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    player = new Player(game)

    enemyManager = new EnemyManager(game)

    obstacleMaanger = new ObstacleManager(game)

    obstacleMaanger.makeWalls(200)

    player.bringToTop();

    logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(player.tank);
    game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
    game.camera.focusOnXY(0, 0);
}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function update () {

    player.update()
    enemyManager.update()
    obstacleMaanger.update()
}

function render () {

    // game.debug.text('Active Bullets: ' + player.bullets.countLiving() + ' / ' + player.bullets.length, 32, 32);
    game.debug.text('Enemies: ' + enemyManager.enemiesAlive + ' / ' + enemyManager.enemiesTotal, 32, 32);

}
