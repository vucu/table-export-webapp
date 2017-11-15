import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import * as jsPDF from 'jspdf'
import * as html2canvas from 'html2canvas';

import {CustomerData} from "../../models/CustomerData";

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  customerData:CustomerData;
  fields:string[] = [];

  newFieldData:string = "";
  newCustomerData:string[] = [];
  editCustomerData:string[] = [];
  editCustomerMode:boolean = false;
  editCustomerId:number = -1;

  private loadSampleData() {
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

  createField() {
    if (this.newFieldData) {
      this.fields.push(this.newFieldData);
    }
    this.newFieldData = "";
  }

  deleteField(index:number) {
    let field:string = this.fields[index];
    this.customerData.deleleField(field);
    this.fields.splice(index,1);
  }

  createNewCustomer() {
    var id;
    id = this.customerData.createCustomer();
    for (var i=0;i<this.fields.length;i++) {
      let fieldName:string = this.fields[i];
      let fieldValue:string = this.newCustomerData[i];
      this.customerData.updateField(id,fieldName,fieldValue);
    }
    this.newCustomerData = [];
  }

  resetNewCustomerInput() {
    this.newCustomerData = [];
  }

  deleteCustomer(customerId:number) {
    this.customerData.deleteCustomer(customerId);
  }

  editCustomer(customerId:number) {
    this.editCustomerData = [];
    for (let field of this.fields) {
      this.editCustomerData.push(this.customerData.getField(customerId,field));
    }
    this.editCustomerMode = true;
    this.editCustomerId = customerId;
  }

  editCustomerDone() {
    for (var i=0;i<this.fields.length;i++) {
      this.customerData.updateField(this.editCustomerId,this.fields[i],this.editCustomerData[i]);
    }

    this.editCustomerData = [];
    this.editCustomerMode = false;
    this.editCustomerId = -1;
  }

  editCustomerCancel() {
    this.editCustomerData = [];
    this.editCustomerMode = false;
    this.editCustomerId = -1;
  }

  private generateTable():string[][] {
    var table:string[][] = [];

    var tr:string[] = [];

    for (let field of this.fields) {
      tr.push(field);
    }
    table.push(tr);

    for (let customerId of this.customerData.getCustomerList()) {
      tr = [];
      for (let field of this.fields) {
        tr.push(this.customerData.getField(customerId,field));
      }
      table.push(tr);
    }

    return table;
  }

  exportToPdf() {
    window.alert("backend!")
  }

  exportToCsv() {
    var table:string[][] = this.generateTable();
    new Angular2Csv(table,"Report-"+Date.now());
  }
}
