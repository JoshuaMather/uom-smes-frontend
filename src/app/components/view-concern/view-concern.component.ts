import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-view-concern',
  templateUrl: './view-concern.component.html',
  styleUrls: ['./view-concern.component.scss']
})
export class ViewConcernComponent implements OnInit {
  concerns = [];
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<ViewConcernComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.getConcerns();
  }

  getConcerns() {
    this.api.get(`concerns/${this.data.id}`).subscribe(res => {
      console.log('concerns', res);
      this.concerns = res.concerns;
      this.loading = false;
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
