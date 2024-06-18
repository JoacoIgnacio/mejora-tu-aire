import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
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
      // Llama a la función que obtiene las tarjetas del usuario
      await this.getCard();
      //this.items = await this.firebaseSvc.getCollection('items'); // Ajusta 'items' al nombre de tu colección
      this.filteredItems = this.cards; // Inicialmente muestra todos los elementos
    } catch (error) {
      console.error('Error al cargar los elementos:', error);
    }
  }

  // ===== Obtener tarjetas del usuario =====
  async getCard() {
    let path = `users/${this.user().uid}/cards`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.cards = res;
        sub.unsubscribe();
      }
    })
  }

  // ===== Navegación para agregar/editar tarjeta =====
  editCard(card?: Card) {
    this.router.navigate(['/main/add-card', { card }]);
  }

  // ===== Filtrar elementos =====
  filterItems(event: any) {
    const query = event.target.value.toLowerCase();
    if (query && query.trim() !== '') {
      this.filteredItems = this.cards.filter(card => card.name.toLowerCase().includes(query));
    } else {
      this.filteredItems = this.cards; // Si no hay consulta, muestra todos los elementos
    }
  }

  // ===== Cerrar Sesión =====
  signOut() {
    this.firebaseSvc.signOut();
  }

  // ===== Obtener usuario actual =====
  user(): User {
    return this.utilsSvc.getFromLocal('user');
  }
}
