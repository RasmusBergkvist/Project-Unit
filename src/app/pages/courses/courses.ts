import { Component, computed, inject, signal } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../services/schedule.service';
import { SortService } from '../../services/sort.service';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-courses',
  imports: [FormsModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
  providers: [SortService]
})
export class CoursesComponent {
  //Signal error
  error = signal<string | null>(null);
  loading = signal(false);

  //Signals filtrering
  filterText = signal<string>("");
  selectedSubject = signal<string>("");
  selectedLevels = signal<string[]>([]);

  //Signals sortering
  sortBy = signal<"courseCode" | "courseName" | "points" | "subject">("courseCode");
  sortDirection = signal<"asc" | "desc">("asc");

  //Signal pagination
  pageIndex = signal<number>(0);
  pageSize = signal<number>(30);


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

    let courses = this.courseService.courses();


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

  //Filtrerar antal kurser per sidan
  paginationFilter = computed(() => {
    
    //Sidans start- och slutpunkt.
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    //Hämtar kurserna som matchar sidans start- och slutpunkt.
    const coursesOnPage = this.filterAndSortCourses().slice(start, end);

    return coursesOnPage;
  });


  //Hanterar paginatorns sidbyten
  handlePageEvent(event: PageEvent) {
    
    //Uppdatera aktuell sida
    this.pageIndex.set(event.pageIndex);

    //Skrollar till toppen av sidan
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }




  //Lista med alla unika ämnen till select
  allSubjects = computed(() => {
    const subjects = [... new Set(this.courseService.courses().map(course => course.subject))].sort();

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

  //Återgår till första sidan vid ändrat filtreringsvärder
  resetPagination() {
    this.pageIndex.set(0);
  }


  //Anropar loadCourses
  async ngOnInit() {
    //Ändra loading till true för att visa spinner
    this.loading.set(true);
    try {
      await this.courseService.loadCourses();
    } catch(error) {
      this.error.set("Kurserna kunde inte laddas. Försök igen senare.");
    } finally {
      //Sätter loading till false för att dölja spinner
      this.loading.set(false);
    }

  }

}