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
var FireList = [];
var tweenN = [];
var score = {};
var retry_on;
score.self = undefined;
score.num = 0;
score.gap = 1;
score.toggle = false;
score.best = 0;
var retry_picture;
var background_1;
// 전역 변수 선언 끝

function preload(){
    this.load.image('Fire', './assets/image/Fire_1.png');
    this.load.image('chicken', './assets/image/chicken_2.png');
    this.load.image('background', './assets/image/background_1.jpg');
    this.load.image('retry_picture', './assets/image/retry_picture.png');


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

    // background color
    this.cameras.main.setBackgroundColor('#bbbbbb');

    background_1 = this.add.image(0, 0, 'background');
    background_1.setDisplaySize(800, 600)
    background_1.setOrigin(0)
    retry_picture = this.add.image(0, 0, 'retry_picture');
    retry_picture.setInteractive();
    init_retry_picture(false);
    retry_picture.setAlpha(0.05);
    retry_picture.setDisplaySize(800, 600)
    retry_picture.setOrigin(0);

    score.self = this.add.text(400 , 40, 'BestScore: ' + score.best + '\nScore: ' + score.num, { fontFamily: 'Arial', fontSize: 30, color: 'gray' });
    score.self.setStroke('#000000', 5);
    score.self.setOrigin(0.5);

    //생성
    player = this.physics.add.image(400, 300, 'chicken')
    // player = this.physics.add.text(100, 200, '  ===\n+  !   =\n  ===\n =     ==\n ======', { fontFamily: 'Arial', fontSize: 20, color: '#00ff00' }).setInteractive();
    player.setDisplaySize(100, 100);
    player.setCircle(350, player.width/2 - 350, player.height/2 - 400);
    init_player(false);
    console.log('player:', player);

    GameOver = this.add.text(400, 300, 'GameOver', { fontFamily: 'Arial', fontSize: 100, color: 'black' });
    GameOver.setOrigin(0.5);
    GameOver.setVisible(false);

    for(i=0; i<5; i++){
        FireList[i] = this.physics.add.image(0, Random_Int(500, 10), 'Fire');
        FireList[i].setDisplaySize(100, 100);
        FireList[i].setCircle(120, FireList[i].width/2 - 90, FireList[i].height/2 - 120)

        FireList[i+5] = this.physics.add.image(Random_Int(700, 10), 0, 'Fire');
        // FireList[i+5] = this.physics.add.text(Random_Int(700, 10), 0, 'O', { fontFamily: 'Arial', fontSize: Random_Int(80, 30), color: 'red' });
        FireList[i+5].setDisplaySize(100, 100);
        FireList[i+5].setCircle(120, FireList[i+5].width/2 - 90, FireList[i+5].height/2 - 120)
    }

    console.log(FireList);

    init_Fire(false);
    console.log(player.y, FireList[3].y);

    retry = this.add.text(400, 400, 'R e t r y', { fontFamily: 'Arial', fonSize: 20, color: 'White' });
    retry.setOrigin(0.5);
    retry.setVisible(false);
    retry.setInteractive();


    start = this.add.text(400, 480, 'press to start', { fontFamily: 'Arial', fontSize: 40, color: 'blue' });
    start.setInteractive();
    start.setOrigin(0.5);

    this.input.once('pointerdown', (pointer) => {
        console.log('once');
        
        start.setVisible(false);
        player.setInteractive();
        this.input.setDraggable(player);
        init_player(true);
        setTimeout( () => {
            scoreToggleBoolean(true);
            init_Fire(true);
            for(i=0; i<5; i++){
                tween_LR.call(this, FireList[i], i);
            }
            for(i=5; i<10; i++){
                tween_UD.call(this, FireList[i], i);
            }
        }, delay)
    });

    console.log(player);
    //생성 끝
    
    for(var k=0; k<10; k++){
        var emp = FireList[k];
        this.physics.add.collider(emp, player, () => {
            if(player.visible == true && FireList[1].visible == true){
                init_retry_picture(true);
                init_Fire(false);
                init_player(false);
                GameOver.setVisible(true);
                retry.setVisible(true);
                scoreToggleBoolean(false);
                // for(var i=0; i<tweenN.length; i++){
                //     tweenN[i].remove();
                // }
                for(var i=0; i<10; i++){
                    if(i<5){
                        FireList[i].x = 0;
                        FireList[i].y = Random_Int(500, 10);
                    }
                    else{
                        FireList[i].x = Random_Int(700, 10);
                        FireList[i].y = 0;               //if문은 불을 초기 위치로 보낸다
                    }
                }
            }
        })
    }

    
    retry.on('pointerdown', () => {
        when_retry.call(this);
    })

    retry_picture.on('pointerdown', () => {
        when_retry.call(this);
    })

    //터치 기능
    this.input.on('pointerdown', function (pointer, gameObject) {
            xdf = player.x - pointer.x;
            ydf = player.y - pointer.y;
    });
    
    
    this.input.on('pointermove', function (pointer) {
        // console.log('when pointer move player y:', player.y)
        if(player._visible == true){
            if (pointer.isDown) {
                var stx = 0, sty = 0;
                stx = distanceX(pointer.x);
                sty = distanceY(pointer.y);
            }
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
    //터치 기능 끝
    
    function scoreToggle(){
        score.toggle = !score.toggle;
    }

    function scoreToggleBoolean(_bool) {
        score.toggle = _bool;
    }
    // function remove_Tween(t_name){
    //     var tween = this.tweens.addCounter({
    //         from: 0,
    //         to: 10,
    //         duration: 1,
    //         onUpdate: () => {
    //             tween.remove();
    //         }

    //     })



        // for(var i=0; i<5; i++){
        //     FireList[i].x = 0;
        //     FireList[i].y = Random_Int(500, 10);
            
        //     FireList[i+5].x = Random_Int(700, 10);
        //     FireList[i+5].y = 0;
        // }
        // init_FireList();
        // init_player(true);
    }
// create 끝

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

    updateScore();

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

//이하는 함수 선언
function when_retry() {
    init_retry_picture(false);
    init_player(true);
    GameOver.setVisible(false);
    retry.setVisible(false);
    setTimeout( () => {
        score.self.setText('BestScore: ' + score.best + '\nScore: ' + score.num);
        scoreToggleBoolean(true);
        init_Fire(true);
        console.log(tweenN);
        for(i=0; i<tweenN.length; i++){
            if(i<5){
                tween_LR.call(this, FireList[i], i);
            }
            else{
                tween_UD.call(this, FireList[i], i);
            }
        }
    }, delay)
}

function scoreToggle(){
    score.toggle = !score.toggle;
}

function scoreToggleBoolean(_bool) {
    score.toggle = _bool;
}

function updateScore() {
    if (score.toggle) {
        score.num += score.gap;
        if(score.best < score.num){
            score.best = score.num;
        }
        score.self.setText('BestScore: ' + score.best + '\nScore: ' + score.num);
    }
    else {
        score.num = 0;
        
    }
}

function init_retry_picture(bool) {
    retry_picture.setVisible(bool);
    retry_picture.setActive(bool); 
}
function init_player(bool) {
    player.setVisible(bool);
    player.setActive(bool);  
    if(bool){
        player.x = 400;
        player.y = 300;
    }
}
function init_Fire(bool) {
    for(var j=0; j<10; j++){
        FireList[j].setVisible(bool);
        FireList[j].setActive(bool);        
    }
}
function tween_LR(target, i) {
        tweenN[i] = this.tweens.add({
        targets: target,
        x: 800, 
        duration: Random_Double(5,1)*1000, 
        ease: 'Linear',
        yoyo: true,
        onYoyo: function () { 
            target.y = Random_Int(600, 0)
            // console.log('yoyo');
        },
        onUpdate: () => {
            if(player.visible == false){
                console.log('remove', i)
                tweenN[i].remove();
                target.x = 0
                target.y = Random_Int(600, 0);
            }
        },
        onComplete: () => { 
            
            if(player.visible == true){
                target.y = Random_Int(600, 0);
                tween_LR.call(this, target, i);
            }
        }
    });
}
function tween_UD(target, i) {
        tweenN[i] = this.tweens.add({
        targets: target,
        y: 600, 
        duration: Random_Double(5, 1)*1000, 
        ease: 'Linear',
        yoyo: true,
        repeat: 0,
        onYoyo: function () { 
            target.x = Random_Int(800, 0);
        },
        onUpdate: () => {
            if(player.visible == false){
                console.log('remove', i)
                tweenN[i].remove();
                target.x = Random_Int(800, 0);
                target.y = 0;
            }
        },
        onComplete: () => { 
            if(player.visible == true){
                target.x = Random_Int(800, 0);
                tween_UD.call(this, target, i);
            }
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







// //그 외 나머지 부속들
// function change() {
//     random = Random_Int(4,1);
//     switch(random){
//         case 1: 
//             Right_to_Left();
//             conTU = random;
//             break;
//         case 2:
//             Left_to_Right();
//             conTU = random;
//             break;
//         case 3: 
//             Up_to_Down();
//             conTU = random;
//             break;
//         case 4:
//             Down_to_Up();
//             conTU = random;
//             break;
//         default:
//             break;
//     }
//     // console.log("random은 ",random);
// }

// function Right_to_Left(){
//     if(fire.x >= -30){
//         fire.x -= 10; 
//     }
//     else{
//         fire.x = 830;
//         fire.y = Random_Double(600, 0);
//         // console.log(fire.y);
//     }
// }

// function Left_to_Right(){
//     if(fire.x <= 830){
//         fire.x += 10; 
//     }
//     else{
//         fire.x = -30;
//         fire.y = Random_Double(600, 0);
//         //console.log(fire.y);
//     }
// }

// function Up_to_Down(){
//     if(fire.y <= 630){
//         fire.y += 10; 
//     }
//     else{
//         fire.y = -30;
//         fire.x = Random_Double(800, 0);
//         //console.log(fire.x);
//     }
// }

// function Down_to_Up(){
//     if(fire.y >= -30){
//         fire.y -= 10; 
//     }
//     else{
//         fire.y = 630;
//         fire.x = Random_Double(800, 0);
//         //console.log(fire.x);
//     }
// }
