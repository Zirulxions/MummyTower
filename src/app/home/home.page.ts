import { Component } from '@angular/core';
import { MenuController} from '@ionic/angular';
import { Router } from '@angular/router';

declare let Phaser;
//import * as Phaser from "phaser-ce";

let levelFireRate = 1;
let upgradeFRCost = 10;
let upCostFRText;
let levelBulletSpeed = 1;
let upgradeBSCost = 10;
let upCostBSText;
let upgradeRateButton;
let upgradeSpeedButton;
let spawnRate = 10000;
let firingRate = 5000;
let aux;
let levelState = true;
let currentLevel = 1;
let levelText;
let enemyCountKill;
let game;
let that;
let floor;
let roof;
let starfield;
let base;
let player;
let enemies;
let stateText;
let explosions;
let aimingx = window.innerWidth / 2;
let aimingy = window.innerHeight / 2;
let bullets;
let firingTimer = 0;
let spawnTimer = 0;
let moneyString = '';
let moneyText;
let money = 100;
let scoreString = '';
let scoreText;
let score = 0;
let enemy;
let enemyArray = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  constructor(private menuCtrl: MenuController, private router: Router) {
    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'space-invaders',
      { preload: this.preload, create: this.create, update: this.update, render: this.render });
    that = Object.create(this.constructor.prototype);
  }
/*
  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }
*/
  preload() {
    game.load.image('starfield', 'assets/phaser/starfield.jpg');
    game.load.image('ground', 'assets/phaser/platform.png');
    game.load.image('roof', 'assets/phaser/roof.png');
    game.load.image('base', 'assets/phaser/skycraper1.png');
    game.load.spritesheet('mummy', 'assets/phaser/metalslug_mummy37x45.png', 37, 45, 18)
    game.load.spritesheet('kaboom', 'assets/phaser/explode.png', 128, 128);
    game.load.image('bullet', 'assets/phaser/enemy-bullet.png');
    game.load.image('buttonUpgDmg', 'assets/phaser/butUpgFireRate.png');
    game.load.image('buttonUpgSpeed', 'assets/phaser/butUpgSpeed.png');
    //game.input.addPointer();
  }

  render(){
    //game.debug.pointer(game.input.mousePointer);
    //game.debug.pointer(game.input.pointer1);
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'starfield');

    var xMax = window.innerWidth;
    var yMax = window.innerHeight;
    var standardScale = (xMax / yMax) / 2;

    //console.log(standardScale);
    //console.log(xMax + " " + yMax);

    //  Bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(300, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  The game floor
    floor = game.add.image(0, (window.innerHeight - 30), 'ground');
    floor.scale.set(2);
    floor.enableBody = true;

    //  The game roof
    roof = game.add.image(0, -25, 'roof');
    roof.scale.set(2);
    roof.enableBody = true;


    //  The game base
    //base = game.add.image((window.innerWidth - 50), (window.innerHeight - 240), 'base');
    base = game.add.sprite((window.innerWidth - 50), (window.innerHeight - 240), 'base')
    base.scale.set(0.4);
    //base.enableBody = true;
    game.physics.enable(base, Phaser.Physics.ARCADE);
    //base.animations.add('kaboom');

    //  The enemies
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.createMultiple(151, 'mummy');
    enemies.setAll('outOfBoundsKill', true);
    enemies.setAll('checkWorldBounds', true);

    that.createNewEnemy();

    //  Money text
    moneyString = 'Balance: ';
    moneyText = game.add.text(10, 10, moneyString + money + '$', { font: '20px Arial', fill: '#fff' });

    //  Score text
    scoreString = 'Score: ';
    scoreText = game.add.text(10, 30, scoreString + score, { font: '20px Arial', fill: '#fff' });

    //  Level text
    levelText = game.add.text(window.innerWidth / 10, window.innerHeight / 3.5, 'Level: ' + currentLevel, { font: '30px Arial', fill: '#fff' });
    //levelText.visible = false;

    //  Explosion pool
    explosions = game.add.group();
    explosions.createMultiple(10, 'kaboom');

    //  Action buttons
    upgradeRateButton = game.add.button(window.innerWidth - 160, 15, 'buttonUpgDmg', that.upgradeFireRate);
    upgradeRateButton.scale.set(0.4);

    upgradeSpeedButton = game.add.button(window.innerWidth - 160, 50, 'buttonUpgSpeed', that.upgradeBulletSpeed);
    upgradeSpeedButton.scale.set(0.4);

    //  Upgrade costs levelText
    upCostFRText = game.add.text(window.innerWidth - 82, 17, 'Cost: \n' + upgradeFRCost + '$', { font: '10px Arial', fill: '#fff' });
    upCostBSText = game.add.text(window.innerWidth - 82, 52, 'Cost: \n' + upgradeBSCost + '$', { font: '10px Arial', fill: '#fff' });

    //  State Text
    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '34px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
  }

  upgradeFireRate(){
    if(money >= upgradeFRCost){
      money -= upgradeFRCost;
      moneyText.text = moneyString + money + '$';
      levelFireRate += 0.2;
      upgradeFRCost = upgradeFRCost * 2;
      upCostFRText.text = 'Cost: \n' + upgradeFRCost + '$';
      console.log('Succesfully Upgraded Fire Rate!!! New Cost: ' + upgradeFRCost);
    } else {
      console.log('No money!');
    }
  }

  upgradeBulletSpeed(){
    if(money >= upgradeBSCost){
      money -= upgradeBSCost;
      moneyText.text = moneyString + money + '$';
      levelBulletSpeed += 0.2;
      upgradeBSCost = upgradeBSCost * 2;
      upCostBSText.text = 'Cost: \n' + upgradeBSCost + '$';
      console.log('Succesfully Upgraded Bullet Speed!!! New Cost: ' + upgradeBSCost);
    } else {
      console.log('No money!');
    }
  }

  createNewEnemy(){
    if(enemyArray.length < 150){
      enemy = enemies.create(10, window.innerHeight - 50, 'mummy');
      //enemy = enemyArray.length - 1;
      enemy.anchor.setTo(0.5, 0.5);
      enemy.animations.add('walk');
      enemy.play('walk', 10, true, false);
      enemy.body.moves = false;
      enemyArray.push(enemy);
    }
    if(currentLevel == 1){
      spawnTimer = game.time.now + spawnRate;
    } else if (currentLevel > 1) {
      spawnTimer = game.time.now + spawnRate / (currentLevel + currentLevel * 0.1);
    }
    //console.log(spawnTimer);
  }

  update() {
    //console.log(game.input.onUp + " " + game.input.onDown + " " + game.input.onHold + " " + game.input.onTap);

    //  Validate current level
    if(score / 1000 >= 1 && score % 1000 == 0 && levelState == true){
      currentLevel++;
      levelText.text = 'Level: ' + currentLevel;
      levelState = false;
    }
    if(score % 1000 != 0){
      levelState = true;
    }

    //  Check input up.
    if(game.input.pointer1.isDown){
      aimingx = game.input.x;
      aimingy = game.input.y;
      //console.log("X: " + aimingx + " Y: " + aimingy);
    }
    //  Scroll the background
    starfield.tilePosition.y -= 0.2;
    starfield.tilePosition.x -= 0.2;
    //console.log(base.alive);
    //console.log(enemy.alive);
    if(base.alive){
      for(let elem in enemyArray){
        enemyArray[elem].position.x += 0.5;
      }

      //  Collision handler
      game.physics.arcade.overlap(enemyArray[0], base, that.collisionLose, null, this);
      game.physics.arcade.overlap(bullets, enemies, that.userHitEnemy, null, this);

      //  Enemy spawn event
      if(game.time.now > spawnTimer){
        that.createNewEnemy();
      }
      //  Auto user shoot
      if(game.time.now > firingTimer){
        that.autoUserFire();
      }
    }
  }

  collisionLose(enemy, base){
    //  Kill all
    enemy.kill();
    base.kill();
    enemyArray.pop();

    /*//  Base explosion
    let explosion = explosions.getFirstExists(false);
    explosion.reset(base.body.x - 50, base.body.y);
    explosion.play('kaboom', 10, false, true);
    */

    stateText.text = " GAME OVER...\n Click to restart";
    stateText.visible = true;

    game.input.onTap.addOnce(that.restart, this);
  }

  restart(){
    while(enemyArray.length > 0){
      enemyArray.pop();
    }
    enemies.removeAll();

    if(score > 1000){
      score -= 1000;
      scoreText.text = scoreString + score;
    }

    if(currentLevel > 1){
      currentLevel -= 1;
      levelText.text = 'Level: ' + currentLevel;
    }

    base.revive();
    stateText.visible = false;
    that.createNewEnemy();
  }

  autoUserFire(){
    let shot = bullets.getFirstExists(false);
    shot.reset(base.body.x, base.body.y + 50);
    game.physics.arcade.moveToXY(shot, aimingx, aimingy, 60 * levelBulletSpeed);
    firingTimer = game.time.now + firingRate / levelFireRate;
  }

  userHitEnemy(shot, mob){

    shot.kill();
    mob.kill();

    for(let elem = 0; elem < enemyArray.length; elem++){
      if(!enemyArray[elem].alive){
        enemyArray.splice(elem, 1);
      }
    }

    money += 30 + currentLevel * 2;
    moneyText.text = moneyString + money + '$';

    score += 50;
    scoreText.text = scoreString + score;
    //let explosion = explosions.getFirstExists(false);
    //explosion.reset(mob.body.x, mob.body.y);
    //explosion.play('kaboom', 30, false, true);
  }

  registerPanel(){
    this.router.navigate(['/register']);
  }

  loginPanel(){
    this.router.navigate(['/login']);
  }

}
