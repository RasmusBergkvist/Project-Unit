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

  //Signals filtrering
  filterText = signal<string>("");
  selectedSubject = signal<string>("");
  selectedLevels = signal<string[]>([]);

  //Signals sortering
  sortBy = signal<"courseCode" | "courseName" | "points" | "subject">("courseCode");
  sortDirection = signal<"asc" | "desc">("asc");


  //Läser in service
  courseService = inject(CourseService);



  //Filtrerar kurser baserat på söktext, valt ämne och nivå
  filterAndSortCourses = computed(() => {

    //Hämtar söktext
    const filter = this.filterText().trim().toLowerCase();

    //Hämtar valt ämne
    const subject = this.selectedSubject();

    //Hämtar valda nivåer
    const levels = this.selectedLevels();


    let courses = this.courses();

    //Hämtar vilket fält som ska sorteras och i vilken riktning
    const sortBy = this.sortBy();
    const sortDirection = this.sortDirection();

    //Filtrering på kurskod och kursnamn
    if (filter) {
      courses = courses.filter(c =>
        c.courseCode.toLowerCase().includes(filter) ||
        c.courseName.toLowerCase().includes(filter)
      );
    }

    //Filtrering på ämne
    if (subject) {
      courses = courses.filter(c =>
        c.subject === subject
      );
    }

    //Filtrering på nivå
    if (levels.length > 0) {
      courses = courses.filter(c =>
        levels.includes(c.level)
      );
    }

    //Skapar kopia av kurserna till sorteringen
    const sortedCourses = [...courses];

    //Sorterar kurserna efter valt fält
    sortedCourses.sort((a, b) => {

      //Sortering efter tal
      if (sortBy === "points") {
        return sortDirection === "asc"
          ? a.points - b.points : b.points - a.points
      }


      //Sortering efter strängar
      const sortA = a[sortBy];
      const sortB = b[sortBy];

      //Jämför kurserna och sorterar i fallande eller stigande ordning.
      return sortDirection === "asc"
        ? sortA.localeCompare(sortB) : sortB.localeCompare(sortA);

    });

    //Returnerar de sorterade kurserna
    return sortedCourses;
  });

  //Lista med alla unika ämnen till select
  allSubjects = computed(() => {
    const subjects = [... new Set(this.courses().map(course => course.subject))].sort();

    return subjects;

  });


  //Ändrar sorteringsfält och sorteringsordning
  changeSortOrder(sortField: "courseCode" | "courseName" | "points" | "subject") {
    if (this.sortBy() === sortField) {
      //Uppdaterar sorteringen och växlar mellan stigande och fallande ordning
      this.sortDirection.update(sortOrder => sortOrder === "asc" ? "desc" : "asc");
    } else {
      //Byter sorteringsfält
      this.sortBy.set(sortField);
      //Återställer sortering till stigande ordning
      this.sortDirection.set("asc")
    }

  }

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