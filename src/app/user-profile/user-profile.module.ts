import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile.page';

import { Tab3PageRoutingModule } from './user-profile-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: UserProfileComponent }]),
    Tab3PageRoutingModule,
  ],
  declarations: [UserProfileComponent]
})
export class UserProfileModule {}
