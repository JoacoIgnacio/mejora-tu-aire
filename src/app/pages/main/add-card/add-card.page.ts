import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';

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
    fono: new FormControl('', [Validators.pattern('[0-9]{8}$')]),
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
    if (this.card) {
      this.form.patchValue(this.card); // Usar patchValue para cargar datos parciales
      this.checkboxForm.patchValue(this.card); // Igualmente para el formulario de checkbox
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
  }

  // =================== Tomar/Seleccionar Imagen ===================
  async takeImagen() {
    const dataUrl = (await this.utilsSvc.takePicture('Selecciona una imagen')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }
  

  toUpperCase(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  async submit() {
    if (this.form.valid && this.checkboxForm.valid) {
      if (this.card) {
        await this.updateCard();
      } else {
        await this.createProduct();
      }
    }
  }
  

  async createProduct() {
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

  async updateCard() {
    let path = `users/${this.user.uid}/cards/${this.card.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    // Actualizar imagen si ha cambiado
    if (this.form.value.image !== this.card.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.card.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }
  
    // Combinar los valores de form y checkboxForm
    const combinedFormData = {
      ...this.form.value,
      ...this.checkboxForm.value
    };
  
    delete combinedFormData.id;
  
    // Actualizar documento en Firebase
    this.firebaseSvc.updateDocument(path, combinedFormData).then(async res => {
      this.utilsSvc.routerLink("/main/home");
      this.utilsSvc.presentToast({
        message: 'Ficha actualizada con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
  
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
  

  async loadCard(cardId: string) {
    const path = `users/${this.user.uid}/cards/${cardId}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    // Obtener documento de Firebase
    this.firebaseSvc.getDocument(path).then(card => {
      this.card = card;
      this.form.patchValue(card); // Cargar datos al formulario
      this.checkboxForm.patchValue(card); // Cargar datos al formulario de checkbox
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
  

  onSubmit() {
    console.log(this.checkboxForm.value);
  }
}
