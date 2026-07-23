import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Course } from '../models/course.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private url: string = "/miun_courses.json"

  http = inject(HttpClient);

  //Signals
  courses = signal<Course[]>([]);


  //Hämtar kurserna 
  async getCourses(): Promise<Course[]> {
    const courses = this.http.get<Course[]>(this.url)
    return await firstValueFrom(courses);
  }

  //Laddar kurserna
  async loadCourses() {
    const response = await this.getCourses();
    this.courses.set(response);

  }

}
