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
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};
document.body.style.backgroundColor = "green";        


 // // 시간 지연 실행
    // var _tmpDelay = 3000;
    // setTimeout( () => {
    //     // + 내용
    // }, _tmpDelay)

// 전역 변수 선언
var delay = 3000;
var game = new Phaser.Game(config);
var player;
var start;
var fire;
var random = 0;
var conTU = 0;
var cnt1 = 0;
var bool = true;
var i=0;
var FireList = [10];
// 전역 변수 선언 끝

function preload(){
    this.load.image('Fire', './assets/image/Fire_1.jpg');
    this.load.image('chicken', './assets/image/chicken_1.jpg');


}
// create
function create() 
{    
    // 변수 선언
    random = 0;
    var xdf = 0;
    var ydf = 0;
    var lx = 0;
    var ly = 0;
    var pointer1 = game.input.activePointer;
    // 변수 선언 끝

    player = this.physics.add.image(100, 200, 'chicken').setInteractive();
    // player = this.physics.add.text(100, 200, '  ===\n+  !   =\n  ===\n =     ==\n ======', { fontFamily: 'Arial', fontSize: 20, color: '#00ff00' }).setInteractive();
    player.setDisplaySize(30);
    player.setOrigin(0.5);
    this.input.setDraggable(player);
    init_player(false);   

    GameOver = this.add.text(400, 300, 'GameOver', { fontFamily: 'Arial', fontSize: 350, color: 'gray' });
    GameOver.setVisible(false);

    for(i=0; i<5; i++){
        FireList[i] = this.physics.add.image(0, Random_Int(500, 10), 'Fire');
        FireList[i].setOrigin(0.5);
        FireList[i].setDisplaySize(50);
    }
    for(i=0; i<5; i++){
        FireList[i+5] = this.physics.add.image(Random_Int(700, 10), 0, 'Fire');
        // FireList[i+5] = this.physics.add.text(Random_Int(700, 10), 0, 'O', { fontFamily: 'Arial', fontSize: Random_Int(80, 30), color: 'red' });
        FireList[i+5].setOrigin(0.5);
        FireList[i+5].setDisplaySize(50);
    }
    init_Fire(false);

    start = this.add.text(400, 480, 'start', { fontFamily: 'Arial', fontsize: 200, color: 'blue' });
    start.setInteractive();

    start.on('pointerdown', (pointer) => {
        start.setVisible(false);
        setTimeout( () => {
            console.log(player.y, FireList[3].y);
            init_player(true);
            init_Fire(true);
            for(i=0; i<5; i++){
                tween_LR.call(this, FireList[i]);
            }
            for(i=5; i<10; i++){
                tween_UD.call(this, FireList[i]);
            }
        }, delay)
    });

    
 // 까지 생성
    
    for(var k=0; k<10; k++){
        var emp = FireList[k];
        this.physics.add.collider(emp, player, () => {
            init_Fire(false);
            // console.log(emp);

        })
    }


    
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
    
        
    

    
    

    
    //불꽃 설정 끝
}
// create 끝

function init_player(bool) {
    player.setVisible(bool);
    player.setActive(bool);  
}
function init_Fire(bool) {
    for(var j=0; j<10; j++){
        FireList[j].setVisible(bool);
        FireList[j].setActive(bool);        
    }
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
            // console.log('yoyo');
        },
        onComplete: () => { 
            target.y = Random_Int(600, 0)
            // console.log('com')
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
            // console.log('yoyo');
        },
        onComplete: () => { 
            target.x = Random_Int(800, 0)
            // console.log('com')
            tween_UD.call(this, target);
        }
    });
}

//랜덤 함수 선언
function Random_Int(max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Random_Double (max, min){
    return Math.random() * (max - min) + min;
}
//랜덤 함수 선언 끝

// update
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
//update 끝





//그 외 나머지 부속들
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
    // console.log("random은 ",random);
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
