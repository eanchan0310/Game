var config = {
    type: Phaser.AUTO,
    scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

 // // 시간 지연 실행
    // var _tmpDelay = 3000;
    // setTimeout( () => {
    //     // + 내용
    // }, _tmpDelay)

var game = new Phaser.Game(config);
var player;
var fire;
var random = 0;
var conTU = 0;
var cnt1 = 0;
var bool = true;
var i=0;
var FireList = [10];
function create() 
{
    player = this.add.text(100, 200, '닭', { fontFamily: 'Arial', fontSize: 60, color: '#00ff00' }).setInteractive();
    player.setOrigin(0.5);
    this.input.setDraggable(player);

    for(i=0; i<5; i++){
        FireList[i] = this.add.text(0, Random_Int(500, 10), 'O', { fontFamily: 'Arial', fontSize: Random_Int(80, 30), color: 'red' });
        FireList[i].setOrigin(0.5);
        tween_LR.call(this, FireList[i]);
    }
    for(i=0; i<5; i++){
        FireList[i+5] = this.add.text(Random_Int(700, 10), 0, 'O', { fontFamily: 'Arial', fontSize: Random_Int(80, 30), color: 'red' });
        FireList[i+5].setOrigin(0.5);
        tween_UD.call(this, FireList[i+5]);
    }

    random = 0;
    var xdf = 0;
    var ydf = 0;
    var lx = 0;
    var ly = 0;
    var pointer1 = game.input.activePointer;

    
    this.input.on('pointerdown', function (pointer, gameObject) {
        xdf = player.x - pointer.x;
        ydf = player.y - pointer.y;
    });
    
    
    this.input.on('pointermove', function (pointer) {
        if (pointer.isDown) {
            var stx = 0, sty = 0;
            stx = distanceX(pointer.x);
            sty = distanceY(pointer.y);
        }
    });
    
    function distanceX(_pointerX) {
    
        player.x = _pointerX + xdf;

        return _pointerX + xdf;
    }

    function distanceY(_pointerY) {
    
        player.y = _pointerY + ydf;

        return _pointerY + ydf;
    }

    function tween_LR(target) {
        var tween1 = this.tweens.add({
            targets: target,
            x: 800, 
            duration: Random_Int(5,1)*1000, 
            ease: 'Linear',
            yoyo: true,
            onYoyo: function () { 
                target.y = Random_Int(600, 0)
                console.log('yoyo');
            },
            onComplete: () => { 
                target.y = Random_Int(600, 0)
                console.log('com')
                tween_LR.call(this, target);
            }
        });
    }
    function tween_UD(target) {
        var tween1 = this.tweens.add({
            targets: target,
            y: 600, 
            duration: Random_Int(5,1)*1000, 
            ease: 'Linear',
            yoyo: true,
            onYoyo: function () { 
                target.x = Random_Int(800, 0)
                console.log('yoyo');
            },
            onComplete: () => { 
                target.x = Random_Int(800, 0)
                console.log('com')
                tween_UD.call(this, target);
            }
        });
    }
    // var tween2 = this.tweens.add({
    //     targets: fire,
    //     y: 600, 
    //     duration: 1000, 
    //     ease: 'Linear',
    //     yoyo: true,
    //     repeat: -1,

    //     onYoyo: function () { 
    //         fire.x = Random_Int(799, 1)
    //     },
    //     onRepeat: function () { 
    //         fire.x = Random_Int(799, 1)
    //     }
    // });
    
}

function Random_Int(max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function Random_Double (max, min){
    return Math.random() * (max - min) + min;
}

function update()
{
    if(player.x >= 770){
        player.x = 770;
    }
    else if(player.x <= 30){
        player.x = 30;
    }

    if(player.y >= 570){
        player.y = 570;
    }
    else if(player.y <= 30){
        player.y = 30;
    }

    // if(bool){

    //     change();
    //     console.log("change");
    //     bool = false;
    // }
    // else{
    //     console.log(conTU);
    //     if(fire.x >= 800 || fire.x <= 0 || fire.y <= 0 || fire.y >= 600){
    //         bool = true;
    //     }
    //     else{
    //         switch(conTU){
    //             case 1: 
    //                 Right_to_Left();
    //                 break;
    //             case 2:
    //                 Left_to_Right();
    //                 break;
    //             case 3: 
    //                 Up_to_Down();
    //                 break;
    //             case 4:
    //                 Down_to_Up();
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

}





function change() {
    random = Random_Int(4,1);
    switch(random){
        case 1: 
            Right_to_Left();
            conTU = random;
            break;
        case 2:
            Left_to_Right();
            conTU = random;
            break;
        case 3: 
            Up_to_Down();
            conTU = random;
            break;
        case 4:
            Down_to_Up();
            conTU = random;
            break;
        default:
            break;
    }
    console.log("random은 ",random);
}

function Right_to_Left(){
    if(fire.x >= -30){
        fire.x -= 10; 
    }
    else{
        fire.x = 830;
        fire.y = Random_Double(600, 0);
        // console.log(fire.y);
    }
}

function Left_to_Right(){
    if(fire.x <= 830){
        fire.x += 10; 
    }
    else{
        fire.x = -30;
        fire.y = Random_Double(600, 0);
        //console.log(fire.y);
    }
}

function Up_to_Down(){
    if(fire.y <= 630){
        fire.y += 10; 
    }
    else{
        fire.y = -30;
        fire.x = Random_Double(800, 0);
        //console.log(fire.x);
    }
}

function Down_to_Up(){
    if(fire.y >= -30){
        fire.y -= 10; 
    }
    else{
        fire.y = 630;
        fire.x = Random_Double(800, 0);
        //console.log(fire.x);
    }
}
