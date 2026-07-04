import { Component, inject, signal } from '@angular/core';
import { Course } from '../../models/course.interface';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses',
  imports: [],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class CoursesComponent {

  //Signals
  courses = signal<Course[]>([]);
  error = signal<string | null>(null);


  //Läser in service
  courseService = inject(CourseService);

  //Anropar loadCouses
  ngOnInit() {
    this.loadCourses();
  }

  //Laddar kuserna
  async loadCourses() {
    try {
      const response = await this.courseService.getCourses();
      this.courses.set(response)
      console.table(response)
    } catch(error) {
      console.error(error) 
      this.error.set("Kurserna kunde inte laddas. Försök igen senare")
    }

  }
}
