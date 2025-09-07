export interface CustomerDetailsModel {
  personal_info: {
    fname: string
    lname: string
    mname: string
    suffix: string
    birthdate: string
    gender: string
    phone: string
    address: string
    image_cover?: string,
    full_name:string,
    birth_date_format:string,
    email:string,
  }
}


export interface CustomerListModel {
    id_encrypted:string
    customer_no:string
    fullname:string
    email:string
    phone:string
    gender:string
    image_cover:string
}