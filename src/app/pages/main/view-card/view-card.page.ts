import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.page.html',
  styleUrls: ['./view-card.page.scss'],
})
export class ViewCardPage implements OnInit {
  card: any;
  checkboxValues: any = {}; // Objeto para almacenar los valores de las checkboxes

  constructor(private route: ActivatedRoute) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

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

  downloadPDF() {
    const docDefinition = {
      content: [
        { text: 'Ficha del Auto', style: 'header' },
        { text: new Date().toLocaleString(), alignment: 'right' },

        { text: 'Información del Cliente', style: 'subheader' },
        {
          columns: [
            [
              { text: `Patente: ${this.card.patente}` },
              { text: `Número de OT: ${this.card.N_Ot}` },
              { text: `ID Cliente: ${this.card.id_Cliente}` },
              { text: `Nombre: ${this.card.name}` },
              { text: `Fono: ${this.card.fono}` },
              { text: `Dirección: ${this.card.direccion}` }
            ],
            [
              { text: `Año del auto: ${this.card.year_Car}` },
              { text: `Kilometraje: ${this.card.km}` },
              { text: `Auto: ${this.card.car}` },
              { text: `Marca: ${this.card.marca}` },
              { text: `Modelo: ${this.card.modelo}` }
            ]
          ]
        },

        { text: 'Información del Servicio', style: 'subheader' },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Filtro de polen cabina', bold: true },
                { text: this.checkboxValues.filtro ? 'Sí' : 'No' },
                { text: 'Prueba de fugas con gas nitrógeno', bold: true },
                { text: this.checkboxValues.fugas ? 'Sí' : 'No' }
              ],
              [
                { text: 'Vacío de sistema con bomba', bold: true },
                { text: this.checkboxValues.vacio_bomba ? 'Sí' : 'No' },
                { text: 'Inyección de aceite PAG sintético', bold: true },
                { text: this.checkboxValues.inyeccion_aceite ? 'Sí' : 'No' }
              ],
              [
                { text: 'Inyección de tinta UV', bold: true },
                { text: this.checkboxValues.inyeccion_tinta ? 'Sí' : 'No' },
                { text: `Carga de gas R134a: ${this.card.carga_gas_val} gr`, bold: true },
                { text: this.checkboxValues.carga_gas ? 'Sí' : 'No' }
              ],
              [
                { text: `Prueba de funcionamiento a: ${this.card.prueba_funcionamiento_val} rpm`, bold: true },
                { text: this.checkboxValues.prueba_funcionamiento ? 'Sí' : 'No' },
                { text: `Lecturas de T* de difusores de aire: ${this.card.lectura_difusores_val}`, bold: true },
                { text: this.checkboxValues.lectura_difusores ? 'Sí' : 'No' }
              ],
              [
                { text: `Lectura de presiones de sistema - Presión Baja: ${this.card.lectura_presiones_baja_val} psi`, bold: true },
                { text: this.checkboxValues.lectura_presiones ? 'Sí' : 'No' },
                { text: `Presión Alta: ${this.card.lectura_presiones_alta_val} psi`, bold: true },
                { text: this.checkboxValues.lectura_presiones ? 'Sí' : 'No' }
              ],
              [
                { text: 'Garantía de 3 meses', bold: true },
                { text: this.checkboxValues.garantia ? 'Sí' : 'No' }
              ]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    };

    pdfMake.createPdf(docDefinition).download(`Ficha_${this.card.N_Ot}.pdf`);
  }
}
