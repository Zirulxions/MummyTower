import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';

declare let Phaser;
let mummy;
let game;
let that;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(public toastController: ToastController) {
    game = new Phaser.Game(50, 50, Phaser.AUTO, 'mummy-test',
      { preload: this.preload, create: this.create, update: this.update });
    that = Object.create(this.constructor.prototype);
  }

  preload(){
    game.stage.backgroundColor = "#FFFFFF";//"#4488AA";
    game.load.spritesheet('mummy', 'assets/phaser/metalslug_mummy37x45.png', 37, 45, 18);
  }

  create() {
    mummy = game.add.sprite(10, 10, 'mummy', 5);
    mummy.scale.set(0.80);
    mummy.smoothed = false;
    mummy.animations.add('walk');
    mummy.play('walk', 60, true, false);
  }

  update(){
  }

  ngOnInit() {
  }

  async createUser(){
    var username = (<HTMLInputElement>document.getElementById("username")).value;
    var email = (<HTMLInputElement>document.getElementById("email")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var message;
    if(username.trim() == ""){
      message = "Missing Username Field";
    } else if (email.trim() == ""){
      message = "Missing Email Field";
    } else if (password.trim() == ""){
      message = "Missing Password Field";
    } else {
      message = "Data Found... Username: " + username + " Email: " + email + " Password: " + password;
    };
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  //console.log(username + " " + email + " " + password);
  }

}
