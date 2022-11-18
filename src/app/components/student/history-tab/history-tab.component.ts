import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-history-tab',
  templateUrl: './history-tab.component.html',
  styleUrls: ['./history-tab.component.scss']
})
export class HistoryTabComponent implements OnInit {
  @Input() studentInfo : any;
  @ViewChild('blackboardPaginator') blackboardPaginator!: MatPaginator;
  @ViewChild('spotPaginator') spotPaginator!: MatPaginator;
  @ViewChild('gitPaginator') gitPaginator!: MatPaginator;

  dataSourceBlackboard!: MatTableDataSource<any>;
  dataSourceSpot!: MatTableDataSource<any>;
  dataSourceGit!: MatTableDataSource<any>;

  history: any;

  constructor() { }

  ngOnInit(): void {
    this.groupHistory();
  }

  ngAfterViewInit() {
    this.dataSourceBlackboard.paginator = this.blackboardPaginator;
    this.dataSourceSpot.paginator = this.spotPaginator;
    this.dataSourceGit.paginator = this.gitPaginator;
}

  groupHistory() {
    let historyList = this.studentInfo.student_last;

    // group history by type
    const groupBy = (array: any[]) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue.type] = result[currentValue.type] || []).push(
          currentValue
        );
        return result;
      }, {});
    };

    const groupedHistory = groupBy(historyList);
    
    this.history = groupedHistory;

    this.dataSourceBlackboard = new MatTableDataSource(this.history.blackboard);
    this.dataSourceSpot = new MatTableDataSource(this.history.spot);
    this.dataSourceGit = new MatTableDataSource(this.history.git);
    console.log(this.dataSourceBlackboard);
  }

  click() {

  }

}
