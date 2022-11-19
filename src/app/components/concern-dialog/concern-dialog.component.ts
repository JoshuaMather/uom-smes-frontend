import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-concern-dialog',
  templateUrl: './concern-dialog.component.html',
  styleUrls: ['./concern-dialog.component.scss']
})
export class ConcernDialogComponent implements OnInit {
  concern: any;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<ConcernDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
