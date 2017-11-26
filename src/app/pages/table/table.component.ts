import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import {CustomerDataContainer} from "../../models/CustomerDataContainer";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

class CustomerData {
  customerId: number;
  fieldName: string;
  fieldValue: string;
}

class FieldName {
  name: string;
}

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  customerDataContainer:CustomerDataContainer;
  fields:string[] = [];
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
  private loadData() {
    this.customerDataContainer = new CustomerDataContainer();

    // Get field names
    this.loadFieldNames(true);

    // Get customer's ids
    this.loadCustomerDatas(true);
  }

  ngOnInit() {
    this.loadData();
  }

  createField() {
    if (this.newFieldData) {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(environment.apiEndPoint+"/field-names",{
        "name":this.newFieldData
      }, { headers: headers }).subscribe(data=>{
        this.loadFieldNames();
      }, err => {
        this.loadFieldNames();
      });

    }
    this.newFieldData = "";
  }

  deleteField(index:number) {
/*    let field:string = this.fields[index];
    this.customerDataContainer.deleleField(field);
    this.fields.splice(index,1);*/
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
    this.newCustomerData = [];
  }

  deleteCustomer(customerId:number) {
    this.customerDataContainer.deleteCustomer(customerId);
  }

  editCustomer(customerId:number) {
    this.editCustomerData = [];
    for (let field of this.fields) {
      this.editCustomerData.push(this.getField(customerId,field));
    }
    this.editCustomerMode = true;
    this.editCustomerId = customerId;
  }

  editCustomerDone() {
    for (var i=0;i<this.fields.length;i++) {
      this.customerDataContainer.updateField(this.editCustomerId,this.fields[i],this.editCustomerData[i]);
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

    for (let customerId of this.customerDataContainer.getCustomerList()) {
      tr = [];
      for (let field of this.fields) {
        tr.push(this.getField(customerId,field));
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
