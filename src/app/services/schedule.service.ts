import { effect, Injectable, signal } from '@angular/core';
import { Course } from '../models/course.interface';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {

  //Laddar schema
  schedule = signal<Course[]>(this.loadSchedule());


  //Spara schema till Local Storage med effect
  private saveSchedule = effect(() => {
    localStorage.setItem("schedule", JSON.stringify(this.schedule()))

  });


  //Kontrollera om kurs finns i ramschemat
  isCourseInSchedule(courseCode: string): boolean {
    //Hämtar nuvarande schema från signalen schedule
    const currentSchedule = this.schedule();

    //Kontroll om kursen finns i arrayen
    const existsInSchedule = currentSchedule.some(c => c.courseCode === courseCode);

    return existsInSchedule;

    }

  //Lägg till kurs i ramschema
  addCourse(course: Course): void {
    //Anropar metoden för att kontrollera om kursen redan har lagts till
    const alreadyExists = this.isCourseInSchedule(course.courseCode)

    //Förhindrar dubletter i arrayen.
    if (alreadyExists) { return; }

    //Uppdaterar singal schedule när ny kurs läggs till. Kopia av array skapas för att inte ändra ordinare array.
    this.schedule.update(currentSchedule => [...currentSchedule, course])

  }

  //Tar bort kurs från schema
  removeCourse(courseCode: string): void {

    //Uppdaterar nuvarande schema
    this.schedule.update(currentSchedule => {

      //Filrterar fram alla kurser utan den som ska tas bort
      const filteredList = currentSchedule.filter(c => c.courseCode !== courseCode);
      return filteredList;
    });
  }

  //Växlar mellan lägg till och ta bort
  toggleCourseStatus(course: Course): void {
    const courseAdded = this.isCourseInSchedule(course.courseCode);

    //Om kursen redan finns tillagd anropas removeCourse, annars körs addCourse.
    courseAdded ? this.removeCourse(course.courseCode) : this.addCourse(course);
  }


  //Ladda schema från Local Storage
  private loadSchedule(): Course[] {
    const data = localStorage.getItem("schedule");
    return data ? JSON.parse(data) : [];
  }


}
