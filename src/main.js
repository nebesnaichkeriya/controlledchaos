var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var platforms;
var debugMessage;

function preload() {
  game.load.image('building', 'assets/images/small-building.png');
  game.load.image('background', 'assets/images/back_800.png');
  game.load.image('vatnik', 'assets/images/vatnik.png');
  game.load.image('ground', 'assets/images/ground_800.png');
  game.load.spritesheet('aarbon', 'assets/images/aarbonSpriteSheet.png', 80, 100);

}

function addRemove(pointer){
  // checking for bodies under the mouse
  var bodyClicked = game.physics.p2.hitTest(pointer.position);
  if(bodyClicked.length==0){
  	var building = game.add.sprite(pointer.position.x, pointer.position.y, "vatnik");
  	game.physics.p2.enable(building);
  }
  else{
  	// destruction of physics body and its graphic asset
  	bodyClicked[0].parent.sprite.kill();
	}
}

function create() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.gravity.y = 250;

  game.add.image(0,0,'background');

  addAarbon();

  ground = game.add.sprite(400, 542, 'ground');
  game.physics.p2.enable(ground);
  ground.body.static = true;

  var building = game.add.sprite(500, 410, "building");
  game.physics.p2.enable(building)
  building.body.static = true;

  game.input.onDown.add(addRemove, this);
}

function aarbonContact(body, shapeA, shapeB, equation) {
  if (body != null && body.sprite.key == 'building') {
    debugMessage = 'Hit ' + body.sprite.key;
    aarbon.animations.play('jerk');
  }
}

function addAarbon() {
  aarbon = game.add.sprite(0,430,'aarbon');
  aarbon.animations.add('run_left', [1, 2, 3, 4, 5, 6], 8, true);
  aarbon.animations.add('jerk', [7, 8, 10, 17, 18, 0], 8, true);
  aarbon.animations.play('run_left');

  game.physics.p2.enable(aarbon);
  aarbon.body.fixedRotation = true;

  aarbon.body.onBeginContact.add(aarbonContact, this);
}



function render() {
  game.debug.text(debugMessage, 32, 32);
}

function update() {

  aarbon.body.moveRight(60);
}
