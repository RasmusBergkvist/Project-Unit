import { Injectable, signal } from '@angular/core';
import { Course } from '../models/course.interface';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  //Signals sortering
  sortBy = signal<"courseCode" | "courseName" | "points" | "subject">("courseCode");
  sortDirection = signal<"asc" | "desc">("asc");


  //Metod för att soetera kurser
  sortCourses(courses: Course[]) {

    //Hämtar vilket fält som ska sorteras och i vilken riktning
    const sortBy = this.sortBy();
    const sortDirection = this.sortDirection();

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

  }

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


}
