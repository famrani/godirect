import {SiteTextPipe} from '../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
];

@NgModule({
  imports: [SiteTextPipe,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
