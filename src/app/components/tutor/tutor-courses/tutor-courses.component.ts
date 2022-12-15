import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutor-courses',
  templateUrl: './tutor-courses.component.html',
  styleUrls: ['./tutor-courses.component.scss']
})
export class TutorCoursesComponent implements OnInit {
  @Input() tutor: any; 

  constructor() { }

  ngOnInit(): void {
  }

}
