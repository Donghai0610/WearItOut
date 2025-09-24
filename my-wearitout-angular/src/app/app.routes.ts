import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Login } from './login/logincomponent';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './resgister/register.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'products', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }// Wildcard route for 404 page
];
