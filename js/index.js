var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create,
    }
};

var game = new Phaser.Game(config);

function create() 
{
    var title = this.add. text(100, 200, '닭', { fontFamily: 'Arial', fontSize: 60, color: '#00ff00' }).setInteractive();;
   
    var xdf = 0;
    var ydf = 0;
    var lx = 0;
    var ly = 0;
    var pointer1 = game.input.activePointer;

    this.input.setDraggable(title);
    
    this.input.on('pointerdown', function (pointer, gameObject) {
     
        xdf = game.input.mousePointer.x;
        ydf = game.input.mousePointer.y;
        console.log(game.input.mousePointer.x);
    });
    
    
    this.input.on('pointermove', function (pointer) {
        if (pointer.isDown) {
         lx = pointer.x;
         ly = pointer.y;
         title.x += (lx - xdf)/2;
         title.y += (ly - ydf)/2;
        }
    });
}

