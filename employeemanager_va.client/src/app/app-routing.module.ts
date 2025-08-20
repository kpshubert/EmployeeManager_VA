import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/Views/home/home.component'
import { EmployeeFormComponent } from '../app/Views/EmployeeForm/employee-form.component'
import { DepartmentFormComponent } from '../app/Views/DepartmentForm/department-form.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'manageemployees', component: EmployeeFormComponent },
  { path: 'managedepartments', component: DepartmentFormComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
