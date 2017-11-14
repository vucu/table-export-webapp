export class CustomerData {
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

  getField(customerId:number,fieldName:string):string {
    if (this.data.has(customerId)) {
      if (this.data.get(customerId).has(fieldName)) {
        return this.data.get(customerId).get(fieldName);
      }
    }

    return "";
  }

  // Update a customer fields
  updateField(customerId:number,fieldName:string,fieldValue:string) {
    if (this.data.has(customerId)) {
      return this.data.get(customerId).set(fieldName,fieldValue);
    }
  }
}
