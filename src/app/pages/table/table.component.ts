import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import {CustomerData} from "../../models/CustomerData";

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  customerData:CustomerData;
  fields:string[] = [];

  loadSampleData() {
    this.fields.push("Họ");
    this.fields.push("Đệm");
    this.fields.push("Tên");

    this.customerData = new CustomerData();

    var id;
    id = this.customerData.createCustomer();
    this.customerData.updateField(id,"Họ","Nguyễn");
    this.customerData.updateField(id,"Đệm","Văn");
    this.customerData.updateField(id,"Tên","Long");
    id = this.customerData.createCustomer();
    this.customerData.updateField(id,"Họ","Nguyễn");
    this.customerData.updateField(id,"Đệm","Thị Minh");
    this.customerData.updateField(id,"Tên","Khai");
    id = this.customerData.createCustomer();
    this.customerData.updateField(id,"Họ","Ngô");
    this.customerData.updateField(id,"Đệm","Văn");
    this.customerData.updateField(id,"Tên","Tự");
  }

  ngOnInit() {
    this.loadSampleData();
  }

  exportToCsv(event) {

  }

  createField(event) {

  }

  createCustomer(event) {

  }
}
