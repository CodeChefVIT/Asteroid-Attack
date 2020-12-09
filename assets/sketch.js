// @ts-nocheck

var bullets;
var asteroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var score = 0;
var life = 3;
var remov = true;

function setup() {
    createCanvas(800, 600);

    bulletImage = loadImage('./assets/asteroids_bullet.png');
    shipImage = loadImage('./assets/asteroids_ship0001.png');
    particleImage = loadImage('./assets/asteroids_particle.png');

    ship = createSprite(width / 2, height / 2);
    ship.maxSpeed = 60;
    ship.friction = 0.7;
    ship.setCollider('circle', 0, 0, 20);

    ship.addImage('normal', shipImage);
    ship.addAnimation('thrust', './assets/asteroids_ship0002.png', './assets/asteroids_ship0007.png');

    asteroids = new Group();
    bullets = new Group();

    for (var i = 0; i < 8; i++) {
        var ang = random(360);
        var px = width / 2 + 1000 * cos(radians(ang));
        var py = height / 2 + 1000 * sin(radians(ang));
        createAsteroid(3, px, py);
    }
}

function draw() {
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text('Controls: Arrow Keys + X', width / 2, 20);
    text(`Lives: ${life}`, width / 5, 30);
    text(`Score: ${score}`, 4 * width / 4, 30);
    for (var i = 0; i < allSprites.length; i++) {
        var s = allSprites[i];
        if (s.position.x < -MARGIN) s.position.x = width + MARGIN;
        if (s.position.x > width + MARGIN) s.position.x = -MARGIN;
        if (s.position.y < -MARGIN) s.position.y = height + MARGIN;
        if (s.position.y > height + MARGIN) s.position.y = -MARGIN;
    }
    asteroids.overlap(bullets, asteroidHit);
    ship.bounce(asteroids, decLife);
    if (keyDown(LEFT_ARROW))
        ship.rotation -= 4;
    if (keyDown(RIGHT_ARROW))
        ship.rotation += 4;
    if (keyDown(UP_ARROW)) {
        ship.addSpeed(20, ship.rotation);
        ship.changeAnimation('thrust');
    }
    else
        ship.changeAnimation('normal');
    if (keyWentDown('x')) {
        var bullet = createSprite(ship.position.x, ship.position.y);
        bullet.addImage(bulletImage);
        bullet.setSpeed(20 + ship.getSpeed() / 2, ship.rotation);
        bullet.life = 20;
        bullets.add(bullet);
    }
    if (life === 0) {
        for (var j = 0; j < allSprites.length; j++) {
            var t = allSprites[j];
            t.setSpeed(0);
        }
        background(10);
        textSize(48);
        fill(255,0,0);
        text("GAME OVER", width / 2, 170);
        textSize(32);
        text(`Score: ${score}`, width / 2, 300);
        text("Press 'R' to restart", width/2, 430);
        if (keyWentDown('r')) {
            reset();
        }
        if(remov) startRemove();
    }
    drawSprites();
}

function createAsteroid(type, x, y) {
    var a = createSprite(x, y);
    var img = loadImage('./assets/asteroid' + floor(random(0, 3)) + '.png');
    a.addImage(img);
    a.setSpeed(2.5 - (type / 2), random(360));
    a.rotationSpeed = 0.5;
    a.type = type;

    if (type == 2)
        a.scale = 0.6;
    if (type == 1)
        a.scale = 0.3;

    a.mass = 2 + a.scale;
    a.setCollider('circle', 0, 0, 50);
    asteroids.add(a);
    return a;
}

function asteroidHit(asteroid, bullet) {
    var newType = asteroid.type - 1;

    if (newType > 0) {
        createAsteroid(newType, asteroid.position.x, asteroid.position.y);
        createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    }

    for (var i = 0; i < 10; i++) {
        var p = createSprite(bullet.position.x, bullet.position.y);
        p.addImage(particleImage);
        p.setSpeed(random(3, 5), random(360));
        p.friction = 0.95;
        p.life = 15;
    }

    score++;

    bullet.remove();
    asteroid.remove();
}

function decLife(ship, asteroid) {
    life--;
    asteroid.remove();
}

function reset() {
    score = 0;
    life = 3;
    ship.position.x = 400;
    ship.position.y = 300;
    remov = true;
    asteroids.removeSprites();
    for (var i = 0; i < 8; i++) {
        var ang = random(360);
        var px = width / 2 + 1000 * cos(radians(ang));
        var py = height / 2 + 1000 * sin(radians(ang));
        createAsteroid(3, px, py);
    }
}

function startRemove() {
    remov = false;
    setInterval(() => {allSprites[0].remove()}, 2000);
}