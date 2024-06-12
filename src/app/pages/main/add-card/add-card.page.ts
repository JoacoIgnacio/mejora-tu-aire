import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {
  form = new FormGroup({
    patente: new FormControl('', [Validators.required, Validators.minLength(4),Validators.maxLength(6), Validators.pattern('[A-Z0-9]{4,7}$')]),
    N_Ot: new FormControl('',[Validators.required,Validators.minLength(1), Validators.pattern('[0-9]{1,9}')]),
    id_Cliente: new FormControl('',Validators.required),
    name: new FormControl('', [Validators.minLength(4)]),
    fono: new FormControl('',[Validators.pattern('[0-9]{8}$')]),
    direccion: new FormControl('',[Validators.minLength(4)]),
    year_Car: new FormControl('',[ Validators.pattern('[0-9]{4}$')]),
    km: new FormControl('',[Validators.pattern('^[0-9]+$')]),
    car: new FormControl('',),
    marca: new FormControl('',),
    modelo: new FormControl('',),
    image: new FormControl(''),
    acciones: new FormControl(''),
    costo: new FormControl('',[Validators.pattern('[0-9]{8}$')]),
    fecha: new FormControl('',),
    hora: new FormControl('',),
    pago: new FormControl(''),
    documento: new FormControl(''),
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

user= {} as User;

ngOnInit() {
  this.user = this.utilsSvc.getFromLocal('user');

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
async takeImagen(){
  const dataUrl = (await this.utilsSvc.takePicture('Selecciona una imagen')).dataUrl;
  this.form.controls.image.setValue(dataUrl);
}
// In your component class
toUpperCase(controlName: string) {
  const control = this.form.get(controlName);
  if (control) {
    control.setValue(control.value.toUpperCase(), { emitEvent: false });
  }
}
async submit() {
  if(this.form.valid){

    let path = 'users/${this.user.uid}/cards';
    const loading = await this.utilsSvc.loading();
    await loading.present();


    // ===== Subir imagen y obtener la url =====

    let dataUrl = this.form.value.image;
    let imagePath = '${this.user.uid}/${Date.now()}';
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.signUp(this.form.value as User).then(async res =>{
      await this.firebaseSvc.updateUser(this.form.value.name);
      let uid = res.user.uid;


    }).catch(err => {
      console.log(err);
      this.utilsSvc.presentToast({ 
        message: err.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon : 'alert-circle-outline'

      });

    }).finally(() => {
      loading.dismiss();
    });
  }
}
onSubmit() {
  console.log(this.checkboxForm.value);
}
}

