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
    },
    audio: {
        disableWebAudio: true
    }
};

document.body.style.backgroundColor = "green";        


// <전역 변수 선언>
var game = new Phaser.Game(config);

var player;
var dead_chicken;
var FireList = [];
var tweenN = [];
var rankBlock = undefined;

var retry_on = false;
var retry_picture;
var background_1;
var start;

var i=0;
var bool = true;
var random = 0;
var delay = 3000;

class levelManager {
    constructor() {
        this.level = [];
        this.self = 1;
        this.initLevel();
    }
    setCommon(_fireNum, _twDur) {
        var tmpO = {};
        tmpO.fireNum = _fireNum;
        tmpO.twDur = _twDur;
        return tmpO;
    }
    initLevel() {
        this.level.push(this.setCommon(5, Random_Double(7, 3)*1000));
        this.level.push(this.setCommon(5, Random_Double(5, 1)*1000));
        this.level.push(this.setCommon(10, Random_Double(5, 1)*1000));
    }
    getLevel(_idx) {
        return this.level[_idx];
    }
}
var tmpLM = new levelManager();

var score = {};
score.self = undefined;
score.num = 0;
score.gap = 1;
score.toggle = false;
score.best = [0, 0, 0];
score.bestTxt = [];

var timer = {};
timer.num = 500;
timer.gap = 2
timer.toggle = false;

var Touch_stick_x = 0;
var Touch_stick_y = 0;

var levelTexture = [];

var test_music = undefined;

// class SndManager {
//     constructor() {

//     }
//     classPreload(_scene) {
//         _scene.load.audio('theme', './assets/audio/G_major_test');


//     }




// }
// var tmpSM = new SndManager();
// <!전역 변수 선언>

// <preload>
function preload(){
    this.load.image('Fire', './assets/image/jin_fire_1.png');
    this.load.image('chicken', './assets/image/jin_chicken_s.png');
    this.load.image('deadChicken', './assets/image/jin_deadChicken.png')
    this.load.image('background', './assets/image/jin_Grill_1.png');
    this.load.image('retry_picture', './assets/image/retry_picture.png');

    this.load.audio('theme', './assets/audio/start_ting.wav');
}
// <!preload>

// <create>
function create() 
{    

    // <background, start, retry, score, player, Fire, Gameover 생성>
    test_music = this.sound.add('theme'); 

    this.cameras.main.setBackgroundColor('#bbbbbb');

    background_1 = this.add.image(0, 0, 'background');
    background_1.setDisplaySize(800, 600);
    background_1.setOrigin(0);

    rankBlock = this.add.graphics();

    var rb_thickness = 4;
    var rb_color = 0x000000;
    var rb_alpha = 1

    rankBlock.lineStyle(rb_thickness, rb_color, rb_alpha);
    rankBlock.fillStyle(0xFFFFFF, 1);
    rankBlock.fillRect(220, 80, 360, 280);
    rankBlock.strokeRect(220, 80, 360, 280);
    rankBlock.setVisible(false);
    rankBlock.setAlpha(0.7);

    start = this.add.text(400, 480, 'press to start', { fontFamily: 'Arial', fontSize: 40, color: 'blue' });
    start.setInteractive();
    start.setOrigin(0.5);

    retry = this.add.text(400, 400, 'R e t r y', { fontFamily: 'Arial', fonSize: 20, color: 'White' });
    retry.setOrigin(0.5);
    retry.setVisible(false);
    retry.setInteractive();
    retry_picture = this.add.image(0, 0, 'retry_picture');
    retry_picture.setInteractive();
    init_retry_picture(false);
    retry_picture.setAlpha(0.01);
    retry_picture.setDisplaySize(800, 600)
    retry_picture.setOrigin(0);

    score.self = this.add.text(400 , 60, 'Score: ' + score.num, { fontFamily: 'Arial', fontSize: 50, color: 'white' });
    score.self.setStroke('#000000', 5);
    score.self.setOrigin(0.5);
    
    score.bestTxt[0] = this.add.text(240 , 105, 'RANK 1            '   + score.best[0], { fontFamily: 'Arial', fontSize: 40, color: 'gold' });
    score.bestTxt[1] = this.add.text(240 , 155, 'RANK 2            '   + score.best[1], { fontFamily: 'Arial', fontSize: 40, color: 'silver' });
    score.bestTxt[2] = this.add.text(240 , 205, 'RANK 3            '   + score.best[2], { fontFamily: 'Arial', fontSize: 40, color: 'brown' });
    score.bestTxt[0].setStroke('#000000', 3);
    score.bestTxt[1].setStroke('#000000', 3);
    score.bestTxt[2].setStroke('#000000', 3);

    // timer.self = this.add.text(400 , 40, 'Time: ' + timer.num, { fontFamily: 'Arial', fontSize: 30, color: 'gray' });
    // timer.self.setStroke('#000000', 5);
    // timer.self.setOrigin(0.5);
    // timer.self.setVisible(false);
    
    levelTexture[0] = this.add.text(400, 40, 'Level' + 1, { fontFamily: 'Arial', fontSize: 30, color: 'black' });
    levelTexture[0].setVisible(false);
    levelTexture[1] = this.add.text(400, 40, 'Level' + 2, { fontFamily: 'Arial', fontSize: 30, color: 'black' });
    levelTexture[1].setVisible(false);
    

    player = this.physics.add.image(400, 300, 'chicken');
    player.setDisplaySize(105, 121);
    player.setCircle(70, player.width/2 - 60, player.height/2 - 40);
    init_player(false);

    dead_chicken = this.physics.add.image(400, 480, 'deadChicken');
    dead_chicken.setDisplaySize(70, 56)
    dead_chicken.setVisible(false)

    for(i=0; i<5; i++){
        FireList[i] = this.physics.add.image(0, Random_Int(500, 10), 'Fire');
        FireList[i].setDisplaySize(60, 73);
        FireList[i].setCircle(28, FireList[i].width/2 - 25, FireList[i].height/2 - 28)

        FireList[i+5] = this.physics.add.image(Random_Int(700, 10), 0, 'Fire');
        FireList[i+5].setDisplaySize(60, 73);
        FireList[i+5].setCircle(28, FireList[i+5].width/2 - 25, FireList[i+5].height/2 - 28)
    }
    init_Fire(false);

    GameOver = this.add.text(400, 300, 'GameOver', { fontFamily: 'Arial', fontSize: 100, color: 'yellow' });
    GameOver.setOrigin(0.5);
    GameOver.setVisible(false);
    // <!background, start, retry, score, timer, player, Fire, Gameover 생성>

    // <Press to start 첫 시작 이벤트>
    this.input.once('pointerdown', (pointer) => {
        console.log('once');
        test_music.play();
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
    // <!Press to start 첫 시작 이벤트>
    
    // <Level나눅이>

    // this.input.once('pointerdown', (pointer) => {
    //     console.log('once');
    //     // test_music.play();
    //     switch (tmpLM.self) {
    //         case 1:
    //             start.setVisible(false);
    //             player.setInteractive();
    //             this.input.setDraggable(player);
    //             levelTexture[0].setVisible(true);
    //             init_player(true);
    //             setTimeout( () => {
    //                 scoreToggleBoolean(false);
    //                 init_Fire(true);
    //                 for(i=0; i<2; i++){
    //                     tween_LR.call(this, FireList[i], i, tmpLM.level._twdur);
    //                 }
    //                 for(i=3; i<6; i++){
    //                     tween_UD.call(this, FireList[i], i, tmpLM.level._twdur);
    //                 }
    //             }, delay)
    
    //             setTimeout( () => {
    //                 tmpLM.self = 2
    //                 init_player(false);
    //                 levelTexture[1].setVisible(false);
    //                 break;
    //             }, 50000)
    
    //         case 2:
    //             setTimeout( () => {
    //                 init_player(true);
    //                 init_Fire(true);
    //                 for(i=0; i<5; i++){
    //                     tween_LR.call(this, FireList[i], i, tmpLM.level._twdur);
    //                 }
    //                 for(i=5; i<10; i++){
    //                     tween_UD.call(this, FireList[i], i, tmpLM.level._twdur);
    //                 }
    //                 levelTexture[1].setVisible(true);
    //             }, delay)
    
    //             setTimeout( () => {
    //                 tmpLM.self = 3
    //                 levelTexture[1].setVisible(false);
    //                 break;
    //             }, 70000)
    
    //         case 3:
    //             setTimeout( () => {
    //                 scoreToggleBoolean(true);
    //                 init_Fire(true);
    //                 for(i=0; i<5; i++){
    //                     tween_LR.call(this, FireList[i], i, tmpLM.level._twdur);
    //                 }
    //                 for(i=5; i<10; i++){
    //                     tween_UD.call(this, FireList[i], i, tmpLM.level._twdur);
    //                 }
    //             }, delay)
    
    //             break;
    //     }
    // });
    












    // <collide 충돌 시 이벤트>
    for(var k=0; k<10; k++){
        var emp = FireList[k];
        this.physics.add.collider(emp, player, () => {
            if(player.visible == true && FireList[1].visible == true){
                test_music.play();
                init_player(false);
                init_Fire(false);
                init_retry_picture(true);
                // GameOver.setVisible(true);
                retry.setVisible(true);
                scoreToggleBoolean(false);
                dead_chicken.setVisible(true);
                score.self.setVisible(false);
                rankBlock.setVisible(true);

                if(score.best[0] < score.num){
                    score.best[0] = score.num;
                    score.bestTxt[0].setText('RANK 1            '   + score.best[0]);
                }
                else if(score.best[1] < score.num){
                    score.best[1] = score.num;
                    score.bestTxt[1].setText('RANK 2            '   + score.best[1]);
                }
                else if(score.best[2] < score.num){
                    score.best[2] = score.num;
                    score.bestTxt[2].setText('RANK 3            '   + score.best[2]);
                }

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
    // <!collide 충돌 시 이벤트>
    
    // <retry 재시작 이벤트>
    retry_picture.on('pointerdown', () => {
        if(retry_on == true){
            when_retry.call(this);
            retry_on = !retry_on;
        }    
    })
    // <!retry 재시작 이벤트>

    // <Touch Pad 기능>
    this.input.on('pointerdown', function (pointer, gameObject) {
            Touch_stick_x = player.x - pointer.x;
            Touch_stick_y = player.y - pointer.y;
    });
    
    this.input.on('pointermove', function (pointer) {
        if(player._visible == true){
            if (pointer.isDown) {
                var stx = 0, sty = 0;
                stx = distanceX(pointer.x);
                sty = distanceY(pointer.y);
            }
        }
    });

    PhaserGUIAction(
		this,
		{
			alpha: 0.6, // 0.0 ~ 1.0 (any value, you can change it in GUI)
			// right: 100, // any value
			// top: 50 // any value
		}
	);
}
// <!create>

// <update>
function update()
{
    // <벽 통과 방지>
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
    // <!벽 통과 방지>
    
    updateTimer();
    updateScore();

}
// <!update>






































// ㄱㄷ
// <Toggles>
function scoreToggle(){
    score.toggle = !score.toggle;
}
function scoreToggleBoolean(_bool) {
    score.toggle = _bool;
}
function timerToggle(){
    timer.toggle = !timer.toggle;
}
function timerToggleBoolean(_bool) {
    timer.toggle = _bool;
}
// <!Toggles>

// <Touch pad 기능>
function distanceX(_pointerX) {

    player.x = _pointerX + Touch_stick_x;

    return _pointerX + Touch_stick_x;
}

function distanceY(_pointerY) {

    player.y = _pointerY + Touch_stick_y;

    return _pointerY + Touch_stick_y;
}
// <!Touch Pad 기능>

// <Press to start 첫 시작 이벤트>
function start () {
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
};
// <!Press to start 첫 시작 이벤트>
 
// <retry 기능>
function when_retry() {
    rankBlock.setVisible(false);
    test_music.play();
    init_retry_picture(false);
    init_player(true);
    dead_chicken.setVisible(false);
    GameOver.setVisible(false);
    retry.setVisible(false);
    score.self.setVisible(true)
    setTimeout( () => {
        score.self.setText('BestScore: ' + score.best + '\nScore: ' + score.num);
        scoreToggleBoolean(true);
        init_Fire(true);
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
// <!retry 기능>

// <update 기능>
function updateScore() {
    if (score.toggle) {
        score.num += score.gap;
        if(score.best < score.num){
            score.best = score.num;
        }
        score.self.setText('Score: ' + score.num);
    }
    else {
        score.num = 0;
        
    }
}
function updateTimer(){
    if (timer.toggle) {
        timer.num += timer.gap;
        timer.self.setText('Time: ' + timer.num);
    }
    else {
        timer.num = 0;
        
    }
}
// <!update 기능>

// <init 기능>
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
// <!init 기능>

// <tween 기능>
function tween_LR(target, i) {
    tweenN[i] = this.tweens.add({
        targets: target,
        x: 800, 
        duration: Random_Double(5, 1)*1000, 
        ease: 'Linear',
        yoyo: true,
        onYoyo: function () { 
            target.y = Random_Int(600, 0)
        },
        onUpdate: () => {
            if(player.visible == false){
                console.log('remove', i)
                tweenN[i].remove();
                target.x = 0
                target.y = Random_Int(600, 0);
                if(i == 9){
                    retry_on = true;
                }
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
                if(i == 9){
                    retry_on = true;
                }
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
// <!tween 기능>

// <Random 기능>
function Random_Int(max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function Random_Double (max, min){
    return Math.random() * (max - min) + min;
}
// <!Random 기능>