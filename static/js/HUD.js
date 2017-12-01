class HUD {
  constructor(game) {
    this.game = game
    this.display //initializing here but populated in createHUD
    this.createHUD()
    this.game.HUD = this
  }

  createHUD() {
    this.display = this.game.add.group()
    this.display.name = 'HUD'
    this.createFrame()
    this.createCreaturesAliveBar()
    this.createGenerationCounter()
  }

  createFrame() {
    let my_canvas = game.add.bitmapData(game.canvas.width, game.canvas.height / 5)
    let canvas_context = my_canvas.context
    canvas_context.fillStyle = 'black'
    canvas_context.fillRect(0,0, my_canvas.width, my_canvas.height)

    for (let i = 0; i < 10; i = i + 3) {
      canvas_context.strokeStyle = 'white'
      canvas_context.strokeRect(i,i, my_canvas.width - (2 * i), my_canvas.height - (2 * i))
    }

    let frame = this.game.add.sprite(0,0, my_canvas)
    frame = this.display.add(frame)
    frame.inputEnabled = true
    frame.fixedToCamera = true
  }

  createCreaturesAliveBar() {
    let containerCanvas = game.add.bitmapData(110, 30)
    let canvas_context = containerCanvas.context
    canvas_context.strokeStyle = 'white'
    canvas_context.strokeRect(0,0, containerCanvas.width, containerCanvas.height)

    let container = this.game.add.sprite(this.game.canvas.width - containerCanvas.width - 50, 20, containerCanvas)
    container = this.display.add(container)
    container.fixedToCamera = true

    let barCanvas = game.add.bitmapData(100, 20)
    canvas_context = barCanvas.context
    canvas_context.fillStyle = 'white'
    canvas_context.fillRect(0,0,barCanvas.width, barCanvas.height)

    this.creaturesAliveBar = container.addChild(this.game.add.sprite(5, 5, barCanvas))
  }

  createGenerationCounter() {
    this.generationText = game.add.text(this.game.canvas.width - 45, 20, 'generation')
    this.generationText.addColor('rgb(255,255,255)', 0)
    this.generationText.align = 'left'
    this.generationText.fixedToCamera = true;
    this.generationText = this.display.add(this.generationText)
  }

  setCreaturesAliveBarTo(numberOfCreaturesAlive) {
    this.creaturesAliveBar.width = numberOfCreaturesAlive
  }

  setGenerationTextTo(numberOfGenerations) {
    this.generationText.text = numberOfGenerations
  }

  update () {
    this.setCreaturesAliveBarTo(this.game.creatureManager.creaturesAlive.length)
    this.setGenerationTextTo(this.game.creatureManager.generation)
  }

  postUpdate() {
    this.game.world.bringToTop(this.display)
  }
}
