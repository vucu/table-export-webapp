import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  cols = 5;
  rows = 20;
  tableHeader:string[] = [];
  table:string[][] = [];

  ngOnInit() {
    var i,j:number;
    for (i=0;i<this.cols;i++) {
      var s:string;
      s = "Column " + (i+1);
      this.tableHeader.push(s);
    }

    for (i=0;i<this.rows;i++) {
      var a:string[] = [];
      for (j=0;j<this.cols;j++) {
        a.push((Math.random()*100).toFixed(2));
      }
      this.table.push(a);
    }
  }

  exportToCsv(event) {
    new Angular2Csv(this.table,"Output");
  }

}
