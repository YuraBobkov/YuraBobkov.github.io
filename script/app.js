const pjs = new PointJS('2d', 400, 400);
pjs.system.initFullPage();
const OOP = pjs.OOP;
const game = pjs.game;
const brush = pjs.brush;
const v2d = pjs.vector.v2d;
const mouse = pjs.mouseControl;
mouse.initMouseControl();
const key = pjs.keyControl;
key.initKeyControl();
const width = game.getWH().w;
const height = game.getWH().h;
const random = pjs.math.random;
const bullets = [];
const enemy = [];
const living = [];
const clip = [];
let score = 0;
let patronCount = 7;
let enemySpawnCount = 0;
let mPos;
const audio = pjs.audio.newAudio('audio/muz.mp3');
const die = pjs.audio.newAudio('audio/die.wav');
const shoot = pjs.audio.newAudio('audio/shoot.wav');
const bonus = pjs.audio.newAudio('audio/bonus.wav');
const rel = pjs.audio.newAudio('audio/reload.wav');
const pain = pjs.audio.newAudio('audio/pain.wav');


// ____________________________Constructors____________________________

function AddLife() {
    return game.newImageObject({
        file: 'images/life.png',
        x: random(0, width - 40),
        y: random(0, height - 40),
        w: 452, h: 314,
        scale: 0.1,
    });
}
function PistolClip() {
    return game.newImageObject({
        file: 'images/add.png',
        x: random(0, width - 40),
        y: random(0, height - 40),
        w: 271, h: 346,
        scale: 0.1,
    });
}
function Pistol() {
    return game.newRectObject({
        x: man.getPositionC().x, y: man.getPositionC().y,
        fillColor: 'red',
        w: 8, h: 3,
        userData: {
            dmg: 5,
            life: 1,
        },
        angle: man.getAngle()
    });
}
function Zombie() {
    return game.newAnimationObject({
        animation: pjs.tiles.newAnimation('images/zombie.png', 91, 49, 8),
        x: random(0, width),
        y: random(0, height / 3),
        w: 91, h: 49,
        scale: 0.5,
        userData: {
            hp: 5,
            dmg: 1,
            score: 7
        }
    })
}
function Eagle() {
    return game.newAnimationObject({
        animation: pjs.tiles.newAnimation('images/eagle.png', 78, 182, 8),
        x: random(width - width / 5, width),
        y: random(0, height),
        w: 78, h: 128,
        scale: 0.5,
        userData: {
            hp: 10,
            dmg: 3,
            score: 15
        }
    })
}
const aim = game.newImageObject({
    file: 'images/aim.png',
    scale: 0.15
});
const background = game.newImageObject({
    x: 0, y: 0,
    file: "images/BC.jpg",
    w: width, h: height,
});
const backgroundEnd = game.newImageObject({
    x: 0, y: 0,
    file: "images/end.jpg",
    w: width, h: height,
});
const backgroundMenu = game.newImageObject({
    x: 0, y: 0,
    file: "images/BCMenu.jpeg",
    w: width, h: height,
});
const man = game.newAnimationObject({
    animation: pjs.tiles.newAnimation('images/man.png', 37.625, 32, 8),
    w: 37.625, h: 32,
    x: width / 2, y: height / 2,
    userData: {
        hp: 100,
        life: 3,
        patron: 7
    }
});
const newGame = game.newBaseObject({
    x: width / 2 - 205, y: height / 2 - 100,
    h: 50, w: 260
});
const Instruction = game.newBaseObject({
    x: width / 2 - 210, y: height / 2,
    h: 50, w: 260
});
const back = game.newBaseObject({
    x: width / 2 - 150, y: height - 150,
    h: 50, w: 210
});
const playAgain = game.newBaseObject({
    x: width / 2 - 175, y: height / 2 - 50,
    h: 50, w: 250
});

// ____________________________________OOP______________________________

OOP.forInt(5, function () {
    const zombie = new Zombie();
    enemy.push(zombie);
    const eagle = new Eagle();
    enemy.push(eagle);
});
setInterval(function () {
    OOP.forInt(1, function () {
        const addLife = new AddLife();
        living.push(addLife);
    });
}, 60000);
setInterval(function () {
    OOP.forInt(1, function () {
        const pistolClip = new PistolClip();
        clip.push(pistolClip);
    });
}, 20000);
man.keyMove = function () {
    if (key.isDown('D') && man.getPositionS().x < width - 40) {
        man.move(v2d(2, 0));
    }
    if (key.isDown('A') && man.getPositionS().x > 0) {
        man.move(v2d(-2, 0));
    }
    if (key.isDown('S') && man.getPositionS().y < height - 40) {
        man.move(v2d(0, 2));
    }
    if (key.isDown('W') && man.getPositionS().y > 0) {
        man.move(v2d(0, -2));
    }
};
man.mousePress = function () {
  if (mouse.isPress('LEFT') && man.patron) {
    shoot.play(0.1);
    const bullet = new Pistol();
    bullets.push(bullet);
    man.patron -= 1;
  }
  if (mouse.isPress('RIGHT')) {
    rel.play();
    setTimeout(function reload() {
      return man.patron = patronCount;
    }, 1000)
  }

};

// ________________________________LOOP__________________________

game.newLoop('menu', function () {
    game.clear();
    backgroundMenu.draw();
    if (mouse.isPeekStatic('LEFT', Instruction.getStaticBox())) {
        game.setLoop('Instruction');
    }
    if (mouse.isPeekStatic('LEFT', newGame.getStaticBox())) {
        game.setLoop('game');
    }
    brush.drawText({
        text: 'New Game',
        x: width / 2 - 205, y: height / 2 - 100,
        size: 50,
        style: 'bold',
        color: 'white',
        font: 'Rockwell Extra Bold'
    });
    brush.drawText({
        text: 'Instruction',
        x: width / 2 - 210, y: height / 2,
        size: 50,
        style: 'bold',
        color: 'white',
        font: 'Rockwell Extra Bold'
    });
    aim.setPositionC(mouse.getPosition());
    aim.draw();
});
game.setLoop('menu');
game.start();
game.newLoop('Instruction', function () {
    game.clear();
    background.draw();
    if (mouse.isPeekStatic('LEFT', back.getStaticBox())) {
        game.setLoop('menu');
    }
    brush.drawImage({
        file: "images/Instr.png",
        x: 0, y: 100,
    });
    brush.drawText({
        text: 'Go Back',
        x: width / 2 - 150, y: height - 150,
        size: 50,
        style: 'bold',
        color: 'white',
        font: 'Rockwell Extra Bold'
    });
    aim.setPositionC(mouse.getPosition());
    aim.draw();
});
game.newLoop('playAgain', function () {
    game.clear();
    backgroundEnd.draw();
    brush.drawText({
        text: 'Game Over, Man!',
        x: width / 2 - 250, y: height / 2 - 200,
        size: 50,
        color: "white",
        font: 'Rockwell Extra Bold'
    });
    if (mouse.isPeekStatic('LEFT', playAgain.getStaticBox())) {
        game.setLoop('menu');
    }
    brush.drawText({
        text: 'Main Menu',
        x: width / 2 - 175, y: height / 2 - 50,
        size: 50,
        style: 'bold',
        color: 'white',
        font: 'Rockwell Extra Bold'
    });
    aim.setPositionC(mouse.getPosition());
    aim.draw();
    man.hp = 100;
    patronCount = 7;
    man.life = 3;
});
game.newLoop('game', function () {
    audio.play(0.05);
    game.clear();
    background.draw();
    OOP.forArr(bullets, function (el, index) {
        el.draw();
        el.moveAngle(25);
        if (el.getPosition(1).x > width || el.getPosition(1).x < 0 || el.getPosition(1).y > height || el.getPosition(1).y < 0) {
            bullets.splice(index, 1);
        }
    });
    OOP.forArr(clip, function (el, index) {
        el.draw();
        if (el.isIntersect(man)) {
            bonus.play(0.2);
            patronCount += 2;
            clip.splice(index, 1);
        }
    });
    OOP.forArr(living, function (el, index) {
        el.draw();
        if (el.isIntersect(man)) {
            bonus.play(0.2);
            man.life += 1;
            living.splice(index, 1);
        }
    });
    OOP.forArr(enemy, function (el, index) {
        if (el.hp > 0) {
            el.draw();
            setTimeout(function () {
                el.rotate(man.getPosition());
                el.moveTo(man.getPosition(), 2.1);
            }, 400)
        }
        if (el.isArrIntersect(bullets)) {
            el.hp -= Pistol().dmg;
            if (el.hp < 1) {
                enemy.splice(index, 1);
                score += el.score;
            }
            bullets.splice(bullets.indexOf(el), 1);
        }
        if (el.isIntersect(man)) {
            man.hp -= el.dmg;
            pain.play();
        }
        if (enemy.length < 3) {
            OOP.forInt(7 + enemySpawnCount, function () {
                const zombie = new Zombie();
                enemy.push(zombie);
                const eagle = new Eagle();
                enemy.push(eagle);
            });
            enemySpawnCount += 1;
        }
    });
    if (man.hp < 1) {
        man.life -= 1;
        man.hp = 100;
        man.x = width / 2;
        man.y = height / 2;
        man.patron = patronCount;
        enemy.splice(0, enemy.length - 1);
    }
    if (man.life < 1) {
        die.play();
        audio.stop();
        game.setLoop('playAgain')
        enemySpawnCount = 0;
    }
    brush.drawImage({
        file: "images/patron.png",
        x: 50, y: height - 80,
        w: 20, h: 50
    });
    OOP.forInt(man.life, function (i) {
        brush.drawImage({
            file: "images/helmet.png",
            x: width - 55 - (45 + 10) * i, y: 20,
            w: 45, h: 45
        });
    });
    brush.drawText({
        text: " x " + man.patron,
        x: 70, y: height - 60,
        size: 30,
        color: "white"

    });
    brush.drawText({
        text: " Health: " + man.hp,
        x: width / 2 - 50, y: 20,
        size: 20,
        color: "red",
        font: 'comic sans ms'
    });
    brush.drawText({
        text: " Score: " + score,
        x: 50, y: 20,
        size: 20,
        color: "white",
        font: 'comic sans ms'
    });
    man.mousePress();
    man.keyMove();
    man.rotate(mouse.getPosition());
    man.draw();
    aim.setPositionC(mouse.getPosition());
    aim.draw();
});
