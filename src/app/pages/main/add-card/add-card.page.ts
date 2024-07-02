import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {
  form = new FormGroup({
    id: new FormControl(''),
    patente: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(6), Validators.pattern('[A-Z0-9]{4,7}$')]),
    N_Ot: new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern('[0-9]{1,9}')]),
    id_Cliente: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.minLength(4)]),
    fono: new FormControl('', [Validators.pattern('[0-9]{9}$')]),
    direccion: new FormControl('', [Validators.minLength(4)]),
    year_Car: new FormControl('', [Validators.pattern('[0-9]{4}$')]),
    km: new FormControl('', [Validators.pattern('^[0-9]+$')]),
    car: new FormControl(''),
    marca: new FormControl(''),
    modelo: new FormControl(''),
    image: new FormControl(''),
    acciones: new FormControl(''),
    costo: new FormControl('', [Validators.pattern('[0-9]{1,10}$')]),
    fecha: new FormControl(''),
    hora: new FormControl(''),
  });

  checkboxForm = new FormGroup({
    filtro: new FormControl(false),
    fugas: new FormControl(false),
    vacio_bomba: new FormControl(false),
    inyeccion_aceite: new FormControl(false),
    inyeccion_tinta: new FormControl(false),
    carga_gas: new FormControl(false),
    carga_gas_val: new FormControl({ value: '', disabled: true }, Validators.required),
    prueba_funcionamiento: new FormControl(false),
    prueba_funcionamiento_val: new FormControl({ value: '', disabled: true }, Validators.required),
    lectura_difusores: new FormControl(false),
    lectura_difusores_val: new FormControl({ value: '', disabled: true }, Validators.required),
    lectura_presiones: new FormControl(false),
    lectura_presiones_baja_val: new FormControl({ value: '', disabled: true }, Validators.required),
    lectura_presiones_alta_val: new FormControl({ value: '', disabled: true }, Validators.required),
    garantia: new FormControl(false),
    pago_debito: new FormControl(false),
    pago_efectivo: new FormControl(false),
    pago_transferencia: new FormControl(false),
    boleta: new FormControl(false),
    factura: new FormControl(false),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  route = inject(ActivatedRoute);

  user = {} as User;
  card: any;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocal('user');
   
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.loadCard(cardId); // Cargar la ficha si hay un ID
    }
  
    this.checkboxForm.get('carga_gas')?.valueChanges.subscribe(value => {
      const control = this.checkboxForm.get('carga_gas_val');
      if (value) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
  
    this.checkboxForm.get('prueba_funcionamiento')?.valueChanges.subscribe(value => {
      const control = this.checkboxForm.get('prueba_funcionamiento_val');
      if (value) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
  
    this.checkboxForm.get('lectura_difusores')?.valueChanges.subscribe(value => {
      const control = this.checkboxForm.get('lectura_difusores_val');
      if (value) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
  
    this.checkboxForm.get('lectura_presiones')?.valueChanges.subscribe(value => {
      const controlBaja = this.checkboxForm.get('lectura_presiones_baja_val');
      const controlAlta = this.checkboxForm.get('lectura_presiones_alta_val');
      if (value) {
        controlBaja?.enable();
        controlAlta?.enable();
      } else {
        controlBaja?.disable();
        controlAlta?.disable();
      }
    });
  
    // Inicializar valores por defecto para los campos con valores deshabilitados
    this.initializeCheckboxDefaults();
  }

  // =================== Tomar/Seleccionar Imagen ===================
  async takeImagen() {
    const dataUrl = (await this.utilsSvc.takePicture('Selecciona una imagen')).dataUrl;

    // Reducir el tamaño de la imagen antes de subirla
    const resizedDataUrl = await this.resizeImage(dataUrl, 800, 800);
    this.form.controls.image.setValue(resizedDataUrl);
  }

  async resizeImage(dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height *= maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width *= maxHeight / height));
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }

  toUpperCase(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  async submit() {
    if (this.form.valid && this.checkboxForm.valid) {
      if (this.card && this.card.id) {
        await this.updateCard();
      } else {
        await this.createProduct();
      }
    }
  }

  private async checkIfOtExists(ot: number): Promise<boolean> {
    const path = `users/${this.user.uid}/cards`;
    const querySnapshot = await this.firebaseSvc.getCollectionData(path).pipe(first()).toPromise();
    return querySnapshot.some((card: Card) => card.N_Ot === ot);
  }

  async createProduct() {
    const ot = Number(this.form.value.N_Ot); // Convertir el valor de N_Ot a número
    const otExists = await this.checkIfOtExists(ot);

    if (otExists) {
      this.utilsSvc.presentToast({
        message: 'El número de OT ya existe. Por favor, elija un número diferente.',
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
      return;
    }

    let path = `users/${this.user.uid}/cards`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imageUrl = '';

    // ===== Subir imagen y obtener la url si existe una imagen =====
    let dataUrl = this.form.value.image;
    if (dataUrl) {
      let imagePath = `${this.user.uid}/${Date.now()}`;
      imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    }
    this.form.controls.image.setValue(imageUrl);

    // Combinar los valores de form y checkboxForm
    const combinedFormData = {
      ...this.form.value,
      ...this.checkboxForm.value
    };

    delete combinedFormData.id;

    this.firebaseSvc.addDocument(path, combinedFormData).then(async res => {
      this.utilsSvc.routerLink("/main/home");
      this.utilsSvc.presentToast({
        message: 'Ficha creada con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

      // Reiniciar el formulario después de la creación exitosa
      this.form.reset();
      this.checkboxForm.reset();
      this.initializeCheckboxDefaults();

    }).catch(err => {
      console.log(err);
      this.utilsSvc.presentToast({
        message: err.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });

    }).finally(() => {
      loading.dismiss();
    });
  }

  // Reiniciar valores por defecto para los campos con valores deshabilitados
  initializeCheckboxDefaults() {
    this.checkboxForm.get('carga_gas_val')?.disable();
    this.checkboxForm.get('prueba_funcionamiento_val')?.disable();
    this.checkboxForm.get('lectura_difusores_val')?.disable();
    this.checkboxForm.get('lectura_presiones_baja_val')?.disable();
    this.checkboxForm.get('lectura_presiones_alta_val')?.disable();
  }

  private async updateCard() {
    if (!this.card || !this.card.id) {
      console.error('Card ID is undefined');
      this.utilsSvc.presentToast({
        message: 'No se pudo encontrar la ficha para actualizar',
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }
  
    const path = `users/${this.user.uid}/cards/${this.card.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      if (this.form.value.image !== this.card.image) {
        let imagePath = '';
        if (this.card.image) {
          // Obtener el path de la imagen actual
          imagePath = await this.firebaseSvc.getFilePath(this.card.image);
        } else {
          // Crear un nuevo path para la imagen
          imagePath = `${this.user.uid}/${Date.now()}`;
        }
        
        // Subir la nueva imagen y obtener su URL
        const imageUrl = await this.firebaseSvc.uploadImage(imagePath, this.form.value.image);
        
        // Actualizar el valor de la imagen en el formulario
        this.form.controls.image.setValue(imageUrl);
      }
  
      const combinedFormData = {
        ...this.form.value,
        ...this.checkboxForm.value,
      };
  
      delete combinedFormData.id;
  
      await this.firebaseSvc.updateDocument(path, combinedFormData);
  
      this.utilsSvc.routerLink("/main/home");
      this.utilsSvc.presentToast({
        message: 'Ficha actualizada con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error updating card:', error);
      this.utilsSvc.presentToast({
        message: error.message || 'Error al actualizar la ficha',
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  private async loadCard(cardId: string) {
    const path = `users/${this.user.uid}/cards/${cardId}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.getDocument(path)
      .then(card => {
        this.card = { id: cardId, ...card }; // Asegúrate de que la tarjeta tenga el ID
        this.form.patchValue(card);
        this.checkboxForm.patchValue(card);
      })
      .catch(err => {
        console.error(err);
        this.utilsSvc.presentToast({
          message: err.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  onSubmit() {
    console.log(this.checkboxForm.value);
  }
}
