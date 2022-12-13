import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-tutor-requests',
  templateUrl: './tutor-requests.component.html',
  styleUrls: ['./tutor-requests.component.scss']
})
export class TutorRequestsComponent implements OnInit {
  @Input() tutor: any; 
  requests: any;
  loading = false;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.getTutorRequests();
  }

  getTutorRequests() {
    this.loading = true;

    this.api.get(`tutor-requests/${this.tutor.tutor.id}}`).subscribe(res => {
      console.log('requests', res);
      this.requests = res.tutorRequests;
      this.loading = false;
    });
  }

  decline(requestId: any) {
    if(confirm("Are you sure you want to decline this new tutor request?")) {
      this.api.post(`decline-tutor/${this.tutor.tutor.id}/${requestId}`).subscribe(res => {
        console.log('requests', res);
        if(res.success==400){
          return;
        }
        this.getTutorRequests();
      });
    }
  }

  accept(requestId: any) {
    if(confirm("Are you sure you want to accept this new tutor request?")) {
      this.api.post(`accept-tutor/${this.tutor.tutor.id}/${requestId}`).subscribe(res => {
        console.log('requests', res);
        if(res.success==400){
          return;
        }
        this.getTutorRequests();
      });
    }
  }

}
