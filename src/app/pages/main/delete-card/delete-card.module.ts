import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteCardPageRoutingModule } from './delete-card-routing.module';

import { DeleteCardPage } from './delete-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteCardPageRoutingModule
  ],
  declarations: [DeleteCardPage]
})
export class DeleteCardPageModule {}
