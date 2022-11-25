import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js/auto';

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

  @ViewChild('barGraph', {static: true}) barGraph!: any;

  dataSourceBlackboard!: MatTableDataSource<any>;
  dataSourceSpot!: MatTableDataSource<any>;
  dataSourceGit!: MatTableDataSource<any>;

  history: any;
  chart: any;

  constructor() { }

  ngOnInit(): void {
    this.groupHistory();
    this.createBar();
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
  }

  createBar() {
    let blackboard = [0,0,0,0,0,0,0,0,0,0,0,0];
    let spot = [0,0,0,0,0,0,0,0,0,0,0,0];
    let git = [0,0,0,0,0,0,0,0,0,0,0,0];
    this.studentInfo.student_last.forEach((last: { type: string; week: number; }) => {
      if(last.type=='blackboard') {
        blackboard[last.week-1] += 1;
      } else if(last.type=='spot') {
        spot[last.week-1] += 1;
      } else if(last.type=='git') {
        git[last.week-1] += 1;
      }
    });

    let historyDatasets = [];

    historyDatasets.push({
      label: 'Blackboard',
      data: blackboard,
    });
    historyDatasets.push({
      label: 'Spot',
      data: spot,
    });
    historyDatasets.push({
      label: 'Git',
      data: git,
    });

    this.chart = new Chart(this.barGraph.nativeElement, {
      type: 'bar',

      data: {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12'], 
	       datasets: historyDatasets,
      },
      options: {
        scales: {
          y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: 'Amount'
              }
          },
          x: {
            title: {
              display: true,
              text: 'Week'
            }
        }
      }
      }
      
    });
  }

  click() {

  }

}
