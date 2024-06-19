import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  
  {
    path: 'add-card',
    loadChildren: () => import('./add-card/add-card.module').then( m => m.AddCardPageModule)
  },
 
  {
    path: 'delete-card',
    loadChildren: () => import('./delete-card/delete-card.module').then( m => m.DeleteCardPageModule)
  },
  {
    path: 'search-card',
    loadChildren: () => import('./search-card/search-card.module').then( m => m.SearchCardPageModule)
  },
  {
    path: 'view-card',
    loadChildren: () => import('./view-card/view-card.module').then( m => m.ViewCardPageModule)
  },


  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
