import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import {CustomerDataContainer} from "../../models/CustomerDataContainer";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RequestOptions} from "@angular/http";

class CustomerData {
  customerId: number;
  fieldName: string;
  fieldValue: string;
}

class FieldName {
  id: number;
  name: string;
}

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  statusString: string = "";

  newFieldData:string = "";
  newCustomerData:string[] = [];
  editCustomerData:string[] = [];
  editCustomerMode:boolean = false;
  editCustomerId:number = -1;

  fieldNames:FieldName[];
  customerIds:number[] = [];
  customerDatas:Map<number,CustomerData[]> = new Map();

  constructor(private http: HttpClient) {};

  private loadFieldNames(notify:boolean=false) {
    if (notify) {
      this.statusString = "Loading field names...";
    }
    this.http.get<FieldName[]>(environment.apiEndPoint+"/field-names").subscribe(data=>{
      this.fieldNames = data;
      this.newCustomerData.length = this.fieldNames.length;
      if (notify) {
        this.statusString = "Done connecting";
      }
    });
  }

  private loadCustomerDatas(notify:boolean=false) {
    if (notify) {
      this.statusString = "Loading customers";
    }
    this.http.get<number[]>(environment.apiEndPoint+"/customers").subscribe(data => {
      this.customerIds = data;

      for (let customerId of this.customerIds) {
        // Get data of this specific customer
        this.customerDatas.set(customerId,new Array<CustomerData>());

        this.http.get<CustomerData[]>(environment.apiEndPoint+"/customers/"+customerId).subscribe(data=>{
            this.customerDatas.set(customerId,data);
            if (notify) {
              this.statusString = "Done connecting";
            }
          }
        )
      }
    });
  }

  private loadData() {
    // Get field names
    this.loadFieldNames(true);

    // Get customer's ids
    this.loadCustomerDatas(true);
  }

  ngOnInit() {
    this.loadData();
  }

  getField(customerId:number,fieldName:string):string {
    if (this.customerDatas.has(customerId)) {
      for (let customerData of this.customerDatas.get(customerId)) {
        if (customerData.fieldName==fieldName) {
          return customerData.fieldValue;
        }
      }
    }

    return "";
  }

  createField() {
    if (this.newFieldData) {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(environment.apiEndPoint+"/field-names",{
        "name":this.newFieldData,
        "id":0
      }, { headers: headers }).subscribe(data=>{
        this.loadFieldNames();
      }, err => {
        this.loadFieldNames();
      });

    }
    this.newFieldData = "";
  }

  deleteField(fieldNameId:number) {
    this.http.delete(environment.apiEndPoint+"/field-names/"+fieldNameId).subscribe(
      data=>{
        this.loadFieldNames();
        this.loadCustomerDatas();
      }, err=>{
        this.loadFieldNames();
        this.loadCustomerDatas();
      }
    );
  }

  createNewCustomer() {
    var id;

    // Create a new customers on the backend. Return its id
    this.http.get<number>(environment.apiEndPoint+"/new-customer").subscribe(
      data=>{
        id = data;

        // Then add the new customer data
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        for (var i=0;i<this.fieldNames.length;i++) {
          let fieldName: string = this.fieldNames[i].name;
          let fieldValue: string = this.newCustomerData[i];
          this.http.post(environment.apiEndPoint+"/customers",{
            "customerId":id,
            "fieldName":fieldName,
            "fieldValue":fieldValue
          }, {headers:headers}).subscribe(data=>{
            this.loadCustomerDatas();
            this.newCustomerData[i] = "";
          }, data=>{
            this.loadCustomerDatas();
            this.newCustomerData[i] = "";
          })
        }
      }
    )
  }

  resetNewCustomerInput() {
    this.newCustomerData = new Array<string>(this.fieldNames.length);
  }

  deleteCustomer(customerId:number) {
    this.http.delete(environment.apiEndPoint+"/customers/"+customerId).subscribe(
      data=>{
        this.loadCustomerDatas();
      }, err=>{
        this.loadCustomerDatas();
      }
    );
  }

  editCustomer(customerId:number) {
    this.editCustomerData = [];
    for (let fieldName of this.fieldNames) {
      this.editCustomerData.push(this.getField(customerId,fieldName.name));
    }
    this.editCustomerMode = true;
    this.editCustomerId = customerId;
  }

  editCustomerDone() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    for (var i=0;i<this.fieldNames.length;i++) {
      // Update this field
      let id: number = this.editCustomerId;
      let fieldName: string = this.fieldNames[i].name;
      let fieldValue: string = this.editCustomerData[i];
      this.http.post(environment.apiEndPoint+"/customers",{
        "customerId":id,
        "fieldName":fieldName,
        "fieldValue":fieldValue
      }, {headers:headers}).subscribe(data=>{
        this.loadCustomerDatas();
        this.editCustomerData[i] = "";
      }, data=>{
        this.loadCustomerDatas();
        this.editCustomerData[i] = "";
      })
    }

    this.editCustomerMode = false;
  }

  editCustomerCancel() {
    this.editCustomerData = [];
    this.editCustomerMode = false;
    this.editCustomerId = -1;
  }

  private generateTable():string[][] {
    var table:string[][] = [];

    var tr:string[] = [];

    for (let fieldName of this.fieldNames) {
      tr.push(fieldName.name);
    }
    table.push(tr);

    for (let customerId of this.customerIds) {
      tr = [];
      for (let fieldName of this.fieldNames) {
        tr.push(this.getField(customerId,fieldName.name));
      }
      table.push(tr);
    }

    return table;
  }

  exportToPdf() {
    window.open(environment.apiEndPoint+"/pdf-report");
  }



  exportToCsv() {
    var table:string[][] = this.generateTable();
    new Angular2Csv(table,"Report-"+Date.now());
  }
}
