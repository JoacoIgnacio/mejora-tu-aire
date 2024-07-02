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

    // Cambiar la fuente a Times New Roman
    doc.setFont("times", "normal");

    // Agregar un título
    doc.setFontSize(18);
    doc.text('Ficha del Vehículo', 105, 20, { align: 'center' });
    doc.setFontSize(12);

    // Dibujar una línea debajo del título
    doc.line(10, 25, 200, 25);

    // Información del vehículo
    doc.text(`Numero de OT: ${this.card.N_Ot}`, 10, 45);
    doc.text(`Patente: ${this.card.patente}`, 10, 35);
    doc.text(`ID Cliente: ${this.card.id_Cliente}`, 10, 55);
    doc.text(`Nombre: ${this.card.name}`, 10, 65);
    doc.text(`Fono: ${this.card.fono}`, 10, 75);
    doc.text(`Dirección: ${this.card.direccion}`, 10, 85);
    doc.text(`Año del auto: ${this.card.year_Car}`, 10, 95);
    doc.text(`Kilometraje: ${this.card.km}`, 10, 105);
    doc.text(`Auto: ${this.card.car}`, 10, 115);
    doc.text(`Marca: ${this.card.marca}`, 10, 125);
    doc.text(`Modelo: ${this.card.modelo}`, 10, 135);
    doc.text(`Costo: ${this.card.costo}`, 10, 145);
    doc.text(`Fecha: ${this.card.fecha}`, 10, 155);
    doc.text(`Hora: ${this.card.hora}`, 10, 165);
    doc.text(`Acciones Realizadas: ${this.card.acciones}`, 10, 175);

    // Estado de los servicios
   
    doc.setFontSize(14);
    doc.line(10, 25, 200, 25);
    doc.text('Estado de los servicios:', 10, 185);
    doc.setFontSize(12);
    doc.text(`Filtro de polen cabina: ${this.checkboxValues.filtro ? 'Sí' : 'No'}`, 10, 195);
    doc.text(`Prueba de fugas con gas nitrógeno: ${this.checkboxValues.fugas ? 'Sí' : 'No'}`, 10, 205);
    doc.text(`Vacío de sistema con bomba: ${this.checkboxValues.vacio_bomba ? 'Sí' : 'No'}`, 10, 215);
    doc.text(`Inyección de aceite PAG sintético: ${this.checkboxValues.inyeccion_aceite ? 'Sí' : 'No'}`, 10, 225);
    doc.text(`Inyección de tinta UV: ${this.checkboxValues.inyeccion_tinta ? 'Sí' : 'No'}`, 10, 235);
    doc.text(`Carga de gas R134a: ${this.checkboxValues.carga_gas ? this.checkboxValues.carga_gas_val + ' gr' : 'No'}`, 10, 245);
    doc.text(`Prueba de funcionamiento: ${this.checkboxValues.prueba_funcionamiento ? this.checkboxValues.prueba_funcionamiento_val + ' rpm' : 'No'}`, 10, 255);
    doc.text(`Lecturas de T* de difusores de aire: ${this.checkboxValues.lectura_difusores ? this.checkboxValues.lectura_difusores_val + ' lectura' : 'No'}`, 10, 265);
    doc.text(`Lectura de presiones de sistema - Presión Baja: ${this.checkboxValues.lectura_presiones ? this.checkboxValues.lectura_presiones_baja_val + ' psi' : 'No'}`, 10, 275);
    doc.text(`Lectura de presiones de sistema - Presión Alta: ${this.checkboxValues.lectura_presiones ? this.checkboxValues.lectura_presiones_alta_val + ' psi' : 'No'}`, 10, 285);
    doc.text(`Garantía de 3 meses: ${this.checkboxValues.garantia ? 'Sí' : 'No'}`, 10, 295);

    // Dibujar una línea al final del documento
    doc.line(10, 300, 200, 300);

    // Añadir la nota de creación del informe
    doc.text('Informe creado por Mejora tu Aire', 105, 310, { align: 'center' });

    // Guardar el PDF con un nombre específico
    doc.save(`${this.card.N_Ot}.pdf`);
  }
}
