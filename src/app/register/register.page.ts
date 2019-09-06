import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

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

  username: string = "";
  password: string = "";
  cpassword: string = "";

  constructor(public afAuth: AngularFireAuth, public toastController: ToastController, private screenOrientation: ScreenOrientation) {

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    game = new Phaser.Game(50, 50, Phaser.AUTO, 'mummy-test',
      { preload: this.preload, create: this.create, update: this.update });
    that = Object.create(this.constructor.prototype);
  }

  async register(){
    const { username, password, cpassword } = this;
    if( password !== cpassword ){
      const toast = await this.toastController.create({
        message: "Passwords don't match",
        duration: 3000
      });
      toast.present();
    } else {
      try{
        const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password);
        const toast = await this.toastController.create({
          message: "Successfull: " + res.operationType,
          duration: 3000
        });
        toast.present();
      } catch (err) {
        const toast = await this.toastController.create({
          message: err.message,
          duration: 3000
        });
        toast.present();
      }
    }
  //console.log(username + " " + email + " " + password);
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

}
