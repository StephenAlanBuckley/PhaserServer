const CAM_VERT_SPEED = 10
const CAM_HOR_SPEED = 10
class CameraControls {
  constructor(game) {
    this.size = Phaser.Rectangle.clone(game.world.bounds)
    this.game = game
    this.game.camera.bounds.y = this.game.camera.bounds.y - this.game.HUD.display.height

    this.creatureFocusedIndex = 0

    //For now, let's put zoom on the backburner
    this.zoomRate = 0.01
    this.maxZoomIn = 3
    this.maxZoomOut = .1

    this.previousCreatureKey = game.input.keyboard.addKey(Phaser.KeyCode.COMMA);
		this.nextCreatureKey = game.input.keyboard.addKey(Phaser.KeyCode.PERIOD);
    this.noFocusKey = game.input.keyboard.addKey(Phaser.KeyCode.QUESTION_MARK);

    this.camUpKey = game.input.keyboard.addKey(Phaser.KeyCode.P);
    this.camRightKey = game.input.keyboard.addKey(Phaser.KeyCode.QUOTES);
    this.camDownKey = game.input.keyboard.addKey(Phaser.KeyCode.COLON);
    this.camLeftKey = game.input.keyboard.addKey(Phaser.KeyCode.L);

		this.game.camera.focusOnXY(-1000, -1000);
  }

  update() {
    /*
     * Again, and I don't wanna keep harping on this, but fuck zooming
    let zooming = false
    let reset = false
    let zoomAmount = 0
    if (this.zoomOutKey.isDown) {
      zooming = true
      zoomAmount -= this.zoomRate
    }

    if (this.zoomInKey.isDown) {
      zooming = true
      zoomAmount += this.zoomRate
    }

    if (this.resetZoomKey.isDown) {
      zooming = true
			reset = true;
    }

    if (zooming)
    {
				if (reset) {
					this.game.camera.scale.x = 1;
					this.game.camera.scale.y = 1;
				} else {
					this.game.camera.scale.x += zoomAmount;
					this.game.camera.scale.y += zoomAmount;
				}

				this.game.camera.scale.x = Phaser.Math.clamp(this.game.camera.scale.x, this.maxZoomOut, this.maxZoomIn)
				this.game.camera.scale.y = Phaser.Math.clamp(this.game.camera.scale.y, this.maxZoomOut, this.maxZoomIn)

        this.game.camera.bounds.x = this.size.x * this.game.camera.scale.x;
        this.game.camera.bounds.y = this.size.y * this.game.camera.scale.y;
        this.game.camera.bounds.width = this.size.width * this.game.camera.scale.x;
        this.game.camera.bounds.height = this.size.height * this.game.camera.scale.y;
    }
    */

    let xChange = 0
    let yChange = 0

    if (this.camUpKey.isDown) {
      yChange -= CAM_VERT_SPEED
    }
    if (this.camDownKey.isDown) {
      yChange += CAM_VERT_SPEED
    }
    if (this.camLeftKey.isDown) {
      xChange -= CAM_HOR_SPEED
    }
    if (this.camRightKey.isDown) {
      xChange += CAM_HOR_SPEED
    }

    this.moveCamera(xChange, yChange)
  }

  changeTheCreatureFocus(modify) {
    this.creatureFocusedIndex += modify
    this.creatureFocusedIndex = this.creatureFocusedIndex % this.creatureManager.creaturesAlive.length
    this.creatureManager.creaturesAlive[this.creatureFocusedIndex].takeFocus()
  }

  moveCamera(x, y) {
    if (x != 0 && y != 0) {
      //stop following
      this.game.camera.follow(null)
    }
    this.game.camera.x += x
    this.game.camera.y += y
  }
}
