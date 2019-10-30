import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Jogador } from '../model/jogador';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {

  constructor(
    protected fire:AngularFirestore,
    public afAuth: AngularFireAuth
  ) { }

  save(jogador){
    return this.afAuth.auth.createUserWithEmailAndPassword(jogador.email, jogador.pws).then(
      res=>{
        return this.fire.collection("jogadores").doc(res.user.uid).set({
      nome: jogador.nome,
      nickname: jogador.nickname,
      //email: jogador.email,
      //pws: jogador.pws,
      foto: jogador.foto,
      ativo: true
      
      });
    }
  )
}
  getAll (){
    return this.fire.collection("jogadores").snapshotChanges()
    .pipe(
      map(dados => 
        dados.map(d => ({ key: d.payload.doc.id, ...d.payload.doc .data() }))
      )
    )
  }

  get(id){
    return this.fire.collection("jogadores").doc<Jogador>(id).valueChanges();
  }

update(jogador, id){
  return this.fire.collection("jogadores").doc<Jogador>(id).update(jogador);

  }

  remove(jogador){
    return this.fire.collection("jogadores").doc(jogador.key).delete();
  }
}
