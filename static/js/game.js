//requires "/js/player.js",
//requires "/js/enemyManager.js",
//requires "/js/enemyTank.js",
//Honestly, a bunch of other requirements too
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
    game.load.image('tiles', 'assets/GameBoyTile.png');
    game.load.spritesheet('kaboom', 'assets/tanks/explosion.png', 64, 64, 23);
}

var land
var player
var enemyManager
var creatureManager
var soilManager
var actionManager

var headsUpDisplay
var cameraControls

var mapData

const TILE_WIDTH = 100
const TILE_HEIGHT = 100

var logo;
var c;

function create () {

    //Resize our game world to be a giant square
    game.world.setBounds(0, 0, 5000, 5000);

    let data = createTileData(game);
    mapData = data
    game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV)

    let map = game.add.tilemap('dynamicMap', 16, 16)
    map.addTilesetImage('tiles', 'tiles', 16, 16)

    let layer = map.createLayer(0)
    layer.setScale(TILE_WIDTH/16, TILE_HEIGHT/16)
    //player = new Player(game)

    enemyManager = new EnemyManager(game)
    obstacleManager = new ObstacleManager(game)
    actionManager = new ActionManager(game)
    creatureManager = new CreatureManager(game)
    creatureManager.createMoreCreatures(100)
    //player.bringToTop();
    soilManager = new SoilManager(game)

    headsUpDisplay = new HUD(game)
    cameraControls = new CameraControls(game)

    //game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
    game.time.advancedTiming = true
		console.log(game)
}

function update () {
    //player.update()
    enemyManager.update()
    obstacleManager.update()
    creatureManager.update()
    cameraControls.update()
    soilManager.update()
    headsUpDisplay.update()
    postUpdate()
}

function postUpdate() {
    //enemyManager.update()
    //obstacleManager.update()
    creatureManager.postUpdate()
    headsUpDisplay.postUpdate()
    //cameraControls.update()
    //soilManager.update()
}

function render () {
}

function createTileData(game) {
  let data = '';
  for (var y = 0; y < (game.world.bounds.height/TILE_HEIGHT); y++) {
    for (var x = 0; x < (game.world.bounds.width/TILE_WIDTH); x++) {
      data += "16"
      if (!(x + 1 >= (game.world.bounds.width/TILE_WIDTH))) {
        data += ","
      }
    }
    if (!(y + 1 >= (game.world.bounds.height/TILE_HEIGHT))) {
      data += "\n"
    }
  }
  return data
}
