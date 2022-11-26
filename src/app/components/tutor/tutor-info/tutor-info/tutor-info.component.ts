import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutor-info',
  templateUrl: './tutor-info.component.html',
  styleUrls: ['./tutor-info.component.scss']
})
export class TutorInfoComponent implements OnInit {
  @Input() tutor: any; 

  constructor() { }

  ngOnInit(): void {
  }

}
