import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService } from '../services/guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule), canActivate: [AuthGuardService]
      },
      {
        path: 'tab2',
        loadChildren: () => import('../create-match/create-match.module').then(m => m.CreateMatchModule), canActivate: [AuthGuardService]
      },
      {
        path: 'tab3',
        loadChildren: () => import('../user-profile/user-profile.module').then(m => m.UserProfileModule), canActivate: [AuthGuardService]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full', canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
