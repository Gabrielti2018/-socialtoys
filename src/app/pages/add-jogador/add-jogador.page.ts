import { Component, OnInit } from '@angular/core';
import { Jogador } from 'src/app/model/jogador'
import { JogadorService } from '../../services/jogador.service';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';




@Component({
  selector: 'app-add-jogador',
  templateUrl: './add-jogador.page.html',
  styleUrls: ['./add-jogador.page.scss'],
})



export class AddJogadorPage implements OnInit {

  protected jogador: Jogador = new Jogador; //modificador de visibilidade "protected" e "private"
  protected id: any = null;
  protected preview: any ;
  


  constructor(
    protected jogadorService: JogadorService,
    protected alertController: AlertController,
    protected activeRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private navCtrl: NavController, private loadingCtrl: LoadingController,
    protected router: Router,
    private camera: Camera,
  
    private platform: Platform


  ) { }

  async ngOnInit() {

    
    await this.platform.ready();
    

    this.id = this.activeRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.jogadorService.get(this.id).subscribe(
        res => {
          this.jogador = res
          this.preview = this.jogador.foto
        },
        //erro => this.id = null
      )
    }

    
  }

  onsubmit(form) {
    if (!this.preview) {
      this.presentAlert("Erro", "Deve inserir a foto do usuário");
    } else {
      this.jogador.foto = this.preview;
      

      if (!this.id) {
        this.jogadorService.save(this.jogador).then(
          res => {
            form.reset();
            this.jogador = new Jogador;
            //console.log("Cadastrado");
            this.presentAlert("Aviso", "Cadastro")
            this.router.navigate(['/']);

          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Não foi possível fazer o cadastro")

          }
        )
      } else {
        this.jogadorService.update(this.jogador, this.id).then(
          res => {
            form.reset();
            this.jogador = new Jogador;
            this.presentAlert("Aviso", "Atualizado!")
            this.router.navigate(['/tabs/listJogador']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Não foi possível atualizar!")


          }
        )
      }
    }
  }

  tirarFoto() {
    const options: CameraOptions = {
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

 
  


  //Alertas ionic
  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });
    await alert.present();


  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

 
}


