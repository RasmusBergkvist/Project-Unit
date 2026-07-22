import { Component, computed, inject, signal } from '@angular/core';
import { Course } from '../../models/course.interface';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../services/schedule.service';
import { SortService } from '../../services/sort.service';

@Component({
  selector: 'app-courses',
  imports: [FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
  providers: [SortService]
})
export class CoursesComponent {

  //Signals
  courses = signal<Course[]>([]);
  error = signal<string | null>(null);

  //Signals filtrering
  filterText = signal<string>("");
  selectedSubject = signal<string>("");
  selectedLevels = signal<string[]>([]);

  //Signals sortering
  sortBy = signal<"courseCode" | "courseName" | "points" | "subject">("courseCode");
  sortDirection = signal<"asc" | "desc">("asc");


  //Läser in services
  courseService = inject(CourseService);
  scheduleService = inject(ScheduleService);
  sortService = inject(SortService);

  
  //Filtrerar kurser baserat på söktext, valt ämne och nivå
  filterAndSortCourses = computed(() => {

    //Hämtar söktext
    const filter = this.filterText().trim().toLowerCase();

    //Hämtar valt ämne
    const subject = this.selectedSubject();

    //Hämtar valda nivåer
    const levels = this.selectedLevels();

    let courses = this.courses();


    //Filtrering efter kurskod och kursnamn
    if (filter) {
      courses = courses.filter(c =>
        c.courseCode.toLowerCase().includes(filter) ||
        c.courseName.toLowerCase().includes(filter)
      );
    }

    //Filtrering efter ämne
    if (subject) {
      courses = courses.filter(c =>
        c.subject === subject
      );
    }

    //Filtrering efter nivå
    if (levels.length > 0) {
      courses = courses.filter(c =>
        levels.includes(c.level)
      );
    }

    //Hämtar sorterade kurser från service
    const sortedCourses = this.sortService.sortCourses(courses);

    //Retunerar arrayen med de sorterade kurserna
    return sortedCourses;

  });

  //Lista med alla unika ämnen till select
  allSubjects = computed(() => {
    const subjects = [... new Set(this.courses().map(course => course.subject))].sort();

    return subjects;

  });



  //Ändrar valda nivåer
  changeLevels(level: string) {
    //Hämtar valda nivåer
    const levels = this.selectedLevels();

    if (levels.includes(level)) {
      //Tar bort vald nivå
      this.selectedLevels.set(
        levels.filter(l => l !== level)
      );
    } else {
      //Lägger till vald nivå
      this.selectedLevels.set([...levels, level]);
    }
  }




  //Anropar loadCourses
  ngOnInit() {
    this.loadCourses();

  }

  //Laddar kurserna
  async loadCourses() {
    try {
      const response = await this.courseService.getCourses();
      this.courses.set(response);
    } catch (error) {
      console.error(error)
      this.error.set("Kurserna kunde inte laddas. Försök igen senare")
    }

  }


}