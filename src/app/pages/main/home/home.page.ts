import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  searchQuery: string = '';
  items: any[] = []; // Asume que los elementos tienen una propiedad 'name'
  filteredItems: any[] = [];

  cards: Card[] = [];
  ngOnInit() {
    this.loadItems();
  }

  // ===== Cargar elementos desde Firebase =====
  async loadItems() {
    try {
    //this.items = await this.firebaseSvc.getCollection('items'); // Ajusta 'items' al nombre de tu colección
      this.filteredItems = this.items; // Inicialmente muestra todos los elementos
    } catch (error) {
      console.error('Error al cargar los elementos:', error);
    }
  }
  user(): User{
    return this.utilsSvc.getFromLocal('user');
  }
ionViewWillEnter(){
  this.getCard();
}

editarCard(card: any) {
  console.log('Editar card:', card);
  // Implementa la lógica para editar la tarjeta aquí
}

eliminarCard(card: any) {
  console.log('Eliminar card:', card);
  // Implementa la lógica para eliminar la tarjeta aquí
}
  // ===== Ver Detalles de la ficha =====
  getCard(){
    let path = `users/${this.user().uid}/cards`
    
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cards = res;
        sub.unsubscribe();
      }
    })
  }
  // ===== Cerrar Sesión =====
  signOut() {
    this.firebaseSvc.signOut();
  }

  // ===== Agregar Nueva ficha =====
  addUpdateFile() {
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'modal-fullscreen'
    });
  }

  // ===== Filtrar elementos =====
  filterItems(event: any) {
    const query = event.target.value.toLowerCase();
    if (query && query.trim() !== '') {
      this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(query));
    } else {
      this.filteredItems = this.items; // Si no hay consulta, muestra todos los elementos
    }
  }
}
