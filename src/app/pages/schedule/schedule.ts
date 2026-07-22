import { Component, computed, inject } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { RouterLink } from '@angular/router';
import { SortService } from '../../services/sort.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  imports: [RouterLink, FormsModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
  providers: [SortService]
})
export class Schedule {

  //Läser in services
  scheduleService = inject(ScheduleService);
  sortService = inject(SortService);

  //Hämtar sparade kurser från ScheduleService och sorterar dem via SortService
  mySchedule = computed(() => {
    const addedCourses = this.scheduleService.schedule();
    const sortedCourses = this.sortService.sortCourses(addedCourses);

    return sortedCourses;
  });

  //Lista med alla unika ämnen till schemat.
  mySubjects = computed(() => {
    const subjects = [... new Set(this.mySchedule().map(course => course.subject))].sort();

    return subjects;
  });


  //Antal kurser i ramschemat.
  totalCourses = computed(() => this.mySchedule().length);

  //Totalpoängen i ramschemat.
  totalPoints = computed(() => this.mySchedule().reduce((total, course) => total + course.points, 0));



}
