import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  //Signal error
  error = signal<string | null>(null);

  //Hämtar serice
  courseService = inject(CourseService);

  //Alla unika ämnen
  allSubjects = computed(() => {
    const subjects = [... new Set(this.courseService.courses().map(course => course.subject))].length;

    return subjects;

  });

  //Anropar loadCourses.
  async ngOnInit() {
    try {
      await this.courseService.loadCourses();
    } catch(error) {
      this.error.set("Statistik kunde inte laddas. Försök igen senare.");
    }

  }

}
