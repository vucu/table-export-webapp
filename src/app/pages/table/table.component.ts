import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

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

}
