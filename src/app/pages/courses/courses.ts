import { Component, computed, inject, signal } from '@angular/core';
import { Course } from '../../models/course.interface';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from "../../../../node_modules/@angular/common/types/_common_module-chunk";

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
  selectedSubject = signal<string>("");

  //Läser in service
  courseService = inject(CourseService);

//Lista med alla unika ämnen till select
allSubjects = computed(() =>{
  const subjects = [... new Set(this.courses().map(course => course.subject))].sort();

  return subjects;

})

//Filtrerar kurser baserat på söktext och valt ämne
filterCourses = computed(()=> {

  //Hämtar söktext
  const filter = this.filterText().trim().toLowerCase();
  
  //Hämtar valt ämne
  const subject = this.selectedSubject();
  let courses = this.courses();

    //Filtrering på kurskod och kursnamn
    if (filter) {
      courses = courses.filter(c =>
        c.courseCode.toLowerCase().includes(filter) ||
        c.courseName.toLowerCase().includes(filter)
      );
    }

    //Filtrering på ämne
    if(subject) {
      courses = courses.filter(c =>
        c.subject === subject
      );
    }

    return courses;
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
