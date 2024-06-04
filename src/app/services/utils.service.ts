import { Injectable, inject } from '@angular/core';
import { LoadingController, ModalController, ModalOptions, ToastOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);


  

 async takePicture(promptLabelHeader: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto:'Selecciona una imagen',
    promptLabelPicture:'Toma una foto',


  });
};

// ===== Loading =====  
loading(){
  return this.loadingCtrl.create({ spinner: 'crescent' });
}

// ===== Toast =====
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
// ===== Enrutar a cualquier pagina disponible =====
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

// ===== Guardar un elemento en localstorage =====
  saveInLocalStorage(key: string, value: any){
   return localStorage.setItem(key, JSON.stringify(value));
  }

// ===== Obtener un elemento de localstorage =====
  getFromLocal(key: string){
    return JSON.parse(localStorage.getItem(key));
  }
// ===== Modal =====
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data)return data;
  }
  
  dissmissModal(data?: any){
    this.modalCtrl.dismiss(data);
  }
 
}