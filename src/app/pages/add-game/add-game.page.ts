import { Component, OnInit } from '@angular/core';
import { Game } from '../../model/game';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { GameService } from '../../services/game.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';


@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.page.html',

  styleUrls: ['./add-game.page.scss'],
})
export class AddGamePage implements OnInit {
  protected game: Game = new Game;
  protected id: any = null;
  protected preview: any = null;
  

  constructor(
    public alertController: AlertController,
    protected gameService: GameService,
    public loadingController: LoadingController,
    protected router: Router,
    private camera: Camera, 
    protected activatedRoute: ActivatedRoute,
    private platform: Platform,
    private photoLibrary: PhotoLibrary
    
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    

    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.gameService.get(this.id).subscribe(
        res => {
          this.game = res
        },
        erro => this.id = null
      )
    }
  }

  onsubmit(form) {
    // if(!this.preview) {
    //   this.presentAlert("Erro", "Deve cadastrar alguma foto no game");
    // } else {

    // }
    if(this.id){
      
    }
    if (!this.id) {
      this.gameService.save(this.game).then(
        res => {
          //console.log("Cadastrado");
          this.presentLoading();
          this.presentAlert("Cadastrado Sendo Realizado'--' ", "Produto Cadastrado!");
          form.reset();
          this.router.navigate(['/tabs/listGame']);
         
        },
        erro => {
          console.log("Erro: " + erro);
          this.presentAlert("Cadastro Não Realizado, Por favor Realize-o Novamente", "Cadastro Não Realizado, Por favor Realize-o Novamente")
        }
      )
    } else {
      this.gameService.update(this.game, this.id).then(
        res => {
          this.presentLoading();
          this.presentAlert("Cadastro Atualizado", "GG foi IZI WP!");
          form.reset();
          this.router.navigate(['/tabs/listGame']);
        },
        erro => {
          console.log("Erro: " + erro);
          this.presentAlert("Cadastro Não Atualizado", "GG tu se Fudeu")
        }
      )
    }
  }

  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      message: texto,
      buttons: ['Próximo']
    });

    await alert.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Aguarde e confie ',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Carregando, Aguarde e Confie!');
  }
  getImage() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      saveToPhotoAlbum:true
       }
    

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      //this.preview = base64Image;
      //this.game.fotos.push(base64Image);

      if (this.preview == null)
        this.preview = []
      this.preview.push(base64Image);

    }, (err) => {
      // Handle error
    });

    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach(function(libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
    .catch(err => console.log('permissions weren\'t granted'));
  }
  
}



