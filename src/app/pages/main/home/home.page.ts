import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'firebase/auth';
import { Card } from 'src/app/models/card.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  searchQuery: string = '';
  items: any[] = []; // Asume que los elementos tienen una propiedad 'name'
  filteredItems: any[] = [];

  cards: Card[] = [];
  reloadSub: Subscription;

  ngOnInit() {
    this.loadItems();
    this.reloadSub = this.firebaseSvc.reloadSubject.subscribe(() => {
      this.loadItems();
    });
  }

  ngOnDestroy() {
    this.reloadSub.unsubscribe();
  }

  // ===== Cargar elementos desde Firebase =====
  async loadItems() {
    try {
      // Llama a la función que obtiene las tarjetas del usuario
      await this.getCard();
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
    });
  }

  // ===== Navegación para agregar/editar tarjeta =====
  async editCard(card?: Card) {
    let success = await this.router.navigate(['/main/add-card', { id: card.id }]);
    if (success) {
      this.firebaseSvc.reloadSubject.next(); // Emitir evento de recarga
    }
  }

  // ===== Navegación para ver tarjeta =====
  viewCard(card) {
    this.router.navigate(['/main/view-card'], {
      queryParams: {
        card: JSON.stringify(card)
      }
    });
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
