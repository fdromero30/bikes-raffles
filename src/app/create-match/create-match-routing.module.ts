import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMatchComponent } from './create-match.page';
import { MatchPropertiesComponent } from './match-properties/match-properties.component';

const routes: Routes = [
  {
    path: '',
    component: CreateMatchComponent,
  },
  {
    path: 'match-properties',
    component: MatchPropertiesComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateMatchPageRoutingModule { }
