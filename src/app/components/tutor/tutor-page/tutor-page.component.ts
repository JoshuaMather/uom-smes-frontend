import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-tutor-page',
  templateUrl: './tutor-page.component.html',
  styleUrls: ['./tutor-page.component.scss']
})
export class TutorPageComponent implements OnInit {

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    let students = this.api.get('students/7').subscribe(a => {
      console.log(a);
    });
    console.log(students);  
  }

}