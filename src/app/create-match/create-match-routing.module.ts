import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMatchComponent } from './create-match.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMatchComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateMatchPageRoutingModule {}
