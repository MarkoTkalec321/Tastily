export interface Address {
  id: number;
  streetName: string;
}
export interface UserDetails {
  id:number;
  fullname: string;
  username: string;
  email: string;
  addressDto: Address;
}
