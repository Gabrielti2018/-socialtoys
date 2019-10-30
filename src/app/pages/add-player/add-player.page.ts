import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/model/player';
import { PlayerService } from 'src/app/services/player.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';



@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
})
export class AddPlayerPage implements OnInit {

  protected player: Player = new Player;
  protected id: any = null;
  protected preview: any ;
  

  constructor(
    protected playerService: PlayerService,
    protected alertController: AlertController,
    protected activedRoute: ActivatedRoute,
    protected router: Router,
    private camera: Camera,
    private platform: Platform
  ) {
  }

  async ngOnInit() {
   
    

    //Pega Id para autilaização dos dados do Player
    this.id = this.activedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.playerService.get(this.id).subscribe(
        res => {
          this.player = res
          this.preview = this.player.foto
        },
        //erro => this.id = null
      )
    }
  }

  onsubmit(form) {
    if (!this.preview) {
      this.presentAlert("Erro", "Deve inserir uma foto do perfil!");
    } else {
      this.player.foto = this.preview;
      
      if (!this.id) {
        this.playerService.save(this.player).then(
          res => {
            form.reset();
            this.player = new Player;
            //  console.log("Cadastrado!");
            this.presentAlert("Aviso", "Cadastrado!")
            this.router.navigate(['/']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Não foi possivel cadastrar!")
          }
        )
      } else {
        this.playerService.update(this.player, this.id).then(
          res => {
            form.reset();
            this.player = new Player;
            this.presentAlert("Aviso", "Atualizado!")
            this.router.navigate(['/tabs/perfilPlayer', this.id]);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Não foi possivel atualizar!")
          }
        )
      }
    }
  }

  tirarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.preview = base64Image;
    }, (err) => {
      // Handle error
    });
  }

  

  //Alerts-------------------
  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

 
}
