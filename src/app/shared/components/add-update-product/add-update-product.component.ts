import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  form = new FormGroup({
    patente: new FormControl('', [Validators.required, Validators.minLength(4),Validators.maxLength(6), Validators.pattern('[A-Z0-9]{4,7}$')]),
    N_Ot: new FormControl('',[Validators.required,Validators.minLength(1), Validators.pattern('[0-9]{8}')]),
    id_Cliente: new FormControl('',Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    fono: new FormControl('',[Validators.required, Validators.pattern('[0-9]{8}$')]),
    direccion: new FormControl('',[Validators.required, Validators.minLength(4)]),
    year_Car: new FormControl('',[Validators.required, Validators.pattern('[0-9]{4}$')]),
    km: new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$')]),
    car: new FormControl('',[Validators.required,Validators.pattern('^[A-Z]+$')]),
    marca: new FormControl('',[Validators.required,Validators.pattern('^[A-Z]+$')]),
    modelo: new FormControl('',[Validators.required,Validators.pattern('^[A-Z]+$')]),
    image: new FormControl('')
});
  checkboxForm = new FormGroup({
    filtro: new FormControl(false),
    fugas: new FormControl(false),
    vacio_bomba: new FormControl(false),
    inyeccion_aceite: new FormControl(false),
    inyeccion_tinta: new FormControl(false),

  });

onSubmit() {
  console.log(this.checkboxForm.value);
}
firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService);

ngOnInit() {
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

    const loading = await this.utilsSvc.loading();
    await loading.present();
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
}
