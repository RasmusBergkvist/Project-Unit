import { Component, computed, inject, signal } from '@angular/core';
import { Course } from '../../models/course.interface';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  imports: [FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class CoursesComponent {

  //Signals
  courses = signal<Course[]>([]);
  error = signal<string | null>(null);
  filterText = signal<string>("");

  //Läser in service
  courseService = inject(CourseService);

//Filtrera kurser
filterCourses = computed(()=> {
  const filter = this.filterText().trim().toLowerCase();
  if(!filter) {
    return this.courses();
  }

  return this.courses().filter(c =>
    c.courseCode.toLowerCase().includes(filter) ||
    c.courseName.toLowerCase().includes(filter)
  )
});


  //Anropar loadCouses
  ngOnInit() {
    this.loadCourses();
  }

  //Laddar kuserna
  async loadCourses() {
    try {
      const response = await this.courseService.getCourses();
      this.courses.set(response)
    } catch(error) {
      console.error(error) 
      this.error.set("Kurserna kunde inte laddas. Försök igen senare")
    }

  }
}
