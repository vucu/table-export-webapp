export class CustomerData {
  // map: [customerId,fieldName],fieldValue
  data:Map<[number,string],string> = new Map();
  private idCount = 0;

  constructor() {

  }

  // Create a new customer. Return an unique id, which is used in subsequent functions
  createCustomer():number {
    this.idCount+=1;
    return (this.idCount-1);
  }

  deleteCustomer(customerId:number) {
    // Get all keys contain this customer id
    var keys:[number,string][] = [];
    this.data.forEach(function(value, key) {
      if (key[0]==customerId) {
        keys.push(key);
      }
    });

    // Delete
    keys.forEach(function (element) {
      this.data.delete(element);
    })
  }

  // Return a list of all customer ids
  getCustomerList():number[] {
    var customers:Set<number> = new Set();
    this.data.forEach(function(value, key) {
      customers.add(key[0]);
    });
    return Array.from(customers);
  }

  getField(customerId:number,fieldName:string):string {
    let key:[number,string];
    key = [customerId,fieldName];

    if (this.data.has(key)) {
      return this.data.get(key);
    }

    return "";
  }

  // Update a customer fields
  updateField(customerId:number,fieldName:string,fieldValue:string) {
    let key:[number,string];
    key = [customerId,fieldName];
    this.data.set(key,fieldValue);
  }
}
