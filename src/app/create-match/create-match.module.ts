import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateMatchComponent } from './create-match.page';

import { CreateMatchPageRoutingModule } from './create-match-routing.module';
import { MatchPropertiesComponent } from './match-properties/match-properties.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CreateMatchPageRoutingModule
  ],
  declarations: [CreateMatchComponent, MatchPropertiesComponent]
})
export class CreateMatchModule { }
