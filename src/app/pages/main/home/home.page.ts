import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Router } from '@angular/router';

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
