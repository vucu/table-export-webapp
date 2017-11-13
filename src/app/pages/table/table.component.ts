import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  table:number[][]
  cols = 5;
  rows = 20;

  ngOnInit() {
    let i,j:number;
    for (i=0;i<this.cols;i++) {
      let a:number[];
      for (j=0;j<this.rows;j++) {
        a.push(Math.random()*100);
      }
      this.table.push(a);
    }
  }

}
