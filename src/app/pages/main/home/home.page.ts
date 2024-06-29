import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'firebase/auth';
import { Card } from 'src/app/models/card.model';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);
  alertController = inject(AlertController);

  searchQuery: string = '';
  searchField: string = 'id_Cliente'; // Campo seleccionado para búsqueda (por defecto ID de Cliente)
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
        this.filteredItems = this.cards;
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
    if (query && query.trim() !== '' && this.searchField) {
      this.filteredItems = this.cards.filter(card => 
        String(card[this.searchField]).toLowerCase().includes(query)
      );
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

  // ===== Mostrar alerta de confirmación antes de eliminar ficha =====
  async confirmDelete(card: Card) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta ficha?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.deleteCard(card);
          }
        }
      ]
    });

    await alert.present();
  }

  // ===== Eliminar ficha =====
  async deleteCard(card: Card) {
    let path = `users/${this.user().uid}/cards/${card.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Verificar si la tarjeta tiene una imagen y obtener el path de la imagen
      if (card.image) {
        const imagePath = await this.firebaseSvc.getFilePath(card.image);

        // Eliminar la imagen asociada
        await this.firebaseSvc.deleteFile(imagePath);
      }

      // Eliminar el documento de Firestore
      await this.firebaseSvc.deleteDocument(path);

      // Actualizar la lista de tarjetas filtrando la tarjeta eliminada
      this.cards = this.cards.filter(c => c.id !== card.id);

      this.utilsSvc.presentToast({
        message: 'Producto eliminado con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    } catch (error) {
      console.error('Error deleting card:', error);
      this.utilsSvc.presentToast({
        message: error.message || 'Error al eliminar el producto',
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });

    } finally {
      loading.dismiss();
    }
  }

  // ===== Refrescar la página =====
  refreshPage() {
    this.loadItems();
  }
}
