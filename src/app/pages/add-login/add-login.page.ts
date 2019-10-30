import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MensagemService } from '../../services/mensagem.service';
import { auth } from 'firebase/app';
import { Router } from '@angular/router'
@Component({
  selector: 'app-add-login',
  templateUrl: './add-login.page.html',
  styleUrls: ['./add-login.page.scss'],
})
export class AddLoginPage implements OnInit {

  protected email:string = "";
  protected pws:string = "";

  constructor(
    public afAuth: AngularFireAuth,
    protected msg: MensagemService,
    protected router: Router
  ) {}

  ngOnInit() {
  }
  
onsubmit(form){
  this.msg.presentLoading();
  this.login();
}

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.pws).then(
      res=>{
        console.log(res.user);
        this.msg.dismissLoading();
      },
      erro => {
        console.log("Erro: " + erro);
        this.msg.presentAlert("erro", "email ou senha incorreto")
      }
    ).catch(erro=>{
      console.log("Erro no sistema " + erro)
    })
  }

  logout() {
    this.afAuth.auth.signOut();
  }

loginGoogle(){
  this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(
    res=>{
      this.router.navigate(['/'])
    },
    erro=>{
      console.log("Erro: ", erro);
      this.msg.presentAlert("Erro", "login invalido");
      }
    )
  }
}