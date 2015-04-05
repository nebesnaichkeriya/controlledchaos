var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var platforms;
var debugMessage;

function preload() {
  game.load.image('building', 'assets/images/small-building.png');
  game.load.image('background', 'assets/images/back_800.png');
  game.load.image('vatnik', 'assets/images/vatnik.png');
  game.load.image('ground', 'assets/images/ground_800.png');
  game.load.image('clippy', 'assets/images/clippy.png');
  game.load.spritesheet('clippy_eyes', 'assets/images/clippy_eyes.png', 100, 100);
  game.load.spritesheet('aarbon', 'assets/images/aarbonSpriteSheet.png', 80, 100);
  game.load.spritesheet('ragdoll', 'assets/images/ragdoll_sprite_sheet.png', 29, 181);

  game.load.audio('music', 'assets/audio/sotb-stronghold.mp3');
}

function addRemove(pointer){
  // checking for bodies under the mouse
  var bodyClicked = game.physics.p2.hitTest(pointer.position);
  if(bodyClicked.length==0){
    addCorpse(pointer.position.x, pointer.position.y, -100, -100);
  	// var building = game.add.sprite(pointer.position.x, pointer.position.y, "vatnik");
  	// game.physics.p2.enable(building);
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

  var intro = game.add.audio('music', 0.5, true);
  intro.play();

  addAarbon();

  addClippy();

  

  ground = game.add.sprite(400, 542, 'ground');
  game.physics.p2.enable(ground);
  ground.body.static = true;

  var building = game.add.sprite(500, 380, "building");
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

function addClippy() {
  clippy = game.add.sprite(30, 30, 'clippy');
  clippyEyes = game.add.sprite(30, 30,'clippy_eyes');
  clippyEyes.animations.add('blink', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 8, true);
  clippyEyes.animations.play('blink');
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


var ragdoll;
function addCorpse(x, y, xvelocity, yvelocity) {
  ragdoll = {
    'neck': game.add.sprite(x, y, 'ragdoll', 0),
    'lHand': game.add.sprite(x, y, 'ragdoll', 1),
    'lLeg': game.add.sprite(x, y, 'ragdoll', 2),
    'torso': game.add.sprite(x, y, 'ragdoll', 3),
    'rLeg': game.add.sprite(x, y, 'ragdoll', 4),
    'rHand': game.add.sprite(x, y, 'ragdoll', 5),
    'head': game.add.sprite(x, y, 'ragdoll', 6)
  }

  shoulders = [-3, -45];
  hip = [-5, 5];

  for(var o in ragdoll) {
    game.physics.p2.enable(ragdoll[o]);
  }

  // torso.body.setRectangle(29,181);
  // lHand.body.setRectangle(29,181);
  addConstraint(ragdoll['lHand'], ragdoll['torso'], shoulders);
  addConstraint(ragdoll['rHand'], ragdoll['torso'], shoulders);
  addConstraint(ragdoll['neck'], ragdoll['torso'], shoulders);
  addConstraint(ragdoll['rLeg'], ragdoll['torso'], hip);
  addConstraint(ragdoll['lLeg'], ragdoll['torso'], hip);
  addConstraint(ragdoll['neck'], ragdoll['head'], [0,-60]);
  // constraint =
  //   game.physics.p2.createRevoluteConstraint(
  //     ragdoll['lHand'], shoulders, 
  //     ragdoll['torso'], shoulders, 10000);
  // constraint.collideConnected = false;

  ragdoll['torso'].body.velocity.x = xvelocity;
  ragdoll['torso'].body.velocity.y = yvelocity;

  
}

function addConstraint(part1, part2, joint) {
  constraint =
    game.physics.p2.createRevoluteConstraint(
      part1, joint, 
      part2, joint, 10000);
  constraint.collideConnected = false;

}


function render() {
  game.debug.text(debugMessage, 32, 32);
}

function update() {

  aarbon.body.moveRight(60);
}
