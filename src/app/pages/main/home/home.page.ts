import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  ngOnInit() {}

  // ===== Cerrar Sesión  =====
  signOut(){
    this.firebaseSvc.signOut();
  }

  // ===== Redirigir a otra dirección =====
  addCard(){
    this.utilsSvc.routerLink('/main/add-card');
  }

  // ===== Agregar Nueva ficha  =====
  addUpdateFile(){
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'modal-fullscreen'
    });
  }
}
