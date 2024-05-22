import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);


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

}