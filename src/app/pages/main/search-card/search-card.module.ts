import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchCardPageRoutingModule } from './search-card-routing.module';

import { SearchCardPage } from './search-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchCardPageRoutingModule
  ],
  declarations: [SearchCardPage]
})
export class SearchCardPageModule {}
