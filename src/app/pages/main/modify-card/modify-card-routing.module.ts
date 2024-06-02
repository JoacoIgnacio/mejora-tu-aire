import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyCardPage } from './modify-card.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyCardPageRoutingModule {}
