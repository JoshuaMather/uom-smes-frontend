import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss']
})
export class StudentInfoComponent implements OnInit {
  @Input() studentInfo : any;
  

  constructor() { }

  ngOnInit(): void {

  }

}
