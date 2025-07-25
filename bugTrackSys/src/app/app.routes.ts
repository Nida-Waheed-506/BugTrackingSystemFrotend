import { Routes } from "@angular/router";
import { HomePage } from "./home-page/home-page";
import { Signup } from "./signup/signup";
import { Login } from "./login/login";
import { PageNotFound } from "./page-not-found/page-not-found";

// +++++++++++++++++++++++++++ imports ends ++++++++++++++++++++++++++++++

export const routes: Routes = [
  { path: "", component: HomePage },
  { path: "signup", component: Signup },
  { path: "login", component: Login },
  { path: "**", component: PageNotFound },
];
