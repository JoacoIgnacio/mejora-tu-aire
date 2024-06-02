import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyCardPageRoutingModule } from './modify-card-routing.module';

import { ModifyCardPage } from './modify-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyCardPageRoutingModule
  ],
  declarations: [ModifyCardPage]
})
export class ModifyCardPageModule {}
