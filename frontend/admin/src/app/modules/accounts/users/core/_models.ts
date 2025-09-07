export interface UserDetailsModel {
  personal_info: {
    fname: string
    lname: string
    mname: string
    suffix: string
    birthdate: string
    gender: string
    contact_no: string
    address: string
    image_cover?: string,
    full_name:string,
    birth_date_format:string,
  }
  user: {
    email: string
  }
  roles: number | null
  modules: string[]
}

export interface UserListModel {
    id_encrypted:string
    account_no:string
    fullname:string
    email:string
    contact_no:string
    gender:string
    image_cover:string
    role:string
}