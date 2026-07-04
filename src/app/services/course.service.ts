import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Course } from '../models/course.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private url: string = "/miun_courses.json"

  http = inject(HttpClient);

  //Hämtar kurserna 
  async getCourses(): Promise<Course[]> {
    const courses = this.http.get<Course[]>(this.url)
    return firstValueFrom(courses);
  }
}
