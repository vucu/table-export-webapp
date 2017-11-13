import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import {HomeComponent} from "./pages/home/home.component";
import {TableComponent} from "./pages/table/table.component";

// Routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'table',
    component: TableComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
