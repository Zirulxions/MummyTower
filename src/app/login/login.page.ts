import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

declare let Phaser;
let explosion;
let game;
let that;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public toastController: ToastController, private screenOrientation: ScreenOrientation) {

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    game = new Phaser.Game(50, 50, Phaser.AUTO, 'kaboom-test',
      { preload: this.preload, create: this.create, update: this.update });
    that = Object.create(this.constructor.prototype);
  }

  preload(){
    game.stage.backgroundColor = "#FFFFFF";
    game.load.spritesheet('kaboom', 'assets/phaser/explode.png', 128, 128);
  }

  create(){
    explosion = game.add.sprite(10, 10, 'kaboom', 5);
    explosion.scale.set(0.3);
    explosion.smoothed = false;
    explosion.animations.add('kaboom');
    explosion.play('kaboom',  20, true, false);
  }

  update(){
  }

  ngOnInit() {
  }

  async logIn(){
    var username = (<HTMLInputElement>document.getElementById("username")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var message;
    if(username.trim() == ""){
      message = "Missing Username Field";
    } else if (password.trim() == ""){
      message = "Missing Password Field";
    } else {
      message = "Data Found... Username: " + username + " Password: " + password;
    }
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
