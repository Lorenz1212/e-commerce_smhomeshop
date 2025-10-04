export interface AuthModel {
  token: string
}

export interface UserModel {
  id: string
  account_no:string
  email: string
  fullname?: string
  gender: string
  birthdate: string
  age: string
  contact_no?: string
  role_name:string
  image?: string
  auth?: AuthModel
  address?: string
  permissions:any
  user:any
}
