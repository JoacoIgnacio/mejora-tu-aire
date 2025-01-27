import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchCardPage } from './search-card.page';

const routes: Routes = [
  {
    path: '',
    component: SearchCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchCardPageRoutingModule {}
