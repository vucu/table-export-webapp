export class CustomerDataContainer {
  // map: customerId,<fieldName,fieldValue>
  private data:Map<number,Map<string,string>> = new Map();
  private idCount = 0;

  constructor() {

  }

  // Create a new customer. Return an unique id, which is used in subsequent functions
  createCustomer():number {
    let id = this.idCount;
    this.data.set(id,new Map());

    this.idCount+=1;
    return id;
  }

  deleteCustomer(customerId:number) {
    if (this.data.has(customerId)) {
      this.data.delete(customerId);
    }
  }

  // Return a list of all customer ids
  getCustomerList():number[] {
    return Array.from(this.data.keys());
  }



  updateField(customerId:number,fieldName:string,fieldValue:string) {
    if (this.data.has(customerId)) {
      return this.data.get(customerId).set(fieldName,fieldValue);
    }
  }

  deleleField(fieldName:string) {
    this.data.forEach(function (value, key) {
      if (value.has(fieldName)) {
        value.delete(fieldName);
      }
    })
  }
}
