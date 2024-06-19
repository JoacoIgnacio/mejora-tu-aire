import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.page.html',
  styleUrls: ['./view-card.page.scss'],
})
export class ViewCardPage implements OnInit {
  card: any;
  checkboxValues: any = {}; // Objeto para almacenar los valores de las checkboxes

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['card']) {
        this.card = JSON.parse(params['card']);
        this.initializeCheckboxValues();
      }
    });
  }

  // Función para inicializar los valores de las checkboxes
  initializeCheckboxValues() {
    // Asigna los valores de las checkboxes al objeto checkboxValues
    this.checkboxValues = {
      filtro: this.card.filtro,
      fugas: this.card.fugas,
      vacio_bomba: this.card.vacio_bomba,
      inyeccion_aceite: this.card.inyeccion_aceite,
      inyeccion_tinta: this.card.inyeccion_tinta,
      carga_gas: this.card.carga_gas,
      carga_gas_val: this.card.carga_gas_val,
      prueba_funcionamiento: this.card.prueba_funcionamiento,
      prueba_funcionamiento_val: this.card.prueba_funcionamiento_val,
      lectura_difusores: this.card.lectura_difusores,
      lectura_difusores_val: this.card.lectura_difusores_val,
      lectura_presiones: this.card.lectura_presiones,
      lectura_presiones_baja_val: this.card.lectura_presiones_baja_val,
      lectura_presiones_alta_val: this.card.lectura_presiones_alta_val,
      garantia: this.card.garantia
    };
  }
}
