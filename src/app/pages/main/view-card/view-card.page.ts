import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';

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

  // Función para descargar la ficha como PDF
  downloadPDF() {
    const doc = new jsPDF();

    doc.text('Ficha del Vehículo', 10, 10);
    doc.text(`Patente: ${this.card.patente}`, 10, 20);
    doc.text(`Numero de OT: ${this.card.N_Ot}`, 10, 30);
    doc.text(`ID Cliente: ${this.card.id_Cliente}`, 10, 40);
    doc.text(`Nombre: ${this.card.name}`, 10, 50);
    doc.text(`Fono: ${this.card.fono}`, 10, 60);
    doc.text(`Dirección: ${this.card.direccion}`, 10, 70);
    doc.text(`Año del auto: ${this.card.year_Car}`, 10, 80);
    doc.text(`Kilometraje: ${this.card.km}`, 10, 90);
    doc.text(`Auto: ${this.card.car}`, 10, 100);
    doc.text(`Marca: ${this.card.marca}`, 10, 110);
    doc.text(`Modelo: ${this.card.modelo}`, 10, 120);
    doc.text(`Costo: ${this.card.costo}`, 10, 130);
    doc.text(`Fecha: ${this.card.fecha}`, 10, 140);
    doc.text(`Hora: ${this.card.hora}`, 10, 150);
    doc.text(`Acciones Realizadas: ${this.card.acciones}`, 10, 160);
    doc.text(`Filtro de polen cabina: ${this.checkboxValues.filtro ? 'Sí' : 'No'}`, 10, 180);
    doc.text(`Prueba de fugas con gas nitrógeno: ${this.checkboxValues.fugas ? 'Sí' : 'No'}`, 10, 190);
    doc.text(`Vacío de sistema con bomba: ${this.checkboxValues.vacio_bomba ? 'Sí' : 'No'}`, 10, 200);
    doc.text(`Inyección de aceite PAG sintético: ${this.checkboxValues.inyeccion_aceite ? 'Sí' : 'No'}`, 10, 210);
    doc.text(`Inyección de tinta UV: ${this.checkboxValues.inyeccion_tinta ? 'Sí' : 'No'}`, 10, 220);
    doc.text(`Carga de gas R134a: ${this.checkboxValues.carga_gas ? this.checkboxValues.carga_gas_val + ' gr' : 'No'}`, 10, 230);
    doc.text(`Prueba de funcionamiento: ${this.checkboxValues.prueba_funcionamiento ? this.checkboxValues.prueba_funcionamiento_val + ' rpm' : 'No'}`, 10, 240);
    doc.text(`Lecturas de T* de difusores de aire: ${this.checkboxValues.lectura_difusores ? this.checkboxValues.lectura_difusores_val + ' lectura' : 'No'}`, 10, 250);
    doc.text(`Lectura de presiones de sistema - Presión Baja: ${this.checkboxValues.lectura_presiones ? this.checkboxValues.lectura_presiones_baja_val + ' psi' : 'No'}`, 10, 260);
    doc.text(`Lectura de presiones de sistema - Presión Alta: ${this.checkboxValues.lectura_presiones ? this.checkboxValues.lectura_presiones_alta_val + ' psi' : 'No'}`, 10, 270);
    doc.text(`Garantía de 3 meses: ${this.checkboxValues.garantia ? 'Sí' : 'No'}`, 10, 280);

    doc.save(`${this.card.N_Ot}.pdf`);
  }
}
