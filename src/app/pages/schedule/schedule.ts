import { Component, computed, inject } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-schedule',
  imports: [RouterLink],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule {

   //Läser in service
  scheduleService = inject(ScheduleService);

  //Hämtar signal signal schedule från servicen.
  mySchedule = this.scheduleService.schedule;

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
