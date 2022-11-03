import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-tutor-page',
  templateUrl: './tutor-page.component.html',
  styleUrls: ['./tutor-page.component.scss']
})
export class TutorPageComponent implements OnInit {
  public tutor: any;

  constructor(
    private api: ApiService,
    private data: DataService,
  ) { }

  ngOnInit(): void {
    this.tutor = this.data.getUser();
  }

}