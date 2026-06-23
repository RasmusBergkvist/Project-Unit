import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Courses } from './pages/courses/courses';
import { Schedule } from './pages/schedule/schedule';

export const routes: Routes = [
    {path:"", component: Home},
    {path: "courses", component: Courses},
    {path: "kurser", component: Courses},
    {path: "schedule", component: Schedule},
    {path: "schema", component: Schedule},
    {path: "ramschema", component: Schedule},
    {path:"**", redirectTo: "", pathMatch:"full"}
];
